import { createStore } from 'vuex'

// 创建并导出store
export default createStore({
  // 状态
  state: {
    // 这里可以定义你的应用状态
    user: null
  },
  //  mutations
  mutations: {
    // 可以在这里定义修改状态的方法
    setUser(state, user) {
      state.user = user
    }
  },
  //  actions
  actions: {
    // 登录操作
    login({ commit }, userInfo) {
      // 这里是登录逻辑，实际项目中应该调用 API 进行身份验证
      // 为了演示，我们简单地模拟登录成功
      return new Promise((resolve, reject) => {
        // 模拟 API 调用延迟
        setTimeout(() => {
          // 简单的模拟验证，实际项目中应该更安全
          if (userInfo.username && userInfo.password) {
            // 保存用户信息到本地存储
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            // 提交mutation更新状态
            commit('setUser', userInfo)
            resolve()
          } else {
            reject('用户名和密码不能为空')
          }
        }, 500)
      })
    }
  },
  //  getters
  getters: {
    // 可以在这里定义获取状态的方法
    isLoggedIn: state => !!state.user
  }
})