<template>
  <div class="basic-dashboard">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>仪表盘</h2>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="stat-header">
                <el-icon><User /></el-icon>
                <span>用户</span>
              </div>
            </template>
            <div class="stat-content">1,234</div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="stat-header">
                <el-icon><View /></el-icon>
                <span>访问</span>
              </div>
            </template>
            <div class="stat-content">5,678</div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="stat-header">
                <el-icon><DataLine /></el-icon>
                <span>数据</span>
              </div>
            </template>
            <div class="stat-content">9,012</div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { User, View, DataLine } from '@element-plus/icons-vue';
</script>

<style scoped>
.basic-dashboard {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  margin: 0;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-regular);
}

.stat-content {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  text-align: center;
  padding: 10px 0;
}

.el-row {
  margin-bottom: 20px;
}
</style>
