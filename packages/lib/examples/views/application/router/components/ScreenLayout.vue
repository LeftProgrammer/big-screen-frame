<template>
  <div class="screen-layout">
    <el-container>
      <el-header>
        <div class="header-content">
          <h1>大屏布局</h1>
          <el-button type="primary" @click="toggleFullscreen">
            <el-icon><FullScreen /></el-icon>
            {{ isFullscreen ? '退出全屏' : '全屏' }}
          </el-button>
        </div>
      </el-header>

      <el-main>
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FullScreen } from '@element-plus/icons-vue';

const isFullscreen = ref(false);

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
};
</script>

<style scoped>
.screen-layout {
  height: 100vh;
}

.el-container {
  height: 100%;
}

.el-header {
  background-color: var(--el-color-primary-light-9);
  padding: 0 20px;
}

.header-content {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  margin: 0;
  font-size: 20px;
  color: var(--el-text-color-primary);
}

.el-main {
  padding: 0;
  background-color: #000;
}
</style>
