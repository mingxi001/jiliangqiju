// 修复 test-jsx-project 中的 main.js
import { createApp } from 'vue'
import TestJSX from './test-jsx.jsx'

createApp(TestJSX).mount('#app')