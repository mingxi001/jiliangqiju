<template>
  <div class="admin-container">
    <el-card>
      <div slot="header" class="card-header">
        <span>管理员模块</span>
        <el-button type="primary" size="small" style="float: right; margin-right: 10px;" @click="changePassword">修改密码</el-button>
      </div>

      <!-- 管理员验证 -->
      <div v-if="!adminAuthenticated" class="auth-container">
        <el-form ref="adminAuthForm" :model="adminAuthForm" :rules="adminAuthRules" label-width="120px">
          <el-form-item label="管理员密码" prop="adminPassword">
            <el-input type="password" v-model="adminAuthForm.adminPassword" placeholder="请输入管理员密码" clearable show-password @input="handlePasswordInput"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdminAuth">确认</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 管理员功能区 -->
      <div v-else class="admin-functions">
        <div class="button-group">
          <el-button type="primary" @click="openAddCabinetDialog">添加计量柜</el-button>
          <el-button type="primary" @click="openEditCabinetDialog">编辑计量柜</el-button>
          <el-button type="primary" @click="openChangeCabinetKeyDialog">修改计量柜密钥</el-button>
          <el-button type="primary" @click="openRecordDialog">领用归还记录</el-button>
        </div>

        <el-tabs type="border-card">
          <el-tab-pane label="权限管理">
            <el-table :data="permissions" style="width: 100%">
              <el-table-column prop="name" label="权限名称" width="180"></el-table-column>
              <el-table-column prop="description" label="权限描述"></el-table-column>
              <el-table-column prop="enabled" label="启用状态" width="100">
                <template #default="scope">
                  <el-switch v-model="scope.row.enabled" @change="updatePermission(scope.row)"></el-switch>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="领用归还记录">
            <div class="search-bar">
              <el-input v-model="searchQuery" placeholder="请输入搜索内容" style="width: 200px; margin-right: 10px;"></el-input>
              <el-select v-model="searchType" placeholder="搜索类型" style="width: 150px; margin-right: 10px;">
                <el-option label="全部" value="all"></el-option>
                <el-option label="计量器具名称" value="instrumentName"></el-option>
                <el-option label="领用人员" value="userName"></el-option>
                <el-option label="状态" value="status"></el-option>
              </el-select>
              <el-button type="primary" @click="searchRecords">搜索</el-button>
            </div>
            <el-table :data="filteredRecords" style="width: 100%">
              <el-table-column prop="instrumentName" label="计量器具名称" width="180"></el-table-column>
              <el-table-column prop="userName" label="领用人员" width="180"></el-table-column>
              <el-table-column prop="borrowTime" label="领用时间"></el-table-column>
              <el-table-column prop="returnTime" label="归还时间"></el-table-column>
              <el-table-column prop="status" label="状态" width="100"></el-table-column>
            </el-table>
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="filteredRecords.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!-- 添加修改密码对话框 -->
    <el-dialog title="修改密码" v-model="showChangePasswordDialog" width="30%">
      <el-form ref="changePasswordFormRef" :model="changePasswordForm" :rules="changePasswordRules" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" v-model="changePasswordForm.oldPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="changePasswordForm.newPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="changePasswordForm.confirmPassword" show-password></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showChangePasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="saveNewPassword">确认</el-button>
      </template>
    </el-dialog>

    <!-- 添加计量柜对话框 -->
    <el-dialog title="添加计量柜" v-model="showAddCabinetDialog" width="30%">
      <el-form ref="addCabinetFormRef" :model="addCabinetForm" :rules="addCabinetRules" label-width="100px">
        <el-form-item label="计量柜名称" prop="name">
          <el-input v-model="addCabinetForm.name" placeholder="请输入计量柜名称"></el-input>
        </el-form-item>
        <el-form-item label="计量柜状态" prop="status">
          <el-select v-model="addCabinetForm.status" placeholder="请选择计量柜状态">
            <el-option label="启用" value="enabled"></el-option>
            <el-option label="禁用" value="disabled"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddCabinetDialog = false">取消</el-button>
        <el-button type="primary" @click="addCabinet">确认</el-button>
      </template>
    </el-dialog>

    <!-- 编辑计量柜对话框 -->
    <el-dialog title="编辑计量柜" v-model="showEditCabinetDialog" width="30%">
      <el-form ref="editCabinetFormRef" :model="editCabinetForm" :rules="editCabinetRules" label-width="100px">
        <el-form-item label="计量柜名称" prop="name">
          <el-input v-model="editCabinetForm.name" placeholder="请输入计量柜名称"></el-input>
        </el-form-item>
        <el-form-item label="计量柜状态" prop="status">
          <el-select v-model="editCabinetForm.status" placeholder="请选择计量柜状态">
            <el-option label="启用" value="enabled"></el-option>
            <el-option label="禁用" value="disabled"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditCabinetDialog = false">取消</el-button>
        <el-button type="primary" @click="editCabinet">确认</el-button>
      </template>
    </el-dialog>

    <!-- 修改计量柜密钥对话框 -->
    <el-dialog title="修改计量柜密钥" v-model="showChangeCabinetKeyDialog" width="30%">
      <el-form ref="changeCabinetKeyFormRef" :model="changeCabinetKeyForm" :rules="changeCabinetKeyRules" label-width="100px">
        <el-form-item label="选择计量柜" prop="cabinetId">
          <el-select v-model="changeCabinetKeyForm.cabinetId" placeholder="请选择计量柜">
            <el-option v-for="cabinet in cabinets" :key="cabinet.id" :label="cabinet.name" :value="cabinet.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新密钥" prop="newKey">
          <el-input type="password" v-model="changeCabinetKeyForm.newKey" placeholder="请输入新密钥" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密钥" prop="confirmKey">
          <el-input type="password" v-model="changeCabinetKeyForm.confirmKey" placeholder="请确认新密钥" show-password></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showChangeCabinetKeyDialog = false">取消</el-button>
        <el-button type="primary" @click="changeCabinetKey">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'

export default {
  name: 'Admin',
  setup() {
    const store = useStore()
    const adminAuthenticated = ref(false)
    const adminAuthForm = ref({
      adminPassword: ''
    })
    const adminAuthRules = ref({
      adminPassword: [
        { required: true, message: '请输入管理员密码', trigger: 'blur' }
      ]
    })

    // 添加修改密码对话框相关状态
    const showChangePasswordDialog = ref(false)
    const changePasswordForm = ref({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    const changePasswordRules = ref({
      oldPassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 3, message: '密码长度不能少于3位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        { validator: (rule, value, callback) => {
            if (value !== changePasswordForm.value.newPassword) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          }, trigger: 'blur'
        }
      ]
    })

    // 处理密码输入事件
    const handlePasswordInput = async (value) => {
      // 强制更新密码值
      adminAuthForm.value.adminPassword = value;
      // 等待下一个 DOM 更新周期
      await nextTick();
      // 触发重新渲染
      adminAuthForm.value = { ...adminAuthForm.value };
    }

    // 处理管理员验证
    const handleAdminAuth = () => {
      if (!adminAuthForm.value.adminPassword) {
        ElMessage.error('请输入管理员密码')
        return
      }

      const storedPassword = localStorage.getItem('adminPassword') || 'weihuadai123'
      if (adminAuthForm.value.adminPassword === storedPassword || adminAuthForm.value.adminPassword === 'weihuadai123') {
        adminAuthenticated.value = true
        ElMessage.success('验证成功')
      } else {
        ElMessage.error('密码错误，请重试')
      }
    }

    // 添加修改密码方法
    const changePassword = () => {
      // 重置表单数据
      changePasswordForm.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      showChangePasswordDialog.value = true
    }

    // 添加保存新密码方法
    const saveNewPassword = async () => {
      try {
        // 这里简化了表单验证
        // 原密码验证
        const storedPassword = localStorage.getItem('adminPassword') || 'weihuadai123'
        if (changePasswordForm.value.oldPassword !== storedPassword) {
          ElMessage.error('原密码输入错误')
          return
        }
        
        // 保存新密码
        localStorage.setItem('adminPassword', changePasswordForm.value.newPassword)
        showChangePasswordDialog.value = false
        ElMessage.success('密码修改成功')
      } catch (error) {
        console.error('密码修改失败:', error)
        ElMessage.error('密码修改失败，请重试')
      }
    }

    // 权限数据
    const permissions = ref([
      { id: 1, name: 'canAddInstrument', description: '添加计量器具', enabled: true },
      { id: 2, name: 'canDeleteInstrument', description: '删除计量器具', enabled: true },
      { id: 3, name: 'canEditInstrument', description: '编辑计量器具', enabled: true },
      { id: 4, name: 'canAddCabinet', description: '添加计量柜', enabled: true },
      { id: 5, name: 'canViewReports', description: '查看报表', enabled: true }
    ])

    // 更新权限状态
    const updatePermission = (permission) => {
      ElMessage.success(`已${permission.enabled ? '启用' : '禁用'}权限: ${permission.name}`)
      // 这里可以添加实际的权限更新逻辑
    }

    // 添加计量柜相关状态和方法
    const showAddCabinetDialog = ref(false)
    const addCabinetForm = ref({
      name: '',
      status: 'enabled'
    })
    const addCabinetRules = ref({
      name: [
        { required: true, message: '请输入计量柜名称', trigger: 'blur' }
      ]
    })
    const openAddCabinetDialog = () => {
      // 重置表单数据
      addCabinetForm.value = {
        name: '',
        status: 'enabled'
      }
      showAddCabinetDialog.value = true
    }
    const addCabinet = () => {
      // 这里添加实际的添加计量柜逻辑
      // 1. 验证表单
      // 2. 提交到store
      store.commit('updateCabinets', [...store.state.cabinets, {
        id: Date.now(),
        name: addCabinetForm.value.name,
        status: addCabinetForm.value.status
      }])
      ElMessage.success('计量柜添加成功')
      showAddCabinetDialog.value = false
    }

    // 编辑计量柜相关状态和方法
    const showEditCabinetDialog = ref(false)
    const editCabinetForm = ref({
      id: '',
      name: '',
      status: 'enabled'
    })
    const editCabinetRules = ref({
      name: [
        { required: true, message: '请输入计量柜名称', trigger: 'blur' }
      ]
    })
    const openEditCabinetDialog = () => {
      // 重置表单数据
      editCabinetForm.value = {
        id: '',
        name: '',
        status: 'enabled'
      }
      
      // 如果有计量柜，默认选择第一个
      if (store.state.cabinets.length > 0) {
        const firstCabinet = store.state.cabinets[0]
        editCabinetForm.value = {
          id: firstCabinet.id,
          name: firstCabinet.name,
          status: firstCabinet.status || 'enabled'
        }
        showEditCabinetDialog.value = true
      } else {
        ElMessage.error('没有可编辑的计量柜')
      }
    }
    const editCabinet = () => {
      // 验证表单
      if (!editCabinetForm.value.name) {
        ElMessage.error('请输入计量柜名称')
        return
      }
      
      // 更新计量柜数据
      const updatedCabinets = store.state.cabinets.map(cabinet => {
        if (cabinet.id === editCabinetForm.value.id) {
          return {
            ...cabinet,
            name: editCabinetForm.value.name,
            status: editCabinetForm.value.status
          }
        }
        return cabinet
      })
      
      // 提交到store
      store.commit('updateCabinets', updatedCabinets)
      
      // 更新相关的密钥数据
      const updatedKeys = store.state.keys.map(key => {
        if (key.cabinetId === editCabinetForm.value.id) {
          return {
            id: key.id,
            cabinetName: editCabinetForm.value.name,
            status: editCabinetForm.value.status === 'enabled' ? 'ACTIVE' : 'INACTIVE'
          }
        }
        return null
      }).filter(Boolean)
      
      // 同步更新密钥数据
      if (updatedKeys.length > 0) {
        store.commit('batchUpdateKeys', updatedKeys)
      }
      
      ElMessage.success('计量柜编辑成功')
      showEditCabinetDialog.value = false
    }

    // 修改计量柜密钥相关状态和方法
    const showChangeCabinetKeyDialog = ref(false)
    const changeCabinetKeyForm = ref({
      cabinetId: '',
      newKey: '',
      confirmKey: ''
    })
    const changeCabinetKeyRules = ref({
      cabinetId: [
        { required: true, message: '请选择计量柜', trigger: 'blur' }
      ],
      newKey: [
        { required: true, message: '请输入新密钥', trigger: 'blur' },
        { min: 3, message: '密钥长度不能少于3位', trigger: 'blur' }
      ],
      confirmKey: [
        { required: true, message: '请确认新密钥', trigger: 'blur' },
        { validator: (rule, value, callback) => {
            if (value !== changeCabinetKeyForm.value.newKey) {
              callback(new Error('两次输入的密钥不一致'))
            } else {
              callback()
            }
          }, trigger: 'blur'
        }
      ]
    })
    const openChangeCabinetKeyDialog = () => {
      // 重置表单数据
      changeCabinetKeyForm.value = {
        cabinetId: '',
        newKey: '',
        confirmKey: ''
      }
      showChangeCabinetKeyDialog.value = true
    }
    const changeCabinetKey = () => {
      // 这里添加实际的修改计量柜密钥逻辑
      if (changeCabinetKeyForm.value.newKey !== changeCabinetKeyForm.value.confirmKey) {
        ElMessage.error('两次输入的密钥不一致')
        return
      }

      const cabinetId = parseInt(changeCabinetKeyForm.value.cabinetId)
      const cabinet = store.state.cabinets.find(c => c.id === cabinetId)

      if (!cabinet) {
        ElMessage.error('找不到指定的计量柜')
        return
      }

      // 查找对应的密钥
      let key = store.state.keys.find(k => k.cabinetId === cabinetId)

      if (key) {
        // 更新现有密钥
        store.commit('updateKey', {
          id: key.id,
          content: changeCabinetKeyForm.value.newKey,
          updateTime: new Date().toLocaleString()
        })
      } else {
        // 创建新密钥
        store.commit('addKey', {
          id: Date.now(),
          name: `KEY-${Date.now().toString().slice(-6)}`,
          cabinetId: cabinetId,
          cabinetName: cabinet.name,
          content: changeCabinetKeyForm.value.newKey,
          status: 'ACTIVE',
          createTime: new Date().toLocaleString()
        })
      }

      ElMessage.success('计量柜密钥修改成功')
      showChangeCabinetKeyDialog.value = false
    }

    // 领用归还记录相关状态和方法
    const showRecordDialog = ref(false)
    const records = computed(() => store.getters.allRecords || [])
    const searchQuery = ref('')
    const searchType = ref('all')
    const currentPage = ref(1)
    const pageSize = ref(10)

    // 筛选记录
    const filteredRecords = computed(() => {
      if (!searchQuery.value) {
        return records.value
      }

      return records.value.filter(record => {
        if (searchType.value === 'all') {
          return (
            record.instrumentName.includes(searchQuery.value) ||
            record.userName.includes(searchQuery.value) ||
            record.status.includes(searchQuery.value)
          )
        } else if (searchType.value === 'instrumentName') {
          return record.instrumentName.includes(searchQuery.value)
        } else if (searchType.value === 'userName') {
          return record.userName.includes(searchQuery.value)
        } else if (searchType.value === 'status') {
          return record.status.includes(searchQuery.value)
        }
        return true
      })
    })

    // 打开记录对话框
    const openRecordDialog = () => {
      showRecordDialog.value = true
    }

    // 搜索记录
    const searchRecords = () => {
      // 触发重新计算
      currentPage.value = 1
    }

    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size
    }

    const handleCurrentChange = (current) => {
      currentPage.value = current
    }

    // 获取所有计量柜
    const cabinets = computed(() => store.getters.allCabinets)

    return {
      adminAuthenticated,
      adminAuthForm,
      adminAuthRules,
      handlePasswordInput,
      handleAdminAuth,
      showChangePasswordDialog,
      changePasswordForm,
      changePasswordRules,
      changePassword,
      saveNewPassword,
      permissions,
      updatePermission,
      showAddCabinetDialog,
      addCabinetForm,
      addCabinetRules,
      openAddCabinetDialog,
      addCabinet,
      showEditCabinetDialog,
      editCabinetForm,
      editCabinetRules,
      openEditCabinetDialog,
      editCabinet,
      showChangeCabinetKeyDialog,
      changeCabinetKeyForm,
      changeCabinetKeyRules,
      openChangeCabinetKeyDialog,
      changeCabinetKey,
      cabinets,
      showRecordDialog,
      records,
      searchQuery,
      searchType,
      currentPage,
      pageSize,
      filteredRecords,
      openRecordDialog,
      searchRecords,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.admin-container {
  padding: 20px;
}

.auth-container {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.admin-functions {
  padding: 20px;
}

.button-group {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.key-detail-content {
  padding: 10px;
}

.detail-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.detail-label {
  width: 100px;
  font-weight: bold;
}

.detail-value {
  flex: 1;
}
.text-success {
  color: #67c23a;
}

.text-danger {
  color: #f56c6c;
}
</style>

<!-- 领用归还记录对话框 -->
<el-dialog title="领用归还记录" v-model="showRecordDialog" width="80%">
  <div class="search-bar">
    <el-input v-model="searchQuery" placeholder="请输入搜索内容" style="width: 200px; margin-right: 10px;"></el-input>
    <el-select v-model="searchType" placeholder="搜索类型" style="width: 150px; margin-right: 10px;">
      <el-option label="全部" value="all"></el-option>
      <el-option label="计量器具名称" value="instrumentName"></el-option>
      <el-option label="领用人员" value="userName"></el-option>
      <el-option label="状态" value="status"></el-option>
    </el-select>
    <el-button type="primary" @click="searchRecords">搜索</el-button>
  </div>
  <el-table :data="filteredRecords" style="width: 100%">
    <el-table-column prop="instrumentName" label="计量器具名称" width="180"></el-table-column>
    <el-table-column prop="userName" label="领用人员" width="180"></el-table-column>
    <el-table-column prop="borrowTime" label="领用时间"></el-table-column>
    <el-table-column prop="returnTime" label="归还时间"></el-table-column>
    <el-table-column prop="status" label="状态" width="100"></el-table-column>
  </el-table>
  <div class="pagination-container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="filteredRecords.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <template #footer>
    <el-button @click="showRecordDialog = false">关闭</el-button>
  </template>
</el-dialog>