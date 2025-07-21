import { createStore } from 'vuex'

// 简单的加密函数
const encryptData = (data) => {
  // 实际项目中应使用更安全的加密方式
  const jsonString = JSON.stringify(data);
  // 这里只是简单的示例，实际项目中应使用专门的加密库
  return btoa(encodeURIComponent(jsonString));
};

// 简单的解密函数
const decryptData = (encryptedData) => {
  try {
    const jsonString = decodeURIComponent(atob(encryptedData));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('解密失败:', error);
    return null;
  }
};

// 检查网络状态
const isOnline = () => {
  return navigator.onLine;
};

// 持久化插件（带加密功能和离线同步）
const persistPlugin = (store) => {
  // 初始化时从本地存储加载数据
  const savedState = localStorage.getItem('measurementSystemState');
  if (savedState) {
    const decryptedState = decryptData(savedState);
    if (decryptedState) {
      store.replaceState(decryptedState);
    }
  }

  // 加载离线操作队列
  const loadOfflineActions = () => {
    const offlineActions = localStorage.getItem('offlineActions');
    if (offlineActions) {
      try {
        return JSON.parse(offlineActions);
      } catch (error) {
        console.error('解析离线操作失败:', error);
        return [];
      }
    }
    return [];
  };

  // 保存离线操作队列
  const saveOfflineActions = (actions) => {
    try {
      localStorage.setItem('offlineActions', JSON.stringify(actions));
    } catch (error) {
      console.error('保存离线操作失败:', error);
    }
  };

  // 同步离线操作到云端
  const syncOfflineActions = () => {
    if (!isOnline()) return;
  
    const offlineActions = loadOfflineActions();
    if (offlineActions.length === 0) return;
  
    console.log('开始同步离线操作到云端...');
    // 这里应该调用云端API同步数据
  
    // 模拟API调用成功
    setTimeout(() => {
      console.log(`成功同步 ${offlineActions.length} 个离线操作`);
      saveOfflineActions([]);
    }, 1000);
  };

  // 监听状态变化，保存到本地存储
  store.subscribe((mutation, state) => {
    try {
      const encryptedState = encryptData(state);
      localStorage.setItem('measurementSystemState', encryptedState);

      // 保存操作到离线队列
      if (!isOnline()) {
        const offlineActions = loadOfflineActions();
        offlineActions.push({
          mutation,
          timestamp: new Date().getTime()
        });
        saveOfflineActions(offlineActions);
      } else {
        // 在线状态下，尝试同步离线操作
        syncOfflineActions();
      }
    } catch (error) {
      console.error('保存状态失败:', error);
    }
  });

  // 监听网络状态变化
  window.addEventListener('online', syncOfflineActions);
  window.addEventListener('offline', () => {
    console.log('网络已断开，进入离线模式');
  });

  // 初始化时尝试同步
  syncOfflineActions();
};

export default createStore({
  state: {
    instruments: [
      { id: 1, name: '万用表', model: 'FLUKE-15B', status: 'IN_STOCK', cabinetId: 1, createTime: '2023-05-10' },
      { id: 2, name: '示波器', model: 'Tektronix-TBS1052B', status: 'BORROWED', cabinetId: 1, createTime: '2023-06-15' },
      { id: 3, name: '信号发生器', model: 'Agilent-33522A', status: 'IN_STOCK', cabinetId: 2, createTime: '2023-07-20' },
      { id: 4, name: '频谱分析仪', model: 'Rohde-Schwarz-FSV3', status: 'CALIBRATION', cabinetId: 2, createTime: '2023-08-25' },
      { id: 5, name: '直流电源', model: 'Keysight-E3646A', status: 'IN_STOCK', cabinetId: 3, createTime: '2023-09-30' }
    ], // 所有计量器具
    cabinets: [
      { id: 1, name: '电子测试仪器柜', location: '实验室A' },
      { id: 2, name: '通信测试仪器柜', location: '实验室B' },
      { id: 3, name: '电力测试仪器柜', location: '实验室C' }
    ], // 所有计量柜
    // 添加用户数据
    users: [
      { id: 1, name: '张三', lastLoginTime: '2023-10-10 10:30:00', permissions: {
        canAddInstrument: true,
        canDeleteInstrument: true,
        canEditInstrument: true,
        canAddCabinet: true,
        canViewReports: true,
        canEnableLogin: true
      }},
      { id: 2, name: '李四', lastLoginTime: '2023-10-11 11:15:00', permissions: {
        canAddInstrument: true,
        canDeleteInstrument: false,
        canEditInstrument: true,
        canAddCabinet: false,
        canViewReports: true,
        canEnableLogin: false
      }},
      { id: 3, name: '王五', lastLoginTime: '2023-10-09 09:45:00', permissions: {
        canAddInstrument: false,
        canDeleteInstrument: false,
        canEditInstrument: false,
        canAddCabinet: false,
        canViewReports: true,
        canEnableLogin: false
      }}
    ],
    borrowedRecords: [
      { id: 1, instrumentId: 2, employeeId: 'E1001', employeeName: '张三', borrowTime: '2023-10-10T10:30:00' },
      { id: 2, instrumentId: 4, employeeId: 'E1002', employeeName: '李四', borrowTime: '2023-10-11T11:15:00' }
    ], // 领用记录
    returnedRecords: [
      { id: 1, instrumentId: 1, employeeId: 'E1003', employeeName: '王五', returnTime: '2023-10-09T15:45:00' }
    ], // 归还记录
    keyViewRecords: [
      { id: 1, cabinetId: 1, employeeId: 'E1001', viewTime: '2023-10-08T09:20:00' },
      { id: 2, cabinetId: 1, employeeId: 'E1002', viewTime: '2023-10-08T10:10:00' },
      { id: 3, cabinetId: 2, employeeId: 'E1003', viewTime: '2023-10-09T14:30:00' },
      { id: 4, cabinetId: 3, employeeId: 'E1001', viewTime: '2023-10-10T16:25:00' },
      { id: 5, cabinetId: 2, employeeId: 'E1002', viewTime: '2023-10-11T13:10:00' }
    ], // 密钥查看记录
    keys: [
      { id: 1, name: 'KEY-001', cabinetId: 1, cabinetName: '电子测试仪器柜', content: 'SECRET-KEY-123456', status: 'ACTIVE', createTime: '2023-11-01 10:30:00' },
      { id: 2, name: 'KEY-002', cabinetId: 2, cabinetName: '通信测试仪器柜', content: 'SECRET-KEY-654321', status: 'ACTIVE', createTime: '2023-11-02 11:15:00' },
      { id: 3, name: 'KEY-003', cabinetId: 3, cabinetName: '电力测试仪器柜', content: 'SECRET-KEY-987654', status: 'ACTIVE', createTime: '2023-11-03 09:45:00' }
    ] // 密钥数据
  },
  mutations: {
    // 更新计量器具数据
    updateInstruments(state, instruments) {
      state.instruments = instruments
    },
    // 更新计量柜数据
    updateCabinets(state, cabinets) {
      state.cabinets = cabinets
    },
    // 添加领用记录
    addBorrowedRecord(state, record) {
      state.borrowedRecords.push(record)
    },
    // 添加归还记录
    addReturnedRecord(state, record) {
      state.returnedRecords.push(record)
    },
    // 添加密钥查看记录
    addKeyViewRecord(state, record) {
      state.keyViewRecords.push(record)
    },
    // 更新密钥数据
    updateKey(state, key) {
      const index = state.keys.findIndex(k => k.id === key.id)
      if (index !== -1) {
        state.keys[index] = { ...state.keys[index], ...key }
      }
    },
    // 添加新密钥
    addKey(state, key) {
      state.keys.push(key)
    },
    
    // 更新密钥所属计量柜名称
    updateKeyCabinetName(state, { cabinetId, cabinetName }) {
      state.keys.forEach(key => {
        if (key.cabinetId === cabinetId) {
          key.cabinetName = cabinetName;
        }
      });
    },
    
    // 更新密钥状态
    updateKeyStatus(state, { cabinetId, status }) {
      state.keys.forEach(key => {
        if (key.cabinetId === cabinetId) {
          key.status = status;
        }
      });
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    // 更新用户权限
    updateUserPermission(state, { userId, permissionName, value }) {
      const user = state.users.find(u => u.id === userId)
      if (user && user.permissions.hasOwnProperty(permissionName)) {
        user.permissions[permissionName] = value
      }
    },
  },
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
            resolve()
          } else {
            reject('用户名和密码不能为空')
          }
        }, 500)
      })
    }
  },
  getters: {
    // 总计量器具数
    totalInstruments: state => state.instruments.length,
    // 计量柜数量
    cabinetCount: state => state.cabinets.length,
    // 添加获取所有计量柜的getter
    allCabinets: state => state.cabinets,
    // 获取所有密钥
    allKeys: state => state.keys,
    // 获取所有用户
    allUsers: state => state.users,
    // 本周领用数量
    weeklyBorrowedCount: state => {
      // 筛选出本周的领用记录
      const now = new Date()
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
      startOfWeek.setHours(0, 0, 0, 0)
      
      return state.borrowedRecords.filter(record => {
        const recordDate = new Date(record.borrowTime)
        return recordDate >= startOfWeek
      }).length
    },
    // 本周归还数量
    weeklyReturnedCount: state => {
      // 筛选出本周的归还记录
      const now = new Date()
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
      startOfWeek.setHours(0, 0, 0, 0)
      
      return state.returnedRecords.filter(record => {
        const recordDate = new Date(record.returnTime)
        return recordDate >= startOfWeek
      }).length
    },
    // 计量器具状态分布
    instrumentStatusDistribution: state => {
      const distribution = {
        'IN_STOCK': 0,
        'BORROWED': 0,
        'CALIBRATION': 0
      }
      
      state.instruments.forEach(instrument => {
        if (distribution.hasOwnProperty(instrument.status)) {
          distribution[instrument.status]++
        }
      })
      
      return [
        { name: '在库', value: distribution['IN_STOCK'] },
        { name: '已领用', value: distribution['BORROWED'] },
        { name: '已送检', value: distribution['CALIBRATION'] }
      ]
    },
    // 近7天密钥查看次数
    weeklyKeyViewCount: state => {
      // 筛选出近7天的密钥查看记录
      const now = new Date()
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7))
      sevenDaysAgo.setHours(0, 0, 0, 0)
      
      return state.keyViewRecords.filter(record => {
        const recordDate = new Date(record.viewTime)
        return recordDate >= sevenDaysAgo
      }).length
    },
    // 按计量柜分组的密钥查看次数
    keyViewCountByCabinet: state => {
      const counts = {}
      
      state.keyViewRecords.forEach(record => {
        if (!counts[record.cabinetId]) {
          counts[record.cabinetId] = 0
        }
        counts[record.cabinetId]++
      })
      
      return Object.entries(counts).map(([cabinetId, count]) => {
        // 确保我们使用数字类型的 cabinetId 来查找
        const cabinet = state.cabinets.find(c => c.id === parseInt(cabinetId))
        return {
          cabinetId: parseInt(cabinetId),
          cabinetName: cabinet ? cabinet.name : `未知柜子${cabinetId}`,
          count
        }
      })
    },
    // 近半年每月计量器具结余
    monthlyInstrumentBalance: state => {
      const now = new Date()
      const balances = []
      
      // 计算近6个月
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
        
        // 计算当月增加的计量器具
        const addedInMonth = state.instruments.filter(instrument => {
          const createDate = new Date(instrument.createTime)
          return createDate >= monthDate && createDate < nextMonthDate
        }).length
        
        // 计算当月减少的计量器具
        const removedInMonth = state.borrowedRecords.filter(record => {
          const borrowDate = new Date(record.borrowTime)
          return borrowDate >= monthDate && borrowDate < nextMonthDate
        }).length
        
        // 计算结余
        const balance = addedInMonth - removedInMonth
        
        balances.push({
          month: `${monthDate.getFullYear()}-${monthDate.getMonth() + 1}`,
          balance
        })
      }
      
      return balances
    },
    // 本周归还数量
    weeklyReturnedCount: state => {
      // 筛选出本周的归还记录
      const now = new Date()
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
      startOfWeek.setHours(0, 0, 0, 0)
      
      return state.returnedRecords.filter(record => {
        const recordDate = new Date(record.returnTime)
        return recordDate >= startOfWeek
      }).length
    },
    // 计量器具状态分布
    instrumentStatusDistribution: state => {
      const distribution = {
        'IN_STOCK': 0,
        'BORROWED': 0,
        'CALIBRATION': 0
      }
      
      state.instruments.forEach(instrument => {
        if (distribution.hasOwnProperty(instrument.status)) {
          distribution[instrument.status]++
        }
      })
      
      return [
        { name: '在库', value: distribution['IN_STOCK'] },
        { name: '已领用', value: distribution['BORROWED'] },
        { name: '已送检', value: distribution['CALIBRATION'] }
      ]
    },
    // 近7天密钥查看次数
    weeklyKeyViewCount: state => {
      // 筛选出近7天的密钥查看记录
      const now = new Date()
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7))
      sevenDaysAgo.setHours(0, 0, 0, 0)
      
      return state.keyViewRecords.filter(record => {
        const recordDate = new Date(record.viewTime)
        return recordDate >= sevenDaysAgo
      }).length
    },
    // 按计量柜分组的密钥查看次数
    keyViewCountByCabinet: state => {
      const counts = {}
      
      state.keyViewRecords.forEach(record => {
        if (!counts[record.cabinetId]) {
          counts[record.cabinetId] = 0
        }
        counts[record.cabinetId]++
      })
      
      return Object.entries(counts).map(([cabinetId, count]) => {
        // 确保我们使用数字类型的 cabinetId 来查找
        const cabinet = state.cabinets.find(c => c.id === parseInt(cabinetId))
        return {
          cabinetId: parseInt(cabinetId),
          cabinetName: cabinet ? cabinet.name : `未知柜子${cabinetId}`,
          count
        }
      })
    },
    // 近半年每月计量器具结余
    monthlyInstrumentBalance: state => {
      const now = new Date()
      const balances = []
      
      // 计算近6个月
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
        
        // 计算当月增加的计量器具
        const addedInMonth = state.instruments.filter(instrument => {
          const createDate = new Date(instrument.createTime)
          return createDate >= monthDate && createDate < nextMonthDate
        }).length
        
        // 计算当月减少的计量器具
        const removedInMonth = state.borrowedRecords.filter(record => {
          const borrowDate = new Date(record.borrowTime)
          return borrowDate >= monthDate && borrowDate < nextMonthDate
        }).length
        
        // 计算结余
        const balance = addedInMonth - removedInMonth
        
        balances.push({
          month: `${monthDate.getFullYear()}-${monthDate.getMonth() + 1}`,
          balance
        })
      }
      
      return balances
    },
    // 获取所有领用归还记录
    allRecords: state => {
      // 合并领用记录和归还记录
      const borrowed = state.borrowedRecords.map(record => {
        // 查找对应的计量器具
        const instrument = state.instruments.find(instr => instr.id === record.instrumentId);
        return {
          ...record,
          type: 'borrow',
          status: '已领用',
          instrumentName: instrument ? instrument.name : `未知器具(${record.instrumentId})`,
          borrowTime: record.borrowTime,
          returnTime: null
        };
      });
      
      const returned = state.returnedRecords.map(record => {
        // 查找对应的计量器具
        const instrument = state.instruments.find(instr => instr.id === record.instrumentId);
        return {
          ...record,
          type: 'return',
          status: '已归还',
          instrumentName: instrument ? instrument.name : `未知器具(${record.instrumentId})`,
          borrowTime: null,
          returnTime: record.returnTime
        };
      });
      
      // 合并并按时间排序
      return [...borrowed, ...returned].sort((a, b) => {
        const dateA = new Date(a.borrowTime || a.returnTime);
        const dateB = new Date(b.borrowTime || b.returnTime);
        return dateB - dateA; // 降序排列
      });
    },
    // 获取所有用户
    allUsers: state => state.users,
  },
  plugins: [persistPlugin]
})