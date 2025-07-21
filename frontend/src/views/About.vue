<template>
  <div class="about-container">
    <div class="about-header">
      <h1>关于计量管理系统</h1>
      <div class="version-badge">v1.0.0</div>
    </div>
    
    <div class="about-content">
      <div class="card">
        <h2>系统简介</h2>
        <p>计量管理系统是一款专为企业和机构设计的计量器具管理软件，旨在提高计量器具的管理效率，确保计量器具的准确性和合规性。</p>
      </div>
      
      <div class="card">
        <h2>系统特点</h2>
        <ul>
          <li>计量器具全生命周期管理</li>
          <li>实时监控计量器具状态</li>
          <li>自动化的校准提醒</li>
          <li>完善的领用归还流程</li>
          <li>详细的报表统计功能</li>
        </ul>
      </div>
      
      <div class="card">
        <h2>系统架构</h2>
        <p>本系统采用前后端分离架构，前端基于Vue.js开发，后端采用Node.js构建，数据库使用MongoDB。</p>
      </div>
      
      <div class="card">
        <h2>更新日志</h2>
        <div class="changelog-item">
          <div class="changelog-date">2023-11-01</div>
          <div class="changelog-content">
            <p>• 发布系统正式版v1.0.0</p>
            <p>• 完善计量器具管理功能</p>
            <p>• 优化报表统计功能</p>
          </div>
        </div>
      </div>
    </div>
  
    <div class="back-to-top" @click="scrollToTop" v-if="showBackToTop">
      <i class="el-icon-arrow-up"></i>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'About',
  setup() {
    const showBackToTop = ref(false)
    
    const handleScroll = () => {
      showBackToTop.value = window.scrollY > 300
    }
    
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
    
    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })
    
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })
    
    return {
      showBackToTop,
      scrollToTop
    }
  }
})
</script>

<style scoped>
.about-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.about-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.version-badge {
  background-color: #409EFF;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
}

.about-content {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.card {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}

h1 {
  color: #409EFF;
  text-align: center;
  flex: 1;
}

h2 {
  color: #303133;
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

p {
  margin-top: 10px;
  line-height: 1.6;
}

ul {
  margin-top: 10px;
  padding-left: 20px;
}

li {
  margin-top: 5px;
  line-height: 1.6;
}

.changelog-item {
  margin-top: 10px;
}

.changelog-date {
  font-weight: bold;
  color: #409EFF;
}

.changelog-content {
  margin-top: 5px;
  padding-left: 10px;
}

.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 40px;
  height: 40px;
  background-color: #409EFF;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.back-to-top:hover {
  background-color: #3a8ee6;
  transform: translateY(-3px);
}
</style>