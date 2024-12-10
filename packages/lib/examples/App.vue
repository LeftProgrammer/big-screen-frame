<template>
  <div class="app">
    <el-menu
      class="nav"
      :default-active="activeMenu"
      :router="true"
      :default-openeds="['core', 'components', 'demos']"
    >
      <div class="nav-header">
        <h1>Big Screen Frame</h1>
        <p>Examples & Documentation</p>
      </div>

      <!-- 核心功能 -->
      <el-sub-menu index="core">
        <template #title>
          <el-icon><Monitor /></el-icon>
          <span>Core Features</span>
        </template>

        <el-menu-item-group title="Layout">
          <el-menu-item index="/core/layout/scale-screen/basic"> Scale Screen </el-menu-item>
        </el-menu-item-group>

        <el-menu-item-group title="Theme">
          <el-menu-item index="/core/theme">Theme System</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>

      <!-- 组件 -->
      <el-sub-menu index="components">
        <template #title>
          <el-icon><Grid /></el-icon>
          <span>Components</span>
        </template>

        <el-menu-item-group title="Basic">
          <el-menu-item index="/components/button" disabled>Button</el-menu-item>
          <el-menu-item index="/components/card" disabled>Card</el-menu-item>
        </el-menu-item-group>

        <el-menu-item-group title="Data">
          <el-menu-item index="/components/table" disabled>Table</el-menu-item>
          <el-menu-item index="/components/chart" disabled>Chart</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>

      <!-- 完整示例 -->
      <el-sub-menu index="demos">
        <template #title>
          <el-icon><Operation /></el-icon>
          <span>Complete Demos</span>
        </template>

        <el-menu-item index="/demos/dashboard" disabled>Dashboard</el-menu-item>
        <el-menu-item index="/demos/data-analysis" disabled> Data Analysis </el-menu-item>
        <el-menu-item index="/demos/monitoring" disabled> Monitoring Center </el-menu-item>
      </el-sub-menu>
    </el-menu>

    <main class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const route = useRoute();
const activeMenu = computed(() => route.path);
const { Monitor, Grid, Operation } = ElementPlusIconsVue;
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: var(--bsf-bg-color-base);

  .nav {
    width: 260px;
    height: 100%;
    border-right: 1px solid var(--bsf-border-color);
    background: var(--bsf-bg-color-light);

    .nav-header {
      padding: 20px;
      border-bottom: 1px solid var(--bsf-border-color);

      h1 {
        font-size: 20px;
        margin: 0 0 8px;
        color: var(--bsf-text-color-primary);
      }

      p {
        font-size: 14px;
        margin: 0;
        color: var(--bsf-text-color-secondary);
      }
    }
  }

  .main {
    flex: 1;
    height: 100%;
    overflow: auto;
    background: var(--bsf-bg-color-base);
  }
}

// 路由过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
