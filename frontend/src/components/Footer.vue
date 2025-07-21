<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-links">
        <span class="footer-link" @click="navigateToAbout">关于系统</span>
        <span class="footer-link" @click="navigateToHelp">帮助中心</span>
        <span class="footer-link" @click="navigateToContact">联系我们</span>
      </div>
      <div class="copyright">
        © {{ new Date().getFullYear() }} 计量管理系统 - 版权所有
      </div>
      <div class="version-info">
        版本 v1.0.0
      </div>
    </div>
  </footer>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Footer',
  setup() {
    const router = useRouter()

    const navigateToAbout = () => {
      router.push({ path: '/about' })
    }

    const navigateToHelp = () => {
      router.push({ path: '/help' })
    }

    const navigateToContact = () => {
      router.push({ path: '/contact' })
    }

    return {
      navigateToAbout,
      navigateToHelp,
      navigateToContact
    }
  }
})
</script>

<style scoped>
.app-footer {
  background-color: #f5f5f5;
  padding: 20px 0;
  border-top: 1px solid #e0e0e0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.footer-link {
  color: #409EFF;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.footer-link:hover {
  color: #6AA1F7;
  filter: blur(0.5px);
  transform: scale(1.05);
}

.footer-link:active {
  filter: blur(1px);
  transform: scale(0.95);
}

.copyright {
  margin-top: 10px;
  color: #909399;
  font-size: 14px;
}

.version-info {
  margin-top: 5px;
  color: #909399;
  font-size: 12px;
}
</style>