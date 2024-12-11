<template>
  <div class="screen-page">
    <div class="header">
      <h1>大屏示例</h1>
      <div class="actions">
        <el-switch
          v-model="isDark"
          class="theme-switch"
          inline-prompt
          :active-icon="Moon"
          :inactive-icon="Sunny"
          @change="toggleTheme"
        />
        <el-button type="primary" @click="goBack">返回主页</el-button>
      </div>
    </div>

    <div class="content">
      <el-row :gutter="20">
        <!-- 数据概览卡片 -->
        <el-col v-for="card in dataCards" :key="card.title" :span="6">
          <el-card class="data-card">
            <div class="card-content">
              <div class="title">{{ card.title }}</div>
              <div class="value">{{ card.value }}</div>
              <div class="trend" :class="card.trend">
                {{ card.trend === 'up' ? '↑' : '↓' }} {{ card.change }}%
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 图表展示区域 -->
      <el-row :gutter="20" class="charts-row">
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>访问趋势</span>
              </div>
            </template>
            <div class="chart-placeholder">图表区域</div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>用户分布</span>
              </div>
            </template>
            <div class="chart-placeholder">图表区域</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Moon, Sunny } from '@element-plus/icons-vue';
import { useTheme } from '@lib/core/theme';

const router = useRouter();
const { isDark, toggleTheme } = useTheme();

// 返回主页
const goBack = () => {
  router.push('/');
};

// 模拟数据
const dataCards = [
  { title: '总访问量', value: '234,567', trend: 'up', change: '15' },
  { title: '活跃用户', value: '45,678', trend: 'up', change: '8' },
  { title: '转化率', value: '12.3%', trend: 'down', change: '3' },
  { title: '平均停留', value: '00:05:23', trend: 'up', change: '12' }
];
</script>

<style lang="scss" scoped>
.screen-page {
  min-height: 100vh;
  padding: 20px;
  background-color: var(--bsf-color-background-base);

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h1 {
      margin: 0;
      color: var(--bsf-color-text-primary);
    }

    .actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }
  }

  .content {
    .data-card {
      margin-bottom: 20px;
      background-color: var(--bsf-color-background-light);

      .card-content {
        text-align: center;
        padding: 12px;

        .title {
          color: var(--bsf-color-text-secondary);
          font-size: 14px;
          margin-bottom: 8px;
        }

        .value {
          color: var(--bsf-color-text-primary);
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .trend {
          font-size: 14px;
          &.up {
            color: var(--bsf-color-success);
          }
          &.down {
            color: var(--bsf-color-danger);
          }
        }
      }
    }

    .charts-row {
      margin-top: 20px;
    }

    .chart-card {
      margin-bottom: 20px;
      background-color: var(--bsf-color-background-light);

      .card-header {
        color: var(--bsf-color-text-primary);
      }

      .chart-placeholder {
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--bsf-color-text-secondary);
        border: 1px dashed var(--bsf-color-border-light);
        border-radius: 4px;
      }
    }
  }
}
</style>
