<template>
  <div class="contact-container">
    <h1>联系我们</h1>
    <div class="contact-content">
      <div class="contact-info-card">
        <div class="contact-info">
          <div class="info-icon"><i class="el-icon-user"></i></div>
          <h2>系统管理员</h2>
          <p>姓名：韦华代</p>
          <p>电话：18587917804</p>
          <p>邮箱：1125816488@qq.com</p>
        </div>
      </div>
      
      <div class="contact-info-card">
        <div class="contact-info">
          <div class="info-icon"><i class="el-icon-headset"></i></div>
          <h2>技术支持</h2>
          <p>姓名：韦华代</p>
          <p>电话：18587917804</p>
          <p>邮箱：1125816488@qq.com</p>
        </div>
      </div>
      
      <div class="contact-form-card">
        <h2>反馈问题</h2>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="问题描述" prop="description">
            <el-input v-model="form.description" type="textarea"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  
    <div class="map-container">
      <h2>我们的位置</h2>
      <div class="map-placeholder">
        <p>地图加载中...</p>
        <p>地址：北京市海淀区科技路100号</p>
      </div>
    </div>
  
    <div class="back-to-top" @click="scrollToTop" v-if="showBackToTop">
      <i class="el-icon-arrow-up"></i>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'Contact',
  setup() {
    const form = ref({
      name: '',
      email: '',
      description: ''
    })
    
    const rules = ref({
      name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      description: [
        { required: true, message: '请输入问题描述', trigger: 'blur' },
        { min: 5, message: '问题描述至少5个字符', trigger: 'blur' }
      ]
    })
    
    const showBackToTop = ref(false)
    
    const submitForm = () => {
      // 表单验证
      if (!form.value.name) {
        ElMessage({ message: '请输入姓名', type: 'warning' })
        return
      }
      
      if (!form.value.email) {
        ElMessage({ message: '请输入邮箱', type: 'warning' })
        return
      }
      
      // 简单的邮箱格式验证
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(form.value.email)) {
        ElMessage({ message: '请输入正确的邮箱格式', type: 'warning' })
        return
      }
      
      if (!form.value.description) {
        ElMessage({ message: '请输入问题描述', type: 'warning' })
        return
      }
      
      if (form.value.description.length < 5) {
        ElMessage({ message: '问题描述至少5个字符', type: 'warning' })
        return
      }
      
      // 提交表单
      ElMessage({
        message: '反馈已提交，我们会尽快处理！',
        type: 'success'
      })
      
      // 重置表单
      form.value = {
        name: '',
        email: '',
        description: ''
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
    }
    
    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })
    
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })
    
    return {
      form,
      rules,
      submitForm,
      showBackToTop,
      scrollToTop
    }
  }
})
</script>

<style scoped>
.contact-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-content {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.contact-info-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;
}

.contact-info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}

.contact-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.info-icon {
  width: 60px;
  height: 60px;
  background-color: #e6f7ff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  color: #409EFF;
  font-size: 24px;
}

.contact-form-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;
  grid-column: 1 / -1;
}

.contact-form-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}

.map-container {
  margin-top: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.map-placeholder {
  height: 300px;
  background-color: #f5f7fa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}

h1 {
  color: #409EFF;
  text-align: center;
}

h2 {
  color: #303133;
  margin-top: 0;
  text-align: center;
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
  .contact-content {
    grid-template-columns: 1fr;
  }
}
</style>