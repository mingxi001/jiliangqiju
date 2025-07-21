<template>
  <div class="help-container">
    <h1>帮助中心</h1>
    
    <div class="search-container">
      <el-input
        v-model="searchQuery"
        placeholder="搜索帮助内容..."
        prefix-icon="el-icon-search"
        @input="handleSearch"
      ></el-input>
    </div>
    
    <div class="help-content">
      <div class="sidebar">
        <h2>目录</h2>
        <ul class="nav-list">
          <li :class="{ 'active': currentSection === 'borrow' }" @click="scrollToSection('borrow')">如何领用计量器具？</li>
          <li :class="{ 'active': currentSection === 'return' }" @click="scrollToSection('return')">如何归还计量器具？</li>
          <li :class="{ 'active': currentSection === 'calibration' }" @click="scrollToSection('calibration')">如何查看计量器具的校准记录？</li>
        </ul>
      </div>
      
      <div class="main-content">
        <div class="faq-item" id="borrow">
          <h2>如何领用计量器具？</h2>
          <p>1. 登录系统后，进入"计量柜物品明细"页面；</p>
          <p>2. 选择您需要领用的计量器具；</p>
          <p>3. 点击"领用"按钮；</p>
          <p>4. 填写领用信息，点击"确认"即可。</p>
        </div>
        
        <div class="faq-item" id="return">
          <h2>如何归还计量器具？</h2>
          <p>1. 登录系统后，进入"个人中心"页面；</p>
          <p>2. 找到您已领用的计量器具；</p>
          <p>3. 点击"归还"按钮；</p>
          <p>4. 填写归还信息，点击"确认"即可。</p>
        </div>
        
        <div class="faq-item" id="calibration">
          <h2>如何查看计量器具的校准记录？</h2>
          <p>1. 登录系统后，进入"计量柜物品明细"页面；</p>
          <p>2. 选择您想查看的计量器具；</p>
          <p>3. 点击"查看详情"按钮；</p>
          <p>4. 在详情页面中，点击"校准记录"标签即可查看。</p>
        </div>
      </div>
    </div>
  
    <div class="back-to-top" @click="scrollToTop" v-if="showBackToTop">
      <i class="el-icon-arrow-up"></i>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue'

export default defineComponent({
  name: 'Help',
  setup() {
    const searchQuery = ref('')
    const showBackToTop = ref(false)
    const currentSection = ref('')
    const faqItems = ref([])
    
    // 处理搜索
    const handleSearch = () => {
      // 这里可以添加搜索逻辑
      console.log('搜索内容:', searchQuery.value)
    }
    
    // 滚动到指定部分
    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        })
        currentSection.value = sectionId
      }
    }
    
    // 回到顶部
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
    
    // 处理滚动事件
    const handleScroll = () => {
      showBackToTop.value = window.scrollY > 300
      
      // 更新当前激活的部分
      const sections = ['borrow', 'return', 'calibration']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection.value = section
            break
          }
        }
      }
    }
    
    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })
    
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })
    
    return {
      searchQuery,
      showBackToTop,
      currentSection,
      handleSearch,
      scrollToSection,
      scrollToTop
    }
  }
})
</script>

<style scoped>
.help-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-container {
  margin-top: 20px;
  margin-bottom: 30px;
}

.help-content {
  display: flex;
  gap: 30px;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
  position: sticky;
  top: 20px;
  align-self: flex-start;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.main-content {
  flex: 1;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  margin-bottom: 5px;
}

.nav-list li:hover {
  background-color: #f5f7fa;
  color: #409EFF;
}

.nav-list li.active {
  background-color: #e6f7ff;
  color: #409EFF;
  font-weight: bold;
}

.faq-item {
  margin-top: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.faq-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}

h1 {
  color: #409EFF;
  text-align: center;
}

h2 {
  color: #303133;
  margin-top: 0;
}

p {
  margin-top: 10px;
  line-height: 1.6;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .help-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    position: relative;
    top: 0;
  }
}
</style>