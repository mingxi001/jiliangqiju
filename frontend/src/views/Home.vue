<template>
  <div class="home-container">
    <div class="stats-and-balance-section">
      <el-row :gutter="20">
        <!-- 计量器具统计 -->
        <el-col :span="12">
          <div class="stats-section">
            <h2>计量器具统计</h2>
            <el-card class="stat-card">
              <div class="card-header">
                <h3>本周领用/归还</h3>
              </div>
              <div class="chart-container">
                <div ref="borrowReturnChart" class="chart"></div>
              </div>
              <div class="stat-value">领用: {{ weeklyBorrowedCount }} / 归还: {{ weeklyReturnedCount }}</div>
            </el-card>
          </div>
        </el-col>

        <!-- 计量器具结余 -->
        <el-col :span="12">
          <div class="status-section">
            <h2>计量器具结余</h2>
            <el-card class="stat-card">
              <div class="card-header">
                <h3>每月结余</h3>
              </div>
              <div class="chart-container">
                <div ref="monthlyBalanceChart" class="chart"></div>
              </div>
              <div class="stat-value">总计量器具数: {{ totalInstruments }}</div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 密钥查看次数 -->
    <div class="status-section">
      <h2>密钥查看次数</h2>
      <div class="chart-container">
        <div ref="keyViewByCabinetChart" class="chart"></div>
      </div>
    </div>

    <!-- 计量柜快速操作 -->
    <div class="operations-section">
      <h2>计量柜快速操作</h2>
      <div class="operation-buttons">
        <el-button v-for="cabinet in cabinets" :key="cabinet.id" type="primary" size="large" @click="handleCabinetAction(cabinet.id)">
          {{ cabinet.name }} - {{ getCabinetItemCount(cabinet.id) }}件
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const store = useStore()
    // 图表引用
    const borrowReturnChart = ref(null)
    const monthlyBalanceChart = ref(null)
    const keyViewByCabinetChart = ref(null)
    const chartInstances = ref({})

    // 从Vuex store获取数据
    const totalInstruments = computed(() => store.getters.totalInstruments)
    const weeklyBorrowedCount = computed(() => store.getters.weeklyBorrowedCount)
    const weeklyReturnedCount = computed(() => store.getters.weeklyReturnedCount)
    const monthlyInstrumentBalance = computed(() => store.getters.monthlyInstrumentBalance)
    const keyViewCountByCabinet = computed(() => store.getters.keyViewCountByCabinet)
    // 使用getter而不是直接引用state
    const cabinets = computed(() => store.getters.allCabinets)
    const instruments = computed(() => store.state.instruments)

    // 获取指定计量柜的物品数量
    const getCabinetItemCount = (cabinetId) => {
      return instruments.value.filter(item => item.cabinetId === cabinetId).length
    }

    // 初始化图表
    const initCharts = () => {
      // 领用归还图表
      chartInstances.value.brChart = echarts.init(borrowReturnChart.value)
      // 每月结余图表
      chartInstances.value.balanceChart = echarts.init(monthlyBalanceChart.value)
      // 按计量柜分组的密钥查看次数图表
      chartInstances.value.keyViewByCabinetChart = echarts.init(keyViewByCabinetChart.value)

      updateCharts()
    }

    // 更新图表数据
    const updateCharts = () => {
      // 更新领用归还图表
      chartInstances.value.brChart.setOption({
        tooltip: {
          trigger: 'axis',
          triggerOn: 'mousemove|click',
          showContent: true,
          alwaysShowContent: false,
          hideDelay: 100,
          formatter: function(params) {
            return `${params[0].name}<br/>${params[0].seriesName}: ${params[0].value}<br/>${params[1].seriesName}: ${params[1].value}`;
          }
        },
        legend: { data: ['领用', '归还'] },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          splitLine: { show: false }
        },
        yAxis: {
          type: 'value',
          splitLine: { show: false }
        },
        series: [
          { data: getWeeklyTrend('borrow'), type: 'line', name: '领用', smooth: true },
          { data: getWeeklyTrend('return'), type: 'line', name: '归还', smooth: true }
        ]
      })

      // 更新每月结余图表
      const balanceData = monthlyInstrumentBalance.value.length > 0 ? 
        monthlyInstrumentBalance.value : 
        [{ month: '暂无数据', balance: 0 }];

      chartInstances.value.balanceChart.setOption({
        tooltip: {
          trigger: 'axis',
          triggerOn: 'mousemove|click',
          showContent: true,
          alwaysShowContent: false,
          hideDelay: 100,
          formatter: function(params) {
            return `${params[0].name}<br/>${params[0].seriesName}: ${params[0].value}`;
          }
        },
        legend: { data: ['结余'] },
        xAxis: {
          type: 'category',
          data: balanceData.map(item => item.month),
          splitLine: { show: false }
        },
        yAxis: {
          type: 'value',
          splitLine: { show: false },
          min: 0
        },
        series: [{
          data: balanceData.map(item => item.balance),
          type: 'bar',
          name: '结余',
          barMinHeight: 10
        }]
      })

      // 更新密钥查看次数图表
      chartInstances.value.keyViewByCabinetChart.setOption({
        tooltip: {
          trigger: 'axis',
          triggerOn: 'mousemove|click',
          showContent: true,
          alwaysShowContent: false,
          hideDelay: 100,
          formatter: function(params) {
            return `${params[0].name}<br/>${params[0].seriesName}: ${params[0].value}`;
          }
        },
        legend: { data: ['查看次数'] },
        xAxis: {
          type: 'category',
          data: keyViewCountByCabinet.value.map(item => item.cabinetName),
          splitLine: { show: false }
        },
        yAxis: {
          type: 'value',
          splitLine: { show: false }
        },
        series: [{
          data: keyViewCountByCabinet.value.map(item => item.count),
          type: 'bar',
          name: '查看次数'
        }]
      })
    }

    // 获取本周趋势数据
    const getWeeklyTrend = (type) => {
      // 实际应用中应从store获取每日数据
      const base = type === 'borrow' ? weeklyBorrowedCount.value : weeklyReturnedCount.value
      return [base*0.6, base*0.7, base*0.5, base*0.8, base*0.9, base, base]
    }

    // 处理计量柜操作
    const handleCabinetAction = (cabinetId) => {
      router.push({ path: '/cabinet-items', query: { cabinetId } })
      const cabinet = cabinets.value.find(c => c.id === cabinetId)
      if (cabinet) {
        ElMessage({ message: `正在打开${cabinet.name}`, type: 'success' })
      } else {
        ElMessage({ message: '找不到指定的计量柜', type: 'error' })
      }
    }

    // 监听数据变化并更新图表
    watch([weeklyBorrowedCount, weeklyReturnedCount, monthlyInstrumentBalance, keyViewCountByCabinet, cabinets], () => {
      if (Object.keys(chartInstances.value).length > 0) {
        updateCharts()
      }
    })

    onMounted(() => {
      // 初始化图表
      initCharts()
      // 响应窗口大小变化
      window.addEventListener('resize', () => {
        Object.values(chartInstances.value).forEach(chart => chart.resize())
      })
    })

    return {
      totalInstruments,
      weeklyBorrowedCount,
      weeklyReturnedCount,
      monthlyInstrumentBalance,
      keyViewCountByCabinet,
      cabinets,
      borrowReturnChart,
      monthlyBalanceChart,
      keyViewByCabinetChart,
      getCabinetItemCount,
      handleCabinetAction
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.stats-and-balance-section {
  margin-bottom: 30px;
}

.stats-section, .status-section, .operations-section {
  margin-bottom: 30px;
}

.stat-card {
  height: 100%;
}

.card-header {
  margin-bottom: 15px;
}

.chart-container {
  height: 300px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 移除 large-chart 类的特殊高度设置 */
.large-chart {
  height: 300px; /* 与其他图表保持一致 */
}

.chart {
  width: 100%;
  height: 100%;
}

.stat-value {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.operation-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.operation-buttons .el-button {
  min-width: 180px;
}
</style>