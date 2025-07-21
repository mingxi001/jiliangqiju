<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-title">计量管理系统</div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="80px">
        <el-form-item label="工号" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入工号"
            clearable
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="password">
          <el-input
            type="text"
            v-model="loginForm.password"
            placeholder="请输入姓名"
            clearable
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    const loginForm = ref({
      username: '',
      password: ''
    })
    const welcomeMessage = ref('')

    const loginRules = ref({
      username: [
        { required: true, message: '请输入工号', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ]
    })

    // 同步个人信息并更新欢迎词
    const syncPersonalInfo = () => {
      if (loginForm.value.username && loginForm.value.password) {
        welcomeMessage.value = `欢迎，${loginForm.value.password}（工号：${loginForm.value.username}）`
        // 使用 setTimeout 延迟同步到 store，避免阻塞输入
        setTimeout(() => {
          // 同步到 store 中
          store.commit('setUserInfo', {
            username: loginForm.value.username,
            name: loginForm.value.password
          })
        }, 0)
      } else {
        welcomeMessage.value = ''
      }
    }

    const handleLogin = () => {
      // 模拟表单验证
      if (!loginForm.value.username || !loginForm.value.password) {
        ElMessage.error('工号和姓名不能为空')
        return
      }

      // 模拟登录成功
      // 保存用户信息到 localStorage
      const userInfo = {
        username: loginForm.value.username,
        name: loginForm.value.password,
        employeeId: loginForm.value.username
      }
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      console.log('用户信息已保存到localStorage:', userInfo)

      // 触发 storage 事件，通知其他组件
      window.dispatchEvent(new Event('storage'))

      // 重置登录表单
      loginForm.value = {
        username: '',
        password: ''
      }

      router.push({ name: 'Home' })
      ElMessage.success(`登录成功，欢迎 ${userInfo.name}`)
    }

    return {
      loginForm,
      loginRules,
      handleLogin,
      syncPersonalInfo,
      welcomeMessage
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #303133;
}

.welcome-message {
  text-align: center;
  margin-bottom: 15px;
  color: #606266;
  font-size: 16px;
}
</style>