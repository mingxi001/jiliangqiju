<template>
  <div class="personal">
    <h1>个人中心</h1>
    <el-card>
      <div slot="header" class="card-header">
        <span>个人信息</span>
      </div>
      <div class="user-info">
        <div class="info-item">
          <span class="label">用户名:</span>
          <span class="value">{{ username }}</span>
        </div>
        <div class="info-item">
          <span class="label">工号:</span>
          <span class="value">{{ employeeId }}</span>
        </div>
        <div class="info-item">
          <span class="label">部门:</span>
          <span class="value">{{ department }}</span>
        </div>
        <div class="info-item">
          <span class="label">联系电话:</span>
          <span class="value">{{ phone }}</span>
        </div>
        <div class="info-item">
          <span class="label">邮箱:</span>
          <span class="value">{{ email }}</span>
        </div>
        <el-button type="primary" @click="updateUserInfo">更新信息</el-button>
      </div>
    </el-card>

    <!-- 更新信息对话框 -->
    <el-dialog
      v-model="showUpdateDialog"
      title="更新个人信息"
      width="500px"
    >
      <el-form ref="updateForm" :model="updateForm" :rules="updateRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updateForm.username" @input="handleInput('username', $event)"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="updateForm.department" @input="handleInput('department', $event)"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="updateForm.phone" @input="handleInput('phone', $event)"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email" @input="handleInput('email', $event)"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showUpdateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUpdate">确认</el-button>
      </template>
    </el-dialog>

    <el-card style="margin-top: 20px;">
      <div slot="header" class="card-header">
        <span>我的领用记录</span>
      </div>
      <el-table :data="borrowRecords" style="width: 100%">
        <el-table-column prop="instrumentName" label="计量器具" width="180"></el-table-column>
        <el-table-column prop="borrowTime" label="领用时间" width="180"></el-table-column>
        <el-table-column prop="returnTime" label="归还时间" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'BORROWED' ? 'primary' : 'success'">{{ scope.row.status === 'BORROWED' ? '已领用' : '已归还' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

export default {
  name: 'Personal',
  setup() {
    const store = useStore()
    // 模拟用户数据
    const username = ref('张三')
    const employeeId = ref('10001')
    const department = ref('技术部')
    const phone = ref('13800138000')
    const email = ref('zhangsan@example.com')

    // 从 localStorage 获取用户信息
    const getUserInfoFromLocalStorage = () => {
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo)
          if (parsedUserInfo) {
            username.value = parsedUserInfo.name || '未知'
            employeeId.value = parsedUserInfo.employeeId || '未知'
            console.log('从localStorage加载用户信息成功')
          }
        } catch (error) {
          console.error('解析用户信息失败:', error)
        }
      }
    }

    // 在组件挂载时，从localStorage获取用户信息
    onMounted(() => {
      getUserInfoFromLocalStorage()
    })

    // 监听 localStorage 变化
    window.addEventListener('storage', () => {
      getUserInfoFromLocalStorage()
    })

    // 从store获取当前用户的领用记录
    const borrowRecords = computed(() => {
      // 合并领用和归还记录
      const allRecords = [...(store.state.borrowedRecords || []), ...(store.state.returnedRecords || [])]
      
      // 过滤出当前用户的记录
      return allRecords
        .filter(record => record.employeeId === employeeId.value)
        .map(record => {
          // 统一记录格式
          return {
            instrumentName: record.instrumentName,
            borrowTime: record.borrowTime || '',
            returnTime: record.returnTime || '',
            status: record.returnTime ? 'RETURNED' : 'BORROWED'
          }
        })
    })

    // 监听store中的记录变化
    watch(
      () => [store.state.borrowedRecords, store.state.returnedRecords],
      () => {
        console.log('领用归还记录已更新')
      },
      { deep: true }
    )

    // 更新对话框状态
    const showUpdateDialog = ref(false)
    const updateForm = ref({
      username: username.value,
      department: department.value,
      phone: phone.value,
      email: email.value
    })

    const updateRules = ref({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '请输入联系电话', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
      ],
      email: [
        { required: false, message: '请输入邮箱', trigger: 'blur' },
        { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '请输入正确的邮箱格式', trigger: 'blur' }
      ]
    })

    // 打开更新对话框
    const updateUserInfo = () => {
      updateForm.value = {
        username: username.value,
        department: department.value,
        phone: phone.value,
        email: email.value
      }
      showUpdateDialog.value = true
    }

    // 处理更新
    const handleUpdate = () => {
      // 模拟表单验证
      if (!updateForm.value.username || !updateForm.value.phone) {
        ElMessage.error('请填写完整信息')
        return
      }

      // 模拟更新
      username.value = updateForm.value.username
      department.value = updateForm.value.department
      phone.value = updateForm.value.phone
      email.value = updateForm.value.email

      // 保存用户信息到本地存储
      const userInfo = {
        username: username.value,
        employeeId: employeeId.value
      }
      localStorage.setItem('userInfo', JSON.stringify(userInfo))

      // 手动触发 storage 事件，确保其他组件能够接收到更新
      window.dispatchEvent(new Event('storage'))

      ElMessage.success('更新成功')
      showUpdateDialog.value = false
    }

    // 在 setup 函数中添加 handleInput 函数
    const handleInput = (field, value) => {
      updateForm.value[field] = value;
    }

    return {
      username,
      employeeId,
      department,
      phone,
      email,
      borrowRecords,
      updateUserInfo,
      showUpdateDialog,
      updateForm,
      updateRules,
      handleUpdate
    }
  }
}
</script>

<style scoped>
.personal {
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.user-info {
  padding: 20px;
}

.info-item {
  display: flex;
  margin-bottom: 15px;
}

.label {
  width: 100px;
  font-weight: bold;
}

.value {
  flex: 1;
}
</style>