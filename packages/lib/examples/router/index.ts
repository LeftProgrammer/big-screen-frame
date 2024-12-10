import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 核心功能示例路由
const coreRoutes: RouteRecordRaw[] = [
  {
    path: '/core',
    name: 'Core',
    redirect: '/core/layout/scale-screen/basic',
    children: [
      {
        path: 'layout/scale-screen/basic',
        name: 'ScaleScreenBasic',
        component: () => import('../core/layout/scale-screen/basic.vue'),
        meta: {
          title: 'Scale Screen Basic',
          group: 'Layout'
        }
      },
      {
        path: 'theme',
        name: 'Theme',
        component: () => import('../views/theme/index.vue'),
        meta: {
          title: 'Theme',
          group: 'Core'
        }
      }
    ]
  }
];

// 组件示例路由
const componentRoutes: RouteRecordRaw[] = [
  {
    path: '/components',
    name: 'Components',
    redirect: '/components/basic',
    children: []
  }
];

// 完整示例路由
const demoRoutes: RouteRecordRaw[] = [
  {
    path: '/demos',
    name: 'Demos',
    redirect: '/demos/dashboard',
    children: []
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/core/layout/scale-screen/basic'
    },
    ...coreRoutes,
    ...componentRoutes,
    ...demoRoutes
  ]
});

export default router;
