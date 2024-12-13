<template>
  <div class="screen-index">
    <el-row :gutter="20">
      <el-col v-for="item in cards" :key="item.title" :span="8">
        <div class="data-card">
          <div class="card-title">{{ item.title }}</div>
          <div class="card-value">{{ item.value }}</div>
          <div class="card-chart">
            <el-progress
              :percentage="item.percentage"
              :color="item.color"
              :show-text="false"
              :stroke-width="6"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="chart-container">
      <div class="chart-title">数据趋势</div>
      <div class="chart-content">
        <!-- 这里可以放置实际的图表组件 -->
        <div class="mock-chart">
          <div
            v-for="n in 10"
            :key="n"
            class="mock-bar"
            :style="{ height: `${Math.random() * 80 + 20}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const cards = [
  {
    title: '总访问量',
    value: '234,567',
    percentage: 85,
    color: '#409EFF'
  },
  {
    title: '用户数量',
    value: '45,678',
    percentage: 65,
    color: '#67C23A'
  },
  {
    title: '订单总量',
    value: '89,012',
    percentage: 75,
    color: '#E6A23C'
  }
];
</script>

<style scoped>
.screen-index {
  padding: 20px;
  color: #fff;
  height: 100%;
}

.data-card {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

.card-chart {
  height: 6px;
}

.chart-container {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 20px;
  margin-top: 20px;
}

.chart-title {
  font-size: 16px;
  margin-bottom: 20px;
}

.chart-content {
  height: 300px;
}

.mock-chart {
  height: 100%;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 20px 0;
}

.mock-bar {
  flex: 1;
  background: linear-gradient(180deg, var(--el-color-primary) 0%, rgba(64, 158, 255, 0.3) 100%);
  border-radius: 2px;
  transition: height 0.3s ease;
}
</style>
