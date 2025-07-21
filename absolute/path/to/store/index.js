// ... existing code ...
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
  
  // 确保至少有一个月的数据
  if (balances.length === 0) {
    const currentMonth = new Date()
    balances.push({
      month: `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`,
      balance: state.instruments.length
    })
  }
  
  return balances
}
// ... existing code ...