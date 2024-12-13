<!-- Router Examples Index Page -->
<template>
  <div class="router-examples">
    <h2>路由模块示例</h2>
    <div class="example-nav">
      <router-link to="/application/router/basic" class="nav-item">
        <el-icon><Operation /></el-icon>
        <span>基础用法</span>
      </router-link>
      <router-link to="/application/router/middleware" class="nav-item">
        <el-icon><Switch /></el-icon>
        <span>中间件示例</span>
      </router-link>
      <router-link to="/application/router/plugin" class="nav-item">
        <el-icon><Connection /></el-icon>
        <span>插件示例</span>
      </router-link>
      <router-link to="/application/router/template" class="nav-item">
        <el-icon><Files /></el-icon>
        <span>模板示例</span>
      </router-link>
    </div>
    <div class="example-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Operation, Switch, Connection, Files } from '@element-plus/icons-vue';
</script>

<style scoped>
.router-examples {
  padding: 20px;
}

.example-nav {
  display: flex;
  gap: 20px;
  margin: 20px 0;
  padding: 20px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  color: var(--el-text-color-primary);
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.nav-item.router-link-active {
  background-color: var(--el-color-primary);
  color: white;
}

.example-content {
  margin-top: 20px;
  padding: 20px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
}

h2 {
  margin: 0;
  color: var(--el-text-color-primary);
}
</style>
