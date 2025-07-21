<template>
  <div class="cabinet-items-container">
    <el-card>
      <div slot="header" class="card-header">
        <span>计量柜物品明细</span>
      </div>

      <!-- 统计信息卡片 -->
      <el-card class="stats-card" style="margin-bottom: 20px;">
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-label">总数量</div>
            <div class="stat-value">{{ instrumentCounts.total }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">在库</div>
            <div class="stat-value">{{ instrumentCounts.inStock }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">已领用</div>
            <div class="stat-value">{{ instrumentCounts.borrowed }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">已送检</div>
            <div class="stat-value">{{ instrumentCounts.calibration }}</div>
          </div>
        </div>
      </el-card>

      <!-- 新增图表区域 -->
      <el-card style="margin-bottom: 20px;">
        <div slot="header" class="card-header">
          <span>计量器具状态统计</span>
        </div>
        <div style="display: flex; justify-content: center; padding: 20px;">
          <div style="width: 100px; height: 100px; border-radius: 50%; background: #f0f2f5; display: flex; align-items: center; justify-content: center; position: relative;">
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold;">{{ instrumentCounts.total }}</div>
              <div style="font-size: 14px; color: #606266;">总数</div>
            </div>
          </div>
          <div style="margin-left: 30px; display: flex; flex-direction: column; justify-content: center;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="width: 16px; height: 16px; background: #4096ff; margin-right: 10px;"></div>
              <div>在库: {{ instrumentCounts.inStock }}</div>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="width: 16px; height: 16px; background: #67c23a; margin-right: 10px;"></div>
              <div>已领用: {{ instrumentCounts.borrowed }}</div>
            </div>
            <div style="display: flex; align-items: center;">
              <div style="width: 16px; height: 16px; background: #e6a23c; margin-right: 10px;"></div>
              <div>已送检: {{ instrumentCounts.calibration }}</div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 工具栏 -->
      <div class="toolbar">
        <el-button v-if="isAdmin" type="primary" @click="addCabinet">新增计量柜</el-button>
        <el-button type="primary" @click="openBorrowReturnDialog('borrow')">领用</el-button>
        <el-button type="success" @click="openBorrowReturnDialog('return')">归还</el-button>
      </div>

      <!-- 计量柜标签页 -->
      <el-tabs v-model="activeCabinetId" type="border-card" :loading="isLoading">
        <el-tab-pane
          v-for="cabinet in cabinets"
          :key="cabinet.id"
          :label="cabinet.name"
          :name="cabinet.id.toString()"
        >
          <!-- 物品操作栏 -->
          <div class="items-toolbar">
            <el-input v-model="searchText" placeholder="搜索物品..."></el-input>
            <div class="right-buttons">
              <el-button v-if="isAdmin" type="primary" @click="addInstrument">新增物品</el-button>
              <el-button v-if="selectedInstrument" @click="verifyAdminPassword(() => editInstrument(selectedInstrument))">编辑</el-button>
              <el-button v-if="selectedInstrument" type="danger" @click="verifyAdminPassword(() => deleteInstrument(selectedInstrument))">删除</el-button>
            </div>
          </div>

          <!-- 物品列表 -->
          <el-table :data="filteredInstruments" style="width: 100%" @row-click="handleRowClick" :highlight-current-row="true">
            <el-table-column prop="name" label="名称" width="180"></el-table-column>
            <el-table-column prop="model" label="型号" width="180"></el-table-column>
            <el-table-column prop="specification" label="规格" width="180"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="statusTypeMap[scope.row.status]">{{ statusTextMap[scope.row.status] }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="scope">
                <el-button v-if="scope.row.status === 'IN_STOCK'" @click="borrowInstrument(scope.row)">领用</el-button>
                <el-button v-else-if="scope.row.status === 'BORROWED'" @click="returnInstrument(scope.row)">归还</el-button>
                <el-button v-else-if="scope.row.status === 'CALIBRATION'" @click="verifyAdminPassword(() => returnFromCalibration(scope.row))">完成校准</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 新增物品对话框 -->
          <el-dialog
            v-model="showAddInstrumentDialog"
            title="新增计量器具"
            width="500px"
          >
            <el-form ref="addInstrumentFormRef" :model="addInstrumentForm" :rules="addInstrumentRules">
              <el-form-item label="名称" prop="name">
                <el-input v-model="addInstrumentForm.name" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item label="型号" prop="model">
                <el-input v-model="addInstrumentForm.model" placeholder="请输入型号"></el-input>
              </el-form-item>
              <el-form-item label="规格" prop="specification">
                <el-input v-model="addInstrumentForm.specification" placeholder="请输入规格"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="showAddInstrumentDialog = false">取消</el-button>
              <el-button type="primary" @click="handleAddInstrument">确认</el-button>
            </template>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>

      <!-- 编辑物品对话框 -->
      <el-dialog
        v-model="showEditInstrumentDialog"
        title="编辑计量器具"
        width="500px"
      >
        <el-form ref="editInstrumentFormRef" :model="editInstrumentForm" :rules="editInstrumentRules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="editInstrumentForm.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="型号" prop="model">
            <el-input v-model="editInstrumentForm.model" placeholder="请输入型号"></el-input>
          </el-form-item>
          <el-form-item label="规格" prop="specification">
            <el-input v-model="editInstrumentForm.specification" placeholder="请输入规格"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showEditInstrumentDialog = false">取消</el-button>
          <el-button type="primary" @click="handleEditInstrument">确认</el-button>
        </template>
      </el-dialog>

    </el-card>

    <!-- 领用归还对话框 -->
    <el-dialog
      v-model="showBorrowReturnDialog"
      :title="borrowReturnDialogType === 'borrow' ? '领用计量器具' : '归还计量器具'"
      width="500px"
    >
      <el-form ref="borrowReturnFormRef" :model="borrowReturnForm" :rules="borrowReturnRules">
        <el-form-item label="工号" prop="employeeId">
          <el-input v-model="borrowReturnForm.employeeId" placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="borrowReturnForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item v-if="borrowReturnDialogType === 'borrow'" label="计量器具" prop="instrumentId">
          <el-select v-model="borrowReturnForm.instrumentId" placeholder="请选择计量器具" @change="handleInstrumentChange">
            <el-option
              v-for="instrument in currentCabinetInstruments"
              :key="instrument.id"
              :label="`${instrument.name} (${instrument.model})`"
              :value="instrument.id.toString()"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="borrowReturnDialogType === 'return'" label="计量器具" prop="instrumentId">
          <el-select v-model="borrowReturnForm.instrumentId" placeholder="请选择计量器具">
            <el-option
              v-for="instrument in borrowedInstruments"
              :key="instrument.id"
              :label="`${instrument.name} (${instrument.model})`"
              :value="instrument.id.toString()"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBorrowReturnDialog = false">取消</el-button>
        <el-button type="primary" @click="handleBorrowReturn">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'CabinetItems',
  setup() {
    // 添加 isSubmitting 变量的定义
    const isSubmitting = ref(false)
    const store = useStore()
    // 从 store 中获取管理员状态
    const isAdmin = computed(() => store.getters.isAdmin || false)
    const cabinets = ref([])
    const activeCabinetId = ref('1')
    const searchText = ref('')
    const showBorrowReturnDialog = ref(false)
    const borrowReturnDialogType = ref('borrow') // 'borrow' 或 'return'
    const borrowReturnForm = ref({
      employeeId: '',
      name: '',
      instrumentId: ''
    })
    // 新增 selectedInstrument 变量
    const selectedInstrument = ref(null)
    // 新增编辑相关变量
    const showEditInstrumentDialog = ref(false)
    const editInstrumentForm = ref({
      name: '',
      model: '',
      specification: ''
    })
    const editInstrumentRules = ref({
      name: [
        { required: true, message: '请输入名称', trigger: 'blur' }
      ],
      model: [
        { required: true, message: '请输入型号', trigger: 'blur' }
      ],
      specification: [
        { required: true, message: '请输入规格', trigger: 'blur' }
      ]
    })
    // 表单引用
    const editInstrumentFormRef = ref(null)
    const borrowReturnRules = ref({
      employeeId: [
        { required: true, message: '请输入工号', trigger: 'blur' }
      ],
      name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      instrumentId: [
        { required: true, message: '请选择计量器具', trigger: 'change' }
      ]
    })

    // 新增物品相关
    const showAddInstrumentDialog = ref(false)
    const addInstrumentForm = ref({
      name: '',
      model: '',
      specification: ''
    })
    const addInstrumentRules = ref({
      name: [
        { required: true, message: '请输入名称', trigger: 'blur' }
      ],
      model: [
        { required: true, message: '请输入型号', trigger: 'blur' }
      ],
      specification: [
        { required: true, message: '请输入规格', trigger: 'blur' }
      ]
    })

    // 从 store 中获取数据
    const instruments = computed(() => store.state.instruments)

    // 计算不同状态的计量器具数量
    const instrumentCounts = computed(() => {
      return {
        inStock: instruments.value.filter(instrument => instrument.status === 'IN_STOCK').length,
        borrowed: instruments.value.filter(instrument => instrument.status === 'BORROWED').length,
        calibration: instruments.value.filter(instrument => instrument.status === 'CALIBRATION').length,
        total: instruments.value.length
      }
    })

    // 状态映射
    const statusTextMap = ref({
      'IN_STOCK': '在库',
      'BORROWED': '已领用',
      'CALIBRATION': '已送检'
    })

    const statusTypeMap = ref({
      'IN_STOCK': 'success',
      'BORROWED': 'primary',
      'CALIBRATION': 'warning'
    })

    // 当前计量柜的物品
    const currentCabinetInstruments = computed(() => {
      return instruments.value.filter(instrument => {
        return instrument.cabinetId === parseInt(activeCabinetId.value)
      })
    })

    // 已领用的物品
    const borrowedInstruments = computed(() => {
      return instruments.value.filter(instrument => {
        return instrument.status === 'BORROWED'
      })
    })

    // 筛选后的物品
    const filteredInstruments = computed(() => {
      if (!searchText.value) {
        return currentCabinetInstruments.value
      }
      return currentCabinetInstruments.value.filter(instrument => {
        return (
          instrument.name.includes(searchText.value) ||
          instrument.model.includes(searchText.value) ||
          instrument.specification.includes(searchText.value)
        )
      })
    })

    // 定义isLoading变量
    const isLoading = ref(false)

    // 组件挂载时，初始化数据
    onMounted(() => {
      isLoading.value = true
      // 模拟从API获取数据
      setTimeout(() => {
        const initialCabinets = [
          { id: 1, name: '2号计量柜', description: '第一台计量柜' },
          { id: 2, name: '10号计量柜', description: '第二台计量柜' },
          { id: 3, name: '19号计量柜', description: '第三台计量柜' }
        ]

        const initialInstruments = [
          { id: 1, cabinetId: 1, name: '万用表', model: 'FLUKE 15B', specification: '数字式', status: 'IN_STOCK' },
          { id: 2, cabinetId: 1, name: '示波器', model: 'Tektronix TBS1052B', specification: '50MHz', status: 'BORROWED' },
          { id: 3, cabinetId: 1, name: '信号发生器', model: 'Agilent 33210A', specification: '10MHz', status: 'IN_STOCK' },
          { id: 4, cabinetId: 2, name: '温度计', model: 'Testo 826-T2', specification: '-40~600°C', status: 'IN_STOCK' },
          { id: 5, cabinetId: 2, name: '湿度计', model: 'Testo 608-H1', specification: '0~100%RH', status: 'CALIBRATION' },
          { id: 6, cabinetId: 3, name: '天平', model: 'Sartorius BS224S', specification: '0.1mg', status: 'IN_STOCK' },
          { id: 7, cabinetId: 3, name: '压力计', model: 'WIKA CPG1500', specification: '0~10bar', status: 'BORROWED' }
        ]

        cabinets.value = initialCabinets
        store.commit('updateCabinets', initialCabinets)
        store.commit('updateInstruments', initialInstruments)
        isLoading.value = false
      }, 300)
    })

    // 显示领用归还对话框
    const openBorrowReturnDialog = (type) => {
      borrowReturnDialogType.value = type
      showBorrowReturnDialog.value = true
      // 重置表单
      resetBorrowReturnForm()
    }

    // 关闭领用归还对话框
    const closeBorrowReturnDialog = () => {
      showBorrowReturnDialog.value = false
    }

    // 重置领用归还表单
    const resetBorrowReturnForm = () => {
      borrowReturnForm.value = {
        employeeId: '',
        name: '',
        instrumentId: ''
      }
      // 重置表单验证状态
      if (borrowReturnFormRef.value) {
        borrowReturnFormRef.value.resetFields()
      }
    }

    // 监听模态框关闭事件
    watch(showBorrowReturnDialog, (newValue) => {
      if (!newValue) {
        // 模态框关闭时重置数据
        resetBorrowReturnForm()
      }
    })

    // 处理计量器具选择变化
    const handleInstrumentChange = (value) => {
      // 确保选择后表单值正确更新
      borrowReturnForm.value.instrumentId = value
    }

    // 处理领用归还
    const handleBorrowReturn = () => {
      // 表单验证
      borrowReturnFormRef.value.validate((valid) => {
        if (valid && !isSubmitting.value) {
          isSubmitting.value = true
          // 模拟提交成功
          setTimeout(() => {
            ElMessage.success(`${borrowReturnDialogType.value === 'borrow' ? '领用' : '归还'}成功`)
            showBorrowReturnDialog.value = false

            // 更新物品状态
            const updatedInstruments = [...instruments.value]
            const instrumentIndex = updatedInstruments.findIndex(item => item.id === parseInt(borrowReturnForm.value.instrumentId))

            if (instrumentIndex !== -1) {
              updatedInstruments[instrumentIndex].status = borrowReturnDialogType.value === 'borrow' ? 'BORROWED' : 'IN_STOCK'
              // 确保触发响应式更新
              store.commit('updateInstruments', [...updatedInstruments])

              // 记录领用/归还记录
              const now = new Date()
              const record = {
                id: Date.now(),
                employeeId: borrowReturnForm.value.employeeId,
                name: borrowReturnForm.value.name,
                instrumentId: borrowReturnForm.value.instrumentId,
                instrumentName: updatedInstruments[instrumentIndex].name,
                operationTime: now.toLocaleString()
              }

              if (borrowReturnDialogType.value === 'borrow') {
                record.borrowTime = now.toLocaleString()
                store.commit('addBorrowedRecord', record)
              } else {
                record.returnTime = now.toLocaleString()
                store.commit('addReturnedRecord', record)
              }
            }
            isSubmitting.value = false
          }, 500)
        }
      })
    }

    // 领用单个物品
    const borrowInstrument = (instrument) => {
      borrowReturnDialogType.value = 'borrow'
      showBorrowReturnDialog.value = true
      borrowReturnForm.value.instrumentId = instrument.id.toString()
    }

    // 归还单个物品
    const returnInstrument = (instrument) => {
      borrowReturnDialogType.value = 'return'
      showBorrowReturnDialog.value = true
      borrowReturnForm.value.instrumentId = instrument.id.toString()
    }

    // 从校准状态恢复到在库状态
    const returnFromCalibration = (instrument) => {
      ElMessageBox.confirm('确定将该计量器具标记为校准完成并恢复到在库状态吗？', '确认操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 更新物品状态
        const updatedInstruments = [...instruments.value]
        const instrumentIndex = updatedInstruments.findIndex(item => item.id === instrument.id)

        if (instrumentIndex !== -1) {
          updatedInstruments[instrumentIndex].status = 'IN_STOCK'
          store.commit('updateInstruments', [...updatedInstruments])
          ElMessage.success('已标记为校准完成并恢复到在库状态')
        }
      }).catch(() => {
        ElMessage.info('已取消操作')
      })
    }

    // 新增计量柜
    const addCabinet = () => {
      ElMessageBox.prompt('请输入计量柜名称', '新增计量柜', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const newCabinet = {
          id: cabinets.value.length + 1,
          name: value,
          description: '新增计量柜'
        }

        const updatedCabinets = [...cabinets.value, newCabinet]
        cabinets.value = updatedCabinets
        store.commit('updateCabinets', updatedCabinets)

        ElMessage.success('新增计量柜成功')
      }).catch(() => {
        ElMessage.info('已取消新增')
      })
    }

    // 新增物品
    const addInstrument = () => {
      showAddInstrumentDialog.value = true
      // 重置表单
      addInstrumentForm.value = {
        name: '',
        model: '',
        specification: ''
      }
      // 重置表单验证状态
      if (addInstrumentFormRef.value) {
        addInstrumentFormRef.value.resetFields()
      }
    }

    // 处理新增物品
    const handleAddInstrument = () => {
      // 表单验证
      addInstrumentFormRef.value.validate((valid) => {
        if (valid) {
          // 模拟添加物品
          const newInstrument = {
            id: instruments.value.length + 1,
            cabinetId: parseInt(activeCabinetId.value),
            name: addInstrumentForm.value.name,
            model: addInstrumentForm.value.model,
            specification: addInstrumentForm.value.specification,
            status: 'IN_STOCK'
          }

          const updatedInstruments = [...instruments.value, newInstrument]
          store.commit('updateInstruments', updatedInstruments)

          ElMessage.success('添加成功')
          showAddInstrumentDialog.value = false
        }
      })
    }

    // 编辑物品
    const editInstrument = (instrument) => {
      // 填充编辑表单
      editInstrumentForm.value = {
        name: instrument.name,
        model: instrument.model,
        specification: instrument.specification
      }
      // 存储当前编辑的物品ID
      selectedInstrument.value = instrument
      // 显示编辑对话框
      showEditInstrumentDialog.value = true
    }

    // 处理编辑物品
    const handleEditInstrument = () => {
      // 表单验证
      editInstrumentFormRef.value.validate((valid) => {
        if (valid) {
          // 模拟更新物品
          const updatedInstruments = [...instruments.value]
          const instrumentIndex = updatedInstruments.findIndex(item => item.id === selectedInstrument.value.id)

          if (instrumentIndex !== -1) {
            updatedInstruments[instrumentIndex].name = editInstrumentForm.value.name
            updatedInstruments[instrumentIndex].model = editInstrumentForm.value.model
            updatedInstruments[instrumentIndex].specification = editInstrumentForm.value.specification
            store.commit('updateInstruments', updatedInstruments)

            ElMessage.success('编辑成功')
            showEditInstrumentDialog.value = false
          }
        }
      })
    }

    // 处理行点击事件
    const handleRowClick = (row) => {
      selectedInstrument.value = row
    }

    // 管理员密码验证
    const verifyAdminPassword = (callback) => {
      ElMessageBox.prompt('请输入管理员密码', '管理员验证', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password'
      }).then(({ value }) => {
        // 这里是密码验证逻辑
        const storedPassword = localStorage.getItem('adminPassword') || 'weihuadai123'
        if (value === storedPassword) {
          // 验证成功，执行回调
          callback()
        } else {
          ElMessage.error('密码错误，验证失败')
        }
      }).catch(() => {
        ElMessage.info('已取消操作')
      })
    }

    // 删除物品
    const deleteInstrument = (instrument) => {
      ElMessageBox.confirm(`确定要删除${instrument.name}吗？`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        const updatedInstruments = instruments.value.filter(item => item.id !== instrument.id)
        store.commit('updateInstruments', updatedInstruments)
        ElMessage.success('删除成功')
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }

    // 监听计量柜数据变化，更新所有模块的计量柜名称
    watch(cabinets, (newCabinets) => {
      // 直接更新store中的cabinets数据
      store.commit('updateCabinets', newCabinets);
    }, { deep: true });

    // 表单引用
    const borrowReturnFormRef = ref(null)
    const addInstrumentFormRef = ref(null)

    return {
      isAdmin,
      cabinets,
      activeCabinetId,
      searchText,
      showBorrowReturnDialog,
      borrowReturnDialogType,
      borrowReturnForm,
      borrowReturnRules,
      showAddInstrumentDialog,
      addInstrumentForm,
      addInstrumentRules,
      instruments,
      instrumentCounts,
      statusTextMap,
      statusTypeMap,
      currentCabinetInstruments,
      borrowedInstruments,
      filteredInstruments,
      openBorrowReturnDialog,
      closeBorrowReturnDialog,
      handleBorrowReturn,
      borrowInstrument,
      returnInstrument,
      addCabinet,
      addInstrument,
      handleAddInstrument,
      editInstrument,
      handleEditInstrument,
      deleteInstrument,
      returnFromCalibration,
      // 表单引用
      borrowReturnFormRef,
      addInstrumentFormRef,
      editInstrumentFormRef,
      // 其他变量
      isLoading,
      isSubmitting,
      // 新增变量和方法
      selectedInstrument,
      handleRowClick,
      verifyAdminPassword,
      showEditInstrumentDialog,
      editInstrumentForm,
      editInstrumentRules
    }
  }
}
</script>

<style scoped>
.cabinet-items-container {
  padding: 20px;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.items-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.right-buttons {
  display: flex;
  gap: 10px;
}

.items-toolbar .el-input {
  width: 200px;
}

.stats-card .stats-container {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}

.stats-card .stat-item {
  text-align: center;
}

.stats-card .stat-label {
  font-size: 14px;
  color: #606266;
}

.stats-card .stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  margin-top: 5px;
}
</style>