import { onMounted } from 'vue';
import { useStore } from 'vuex';
import CloudStorageService from './services/cloudStorage';

export default {
  setup() {
    const store = useStore();

    onMounted(async () => {
      // 尝试从云端加载数据
      const cloudData = await CloudStorageService.loadData();
      if (cloudData) {
        // 如果有云端数据，替换本地状态
        store.replaceState(cloudData);
        console.log('已从云端恢复数据');
      } else {
        // 否则，将本地数据同步到云端
        await CloudStorageService.saveData(store.state);
      }

      // 定期同步数据到云端（每5分钟）
      setInterval(async () => {
        await CloudStorageService.saveData(store.state);
      }, 5 * 60 * 1000);
    });

    return {};
  }
};

<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <Navbar />

    <!-- 主内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  setup() {
    // 可以在这里添加全局逻辑
    return {}
  }
})
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
  color: #303133;
  line-height: 1.6;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
}
</style>