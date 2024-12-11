// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/core/theme' // 默认跳转到首页功能模块
  },
  {
    path: '/screen',
    name: 'Screen',
    component: () => import('../views/screen/index.vue'),
    meta: { title: '完整大屏示例', icon: 'el-icon-monitor' }
  },
  {
    path: '/core',
    name: 'Core',
    meta: { title: '核心功能', icon: 'el-icon-setting' },
    children: [
      {
        path: 'theme',
        name: 'CoreTheme',
        component: () => import('../views/core/theme/index.vue'),
        meta: { title: '主题系统', icon: 'el-icon-magic-stick' }
      },
      {
        path: 'transition',
        name: 'CoreTransition',
        component: () => import('../views/core/transition/index.vue'),
        meta: { title: '过渡动画', icon: 'el-icon-video-play' }
      },
      {
        path: 'layout',
        name: 'CoreLayout',
        component: () => import('../views/core/layout/index.vue'),
        meta: { title: '布局系统', icon: 'el-icon-grid' }
      }
    ]
  },
  {
    path: '/components',
    name: 'Components',
    meta: { title: '组件示例', icon: 'el-icon-menu' },
    children: [
      // {
      //   path: 'charts',
      //   name: 'ComponentsCharts',
      //   component: () => import('../views/components/Charts.vue'),
      //   meta: { title: '图表组件', icon: 'el-icon-data-board' },
      // },
      // {
      //   path: 'basic',
      //   name: 'ComponentsBasic',
      //   component: () => import('../views/components/Basic.vue'),
      //   meta: { title: '基础组件', icon: 'el-icon-box' },
      // },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
