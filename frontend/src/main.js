import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus, {
  size: 'default',
  zIndex: 3000
})
app.mount('#app')
// 导入 ECharts
import * as echarts from 'echarts'

// 全局注册 ECharts
app.config.globalProperties.$echarts = echarts