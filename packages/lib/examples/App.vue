<template>
  <el-container class="app-container" :class="{ 'is-screen': isScreenPage }">
    <!-- 顶部导航栏 -->
    <el-header v-if="!isScreenPage" class="header" height="64px">
      <div class="header-left" @click="goHome">
        <el-icon class="logo-icon" :size="24"><Monitor /></el-icon>
        <h1>大屏组件库</h1>
      </div>
      <div class="header-right">
        <el-tooltip content="系统设置" placement="bottom" :show-after="300">
          <el-button class="setting-button" :icon="Setting" circle @click="drawerVisible = true" />
        </el-tooltip>
      </div>
    </el-header>

    <el-container class="main-container">
      <!-- 侧边栏 -->
      <el-aside v-if="!isScreenPage" :width="isCollapse ? '64px' : '240px'" class="aside">
        <el-scrollbar>
          <el-menu
            :default-active="activeMenu"
            class="menu"
            :collapse="isCollapse"
            :collapse-transition="false"
            router
          >
            <template v-for="menu in menuRoutes">
              <el-sub-menu v-if="menu.children" :key="menu.path" :index="menu.path">
                <template #title>
                  <el-icon><i :class="menu.meta.icon"></i></el-icon>
                  <span>{{ menu.meta.title }}</span>
                </template>
                <el-menu-item v-for="child in menu.children" :key="child.path" :index="child.path">
                  <el-icon><i :class="child.meta.icon"></i></el-icon>
                  <span>{{ child.meta.title }}</span>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :key="menu.path" :index="menu.path">
                <el-icon><i :class="menu.meta.icon"></i></el-icon>
                <span>{{ menu.meta.title }}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <!-- 主内容区域 -->
      <el-main class="main">
        <el-scrollbar>
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-scrollbar>
      </el-main>
    </el-container>

    <!-- 设置抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="系统设置"
      direction="rtl"
      :with-header="false"
      size="360px"
    >
      <el-scrollbar>
        <div class="drawer-content">
          <div class="drawer-header">
            <h2 class="drawer-title">系统设置</h2>
          </div>

          <!-- 界面设置 -->
          <section class="setting-section">
            <h3 class="setting-title">
              <el-icon><Monitor /></el-icon>
              显示设置
            </h3>
            <div class="setting-content">
              <el-button
                type="primary"
                class="screen-mode-btn"
                :icon="FullScreen"
                @click="goToScreen"
              >
                {{ isScreenPage ? '退出大屏模式' : '进入大屏模式' }}
              </el-button>

              <el-form :model="interfaceConfig" label-position="left" label-width="80px">
                <el-form-item label="菜单折叠">
                  <el-switch v-model="isCollapse" />
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 主题模式 -->
          <section class="setting-section">
            <h3 class="setting-title">
              <el-icon><Brush /></el-icon>
              主题设置
            </h3>
            <div class="setting-content">
              <el-form :model="themeConfig" label-position="left" label-width="80px">
                <el-form-item label="主题模式">
                  <el-select v-model="themeMode" class="theme-select" @change="handleModeChange">
                    <el-option
                      v-for="item in themeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                      <template #prefix>
                        <el-icon>
                          <component :is="item.icon" />
                        </el-icon>
                      </template>
                      {{ item.label }}
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 过渡动画 -->
          <section class="setting-section">
            <h3 class="setting-title">
              <el-icon><VideoPause /></el-icon>
              动画设置
            </h3>
            <div class="setting-content">
              <el-form :model="transitionConfig" label-position="left" label-width="80px">
                <el-form-item label="启用动画">
                  <el-switch
                    v-model="transitionConfig.enableTransition"
                    @change="handleTransitionChange"
                  />
                </el-form-item>
                <el-form-item v-if="transitionConfig.enableTransition" label="动画时长">
                  <el-slider
                    v-model="transitionConfig.duration"
                    :min="100"
                    :max="1000"
                    :step="50"
                    :format-tooltip="val => `${val}ms`"
                    @change="handleTransitionChange"
                  />
                </el-form-item>
              </el-form>
            </div>
          </section>
        </div>
      </el-scrollbar>
    </el-drawer>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  Setting,
  Monitor,
  Brush,
  VideoPause,
  FullScreen,
  Moon,
  Sunny,
  DArrowRight
} from '@element-plus/icons-vue';
import { useTheme } from '@lib/core/theme';
import { ThemeManager } from '@lib/core/theme/theme-manager';
import { TransitionManager } from '@lib/core/transition';

// 路由实例
const router = useRouter();
const route = useRoute();

// 主题管理器实例
const themeManager = ThemeManager.getInstance();

// 过渡动画管理器实例
const transitionManager = TransitionManager.getInstance();

// 菜单折叠状态
const isCollapse = ref(false);

// 抽屉可见性
const drawerVisible = ref(false);

// 主题切换
const { isDark, toggleTheme } = useTheme();

// 当前主题模式
const themeMode = ref(isDark.value ? 'dark' : 'light');

// 主题选项
const themeOptions = [
  { label: '亮色模式', value: 'light', icon: Sunny },
  { label: '暗色模式', value: 'dark', icon: Moon },
  { label: '跟随系统', value: 'system', icon: DArrowRight }
];

// 过渡动画配置
const transitionConfig = ref(transitionManager.getConfig());

// 界面配置
const interfaceConfig = ref({
  menuCollapse: false
});

// 主题配置
const themeConfig = ref({});

// 处理主题模式变化
const handleModeChange = (mode: string) => {
  if (mode === 'system') {
    // 跟随系统
    themeMode.value = mode;
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    // 手动切换
    themeMode.value = mode;
    isDark.value = mode === 'dark';
  }
};

// 处理过渡动画配置变化
const handleTransitionChange = () => {
  transitionManager.updateConfig(transitionConfig.value);
};

// 当前选中的菜单项
const activeMenu = computed(() => route.path);

// 筛选菜单路由
const menuRoutes = computed(() => {
  const routes = router.getRoutes();

  // 过滤出顶级路由
  const topRoutes = routes.filter(route => {
    const pathParts = route.path.split('/').filter(Boolean);
    return pathParts.length === 1 && route.meta?.title && route.path !== '/screen';
  });

  // 为每个顶级路由查找其子路由
  return topRoutes
    .map(route => {
      const children = routes.filter(r => {
        const isChild =
          r.path.startsWith(route.path + '/') && r.path.split('/').filter(Boolean).length === 2;
        return isChild && r.meta?.title;
      });

      if (children.length === 0) {
        return {
          path: route.path,
          meta: route.meta
        };
      }

      return {
        path: route.path,
        meta: route.meta,
        children: children.map(child => ({
          path: child.path,
          meta: child.meta
        }))
      };
    })
    .sort((a, b) => {
      const orderA = a.meta?.order || 0;
      const orderB = b.meta?.order || 0;
      return orderA - orderB;
    });
});

// 跳转到首页
const goHome = () => {
  router.push('/');
};

// 跳转到大屏独立页面
const goToScreen = () => {
  if (route.path === '/screen') {
    router.back();
  } else {
    router.push('/screen');
  }
  drawerVisible.value = false;
};

// 判断是否为大屏独立页面
const isScreenPage = computed(() => route.path === '/screen');
</script>

<style lang="scss" scoped>
.app-container {
  height: 100vh;
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
  transition-property: color, background-color, border-color;
  transition-duration: var(--bsf-transition-duration);
  transition-timing-function: var(--bsf-transition-timing);

  &.is-screen {
    background-color: var(--bsf-bg-color-screen);
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 20px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  color: var(--el-text-color-primary);
  box-shadow: var(--el-box-shadow-light);
  transition-property: color, background-color, border-color;
  transition-duration: var(--bsf-transition-duration);
  transition-timing-function: var(--bsf-transition-timing);

  .header-left {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    transition-property: opacity;
    transition-duration: var(--bsf-transition-duration);
    transition-timing-function: var(--bsf-transition-timing);

    &:hover {
      opacity: 0.8;
    }

    .logo-icon {
      margin-right: 12px;
      color: var(--el-color-primary);
      transition-property: color;
      transition-duration: var(--bsf-transition-duration);
      transition-timing-function: var(--bsf-transition-timing);
    }

    h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      transition-property: color;
      transition-duration: var(--bsf-transition-duration);
      transition-timing-function: var(--bsf-transition-timing);
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .theme-switch {
      margin: 0 8px;
    }

    .setting-button {
      transition-property: transform;
      transition-duration: var(--bsf-transition-duration);
      transition-timing-function: var(--bsf-transition-timing);

      &:hover {
        transform: rotate(90deg);
      }
    }
  }
}

.main-container {
  height: calc(100vh - 64px);
  background-color: var(--el-bg-color);
  transition-property: color, background-color, border-color;
  transition-duration: var(--bsf-transition-duration);
  transition-timing-function: var(--bsf-transition-timing);
}

.aside {
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
  overflow: hidden;
  transition-property: all;
  transition-duration: var(--bsf-transition-duration);
  transition-timing-function: var(--bsf-transition-timing);

  .menu {
    height: 100%;
    border-right: none;
    background-color: transparent;
    transition-property: color, background-color, border-color;
    transition-duration: var(--bsf-transition-duration);
    transition-timing-function: var(--bsf-transition-timing);

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      transition-property: color, background-color, border-color;
      transition-duration: var(--bsf-transition-duration);
      transition-timing-function: var(--bsf-transition-timing);

      &:hover {
        background-color: var(--el-fill-color-light);
      }
    }

    :deep(.el-menu-item) {
      border-right: 2px solid transparent;

      &.is-active {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
        border-right-color: var(--el-color-primary);
      }
    }
  }
}

.main {
  padding: 20px;
  background-color: var(--el-bg-color);
  overflow: hidden;
  transition-property: color, background-color, border-color;
  transition-duration: var(--bsf-transition-duration);
  transition-timing-function: var(--bsf-transition-timing);
}

.drawer-content {
  padding: 20px;
  color: var(--el-text-color-primary);
  transition-property: color, background-color, border-color;
  transition-duration: var(--bsf-transition-duration);
  transition-timing-function: var(--bsf-transition-timing);

  .drawer-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--el-border-color-light);
    transition-property: color, background-color, border-color;
    transition-duration: var(--bsf-transition-duration);
    transition-timing-function: var(--bsf-transition-timing);

    .drawer-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      transition-property: color;
      transition-duration: var(--bsf-transition-duration);
      transition-timing-function: var(--bsf-transition-timing);
    }
  }

  .setting-section {
    margin-bottom: 24px;
    padding: 16px;
    background-color: var(--el-fill-color-blank);
    border-radius: 8px;
    transition-property: color, background-color, border-color;
    transition-duration: var(--bsf-transition-duration);
    transition-timing-function: var(--bsf-transition-timing);

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    .setting-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px;
      font-size: 16px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      transition-property: color;
      transition-duration: var(--bsf-transition-duration);
      transition-timing-function: var(--bsf-transition-timing);

      .el-icon {
        font-size: 18px;
        color: var(--el-color-primary);
        transition-property: color;
        transition-duration: var(--bsf-transition-duration);
        transition-timing-function: var(--bsf-transition-timing);
      }
    }

    .setting-content {
      .screen-mode-btn {
        width: 100%;
        margin-bottom: 16px;
      }

      .theme-select {
        width: 100%;
      }

      :deep(.el-form-item) {
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

// 路由过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--bsf-transition-duration) var(--bsf-transition-timing);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
