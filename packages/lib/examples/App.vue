<template>
  <el-container class="app-container">
    <!-- 顶部导航栏 -->
    <el-header v-if="!isScreenPage" class="header">
      <div class="header-left" @click="goHome">
        <h1>大屏组件库</h1>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="goToScreen">进入大屏模式</el-button>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside v-if="!isScreenPage" width="240px">
        <el-menu :default-active="activeMenu" class="menu" router>
          <!-- 动态生成菜单 -->
          <template v-for="menu in menuRoutes">
            <el-sub-menu v-if="menu.children" :key="menu.path" :index="menu.path">
              <template #title>
                <el-icon><i :class="menu.meta.icon"></i></el-icon>
                <span>{{ menu.meta.title }}</span>
              </template>
              <!-- 渲染子菜单 -->
              <el-menu-item
                v-for="child in menu.children"
                :key="child.path"
                :index="menu.path + '/' + child.path"
              >
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
      </el-aside>

      <!-- 主内容区域 -->
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// 路由实例
const router = useRouter();
const route = useRoute();

// 当前选中的菜单项
const activeMenu = computed(() => route.path);

// 筛选菜单路由：仅显示有 meta.title 的路由
const menuRoutes = computed(() => {
  const filterRoutes = routes =>
    routes
      .filter(r => r.meta && r.meta.title) // 筛选有 meta.title 的路由
      .map(r => ({
        ...r,
        children: r.children ? filterRoutes(r.children) : null // 递归子路由
      }));

  return filterRoutes(router.options.routes);
});

// 跳转到首页
const goHome = () => {
  router.push('/'); // 跳转到默认首页
};

// 跳转到大屏独立页面
const goToScreen = () => {
  router.push('/screen'); // 跳转到大屏页面
};

// 判断是否为大屏独立页面
const isScreenPage = computed(() => route.path === '/screen');
</script>

<style scoped lang="scss">
.app-container {
  height: 100vh;
  background: var(--el-bg-color);

  .header {
    height: 60px;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: var(--el-bg-color-page);
    border-bottom: 1px solid var(--el-border-color-light);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .header-left {
      cursor: pointer;

      h1 {
        margin: 0;
        font-size: 18px;
        font-weight: bold;
        color: var(--el-text-color-primary);

        &:hover {
          color: var(--el-color-primary);
        }
      }
    }

    .header-right {
      .el-button {
        margin-left: 20px;
      }
    }
  }

  .menu {
    border-right: none;
    background-color: var(--el-bg-color);

    .el-sub-menu__title {
      color: var(--el-text-color-primary);
    }

    .el-menu-item {
      color: var(--el-text-color-secondary);
      &.is-active {
        color: var(--el-color-primary);
      }
    }
  }

  .el-aside {
    border-right: 1px solid var(--el-border-color-light);
    background-color: var(--el-bg-color);
  }

  .el-main {
    padding: 16px;
    background: var(--el-bg-color-page);
  }
}
</style>
