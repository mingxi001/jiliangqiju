import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import CabinetItems from '../views/CabinetItems.vue'
import Admin from '../views/Admin.vue'
import CabinetKeys from '../views/CabinetKeys.vue'
import Personal from '../views/Personal.vue'
// 导入新页面组件
import About from '../views/About.vue'
import Help from '../views/Help.vue'
import Contact from '../views/Contact.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/cabinet-items', name: 'CabinetItems', component: CabinetItems },
  { path: '/cabinet-keys', name: 'CabinetKeys', component: CabinetKeys },
  { path: '/personal', name: 'Personal', component: Personal },
  { path: '/admin', name: 'Admin', component: Admin },
  // 添加新路由
  { path: '/about', name: 'About', component: About },
  { path: '/help', name: 'Help', component: Help },
  { path: '/contact', name: 'Contact', component: Contact }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  // 检查用户是否已登录
  const userInfo = localStorage.getItem('userInfo')
  const isLoggedIn = !!userInfo

  // 定义不需要登录的页面
  const publicPages = ['/login', '/about', '/help', '/contact']
  const isPublicPage = publicPages.includes(to.path)

  // 如果是公开页面，直接放行
  if (isPublicPage) {
    next()
    return
  }

  // 如果不是公开页面且未登录，重定向到登录页
  if (!isLoggedIn) {
    next('/login')
    return
  }

  // 已登录且是受保护页面，放行
  next()
})

export default router