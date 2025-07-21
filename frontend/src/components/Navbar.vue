<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">
        <span>计量管理系统</span>
      </div>
      <div class="navbar-menu">
        <router-link to="/" class="menu-item" active-class="active">首页</router-link>
        <router-link to="/cabinet-items" class="menu-item" active-class="active">计量柜物品明细</router-link>
        <router-link to="/cabinet-keys" class="menu-item" active-class="active">计量柜密钥</router-link>
        <router-link to="/personal" class="menu-item" active-class="active">个人中心</router-link>
        <router-link to="/admin" class="menu-item" active-class="active">管理员模块</router-link>
      </div>
      <div class="navbar-user">
        <span class="welcome-text">{{ username }}</span>
        <button @click="logout" class="logout-btn">退出</button>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter()
    const username = ref('欢迎使用计量管理系统')

    // 在组件挂载时，尝试获取用户信息
    onMounted(() => {
      console.log('Navbar 组件已挂载，尝试获取用户信息')
      updateUsername()
    })

    // 更新用户名的函数
    const updateUsername = () => {
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        console.log('找到用户信息:', userInfo)
        try {
          const parsedUserInfo = JSON.parse(userInfo)
          if (parsedUserInfo && parsedUserInfo.name) {
            username.value = `欢迎，${parsedUserInfo.name}（${parsedUserInfo.employeeId || ''}）`
          } else {
            username.value = '欢迎使用计量管理系统'
          }
        } catch (error) {
          console.error('解析用户信息失败:', error)
          username.value = '欢迎使用计量管理系统'
        }
      } else {
        console.log('未找到用户信息')
        username.value = '欢迎使用计量管理系统'
      }
    }

    const logout = () => {
      // 模拟退出登录
      localStorage.removeItem('userInfo')
      username.value = '欢迎使用计量管理系统'
      router.push('/login')
    }

    // 监听 localStorage 变化
    window.addEventListener('storage', (event) => {
      if (event.key === 'userInfo') {
        console.log('用户信息已更新')
        updateUsername()
      }
    })

    // 初始加载时更新一次
    updateUsername()

    return {
      username,
      logout
    }
  }
}
</script>

<style scoped>
.navbar {
  background-color: #4285f4;
  color: white;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 20px;
}

.navbar-menu {
  display: flex;
  gap: 20px;
  flex: 1;
  justify-content: center;
}

.menu-item {
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 1rem;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.menu-item.active {
  background-color: rgba(255, 255, 255, 0.3);
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 15px;
  padding-left: 20px;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.welcome-text {
  font-size: 0.9rem;
  color: #f0f0f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.logout-btn {
  background-color: #ea4335;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background-color: #d33426;
}
</style>