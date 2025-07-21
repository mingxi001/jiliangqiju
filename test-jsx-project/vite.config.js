import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx()
  ],
  esbuild: {
    loader: 'jsx',
    include: /\.(jsx|vue|js)$/,
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  server: {
    port: 3000,
    open: true // 自动打开浏览器
  }
})