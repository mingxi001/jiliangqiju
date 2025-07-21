<template>
  <div class="cabinet-keys">
    <h1>计量柜密钥管理</h1>
    <el-card>
      <div slot="header" class="card-header">
        <span>密钥列表</span>
      </div>
      <el-table :data="keys" style="width: 100%">
        <el-table-column prop="id" label="序号" width="80"></el-table-column>
        <el-table-column prop="name" label="地址" width="180"></el-table-column>
        <el-table-column prop="cabinetName" label="所属计量柜" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'ACTIVE' ? 'success' : 'danger'">{{ scope.row.status === 'ACTIVE' ? '激活' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewKey(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

  <!-- 密钥详情模态框 -->
  <el-dialog
    v-model="showKeyDetailDialog"
    title="密钥详情"
    width="500px"
    :position="['10%', 'center']"
  >
    <div v-if="selectedKey" class="key-detail-content">
      <div class="detail-item">
        <span class="detail-label">序号:</span>
        <span class="detail-value">{{ selectedKey.id }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">地址:</span>
        <span class="detail-value">{{ selectedKey.name }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">所属计量柜:</span>
        <span class="detail-value">{{ selectedKey.cabinetName }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">状态:</span>
        <span :class="selectedKey.status === 'ACTIVE' ? 'text-success' : 'text-danger'">{{ selectedKey.status === 'ACTIVE' ? '激活' : '禁用' }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">创建时间:</span>
        <span class="detail-value">{{ selectedKey.createTime }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">密钥内容:</span>
        <span class="detail-value">{{ selectedKey.content }}</span>
      </div>
      <div v-if="selectedKey.updateTime" class="detail-item">
        <span class="detail-label">更新时间:</span>
        <span class="detail-value">{{ selectedKey.updateTime }}</span>
      </div>

      <!-- 新增功能区域 -->
      <div class="detail-item actions">
        <span class="detail-label">获取方式:</span>
        <div class="action-buttons">
          <el-button type="primary" size="small" @click="sendKeyBySms">短信获取</el-button>
          <el-button type="success" size="small" @click="showQrCode">扫码获取</el-button>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="showKeyDetailDialog = false">关闭</el-button>
    </template>
  </el-dialog>

  <!-- 二维码模态框 -->
  <el-dialog
    v-model="showQrCodeDialog"
    title="密钥二维码"
    width="300px"
    :position="['10%', 'center']"
  >
    <div class="qr-code-container" v-if="qrCodeUrl">
      <img :src="qrCodeUrl" alt="密钥二维码" class="qr-code-image">
      <p class="qr-code-tip">请扫描二维码获取密钥详情</p>
      <p class="qr-code-expire">* 二维码将在60秒后过期</p>
    </div>
    <template #footer>
      <el-button @click="showQrCodeDialog = false">关闭</el-button>
    </template>
  </el-dialog>

  <!-- 短信输入模态框 -->
  <el-dialog
    v-model="showSmsDialog"
    title="短信获取密钥"
    width="300px"
    :position="['10%', 'center']"
  >
    <el-form ref="smsFormRef" :model="smsForm" :rules="smsRules" label-width="80px">
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input v-model="smsForm.phoneNumber" placeholder="请输入手机号"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showSmsDialog = false">取消</el-button>
      <el-button type="primary" @click="confirmSendSms">发送</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'

export default {
  name: 'CabinetKeys',
  setup() {
    const store = useStore()
    const showKeyDetailDialog = ref(false)
    const showQrCodeDialog = ref(false)
    const showSmsDialog = ref(false)
    const selectedKey = ref(null)
    const qrCodeUrl = ref('')
    const smsForm = ref({
      phoneNumber: ''
    })
    const smsRules = ref({
      phoneNumber: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
      ]
    })
    const cabinets = computed(() => store.state.cabinets || [])
    let qrCodeExpireTimer = null

    // 实时获取密钥数据
    const keys = computed(() => {
      const allKeys = store.getters.allKeys || []
      // 同步更新密钥所属的计量柜名称
      return allKeys.map(key => {
        const cabinet = cabinets.value.find(c => c.id === key.cabinetId)
        return {
          ...key,
          cabinetName: cabinet ? cabinet.name : '未知计量柜'
        }
      })
    })

    // 查看密钥
    const viewKey = (key) => {
      selectedKey.value = { ...key }
      showKeyDetailDialog.value = true
      
      // 记录密钥查看
      store.commit('addKeyViewRecord', {
        keyId: key.id,
        cabinetId: key.cabinetId,
        viewTime: new Date().toISOString()
      })
    }

    // 显示短信输入框
    const sendKeyBySms = () => {
      smsForm.value.phoneNumber = ''
      showSmsDialog.value = true
    }

    // 确认发送短信
    const confirmSendSms = () => {
      // 这里只是模拟发送短信
      // 实际项目中，这里应该调用后端API发送短信
      ElMessage.success(`密钥详情已发送到手机 ${smsForm.value.phoneNumber}`)
      showSmsDialog.value = false

      // 记录短信发送
      store.commit('addKeySmsRecord', {
        keyId: selectedKey.value.id,
        cabinetId: selectedKey.value.cabinetId,
        phoneNumber: smsForm.value.phoneNumber,
        sendTime: new Date().toISOString()
      })
    }

    // 显示二维码
    const showQrCode = () => {
      // 生成模拟的二维码URL
      // 实际项目中，这里应该调用后端API生成真实的二维码
      qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=密钥ID:${selectedKey.value.id},内容:${selectedKey.value.content}`
      showQrCodeDialog.value = true

      // 设置二维码过期时间
      clearTimeout(qrCodeExpireTimer)
      qrCodeExpireTimer = setTimeout(() => {
        showQrCodeDialog.value = false
        ElMessage.info('二维码已过期，请重新生成')
      }, 60000)

      // 记录二维码生成
      store.commit('addKeyQrCodeRecord', {
        keyId: selectedKey.value.id,
        cabinetId: selectedKey.value.cabinetId,
        generateTime: new Date().toISOString()
      })
    }

    // 监听对话框关闭，清除计时器
    watch(showQrCodeDialog, (newValue) => {
      if (!newValue) {
        clearTimeout(qrCodeExpireTimer)
      }
    })

    // 监听密钥数据变化，如果当前查看的密钥被修改，则更新详情
    watch(keys, (newKeys) => {
      if (selectedKey.value && showKeyDetailDialog.value) {
        const updatedKey = newKeys.find(k => k.id === selectedKey.value.id)
        if (updatedKey) {
          selectedKey.value = { ...updatedKey }
        }
      }
    }, { deep: true })

    return {
      keys,
      viewKey,
      sendKeyBySms,
      showQrCode,
      confirmSendSms,
      showKeyDetailDialog,
      showQrCodeDialog,
      showSmsDialog,
      selectedKey,
      qrCodeUrl,
      smsForm,
      smsRules
    }
  }
}
</script>

<style scoped>
.cabinet-keys {
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
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

.actions {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.qr-code-image {
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
}

.qr-code-tip {
  margin-bottom: 5px;
  font-size: 14px;
}

.qr-code-expire {
  font-size: 12px;
  color: #999;
}

.text-success {
  color: #67c23a;
}

.text-danger {
  color: #f56c6c;
}
</style>