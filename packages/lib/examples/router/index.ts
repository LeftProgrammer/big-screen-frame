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
        path: 'layout',
        name: 'CoreLayout',
        component: () => import('../views/core/layout/index.vue'),
        meta: { title: '布局系统', icon: 'el-icon-grid' }
      },
      {
        path: 'transition',
        name: 'CoreTransition',
        component: () => import('../views/core/transition/index.vue'),
        meta: { title: '过渡动画', icon: 'el-icon-magic-stick' }
      },
      {
        path: 'http',
        name: 'CoreHttp',
        component: () => import('../views/core/http/index.vue'),
        meta: { title: 'HTTP模块', icon: 'el-icon-connection' }
      }
    ]
  },
  {
    path: '/application',
    name: 'Application',
    meta: {
      title: '应用',
      icon: 'Application'
    },
    children: [
      {
        path: 'auth',
        name: 'Auth',
        component: () => import('../views/application/auth/index.vue'),
        meta: {
          title: '认证示例',
          icon: 'Lock'
        }
      },
      {
        path: 'basic',
        name: 'BasicLogin',
        component: () => import('../views/application/auth/basic-login.vue'),
        meta: {
          title: '基础登录',
          icon: 'Key'
        }
      },
      {
        path: 'custom',
        name: 'CustomAuth',
        component: () => import('../views/application/auth/custom-auth.vue'),
        meta: {
          title: '自定义认证',
          icon: 'SetUp'
        }
      },
      {
        path: 'permission',
        name: 'PermissionControl',
        component: () => import('../views/application/auth/permission-control.vue'),
        meta: {
          title: '权限控制',
          icon: 'UserFilled'
        }
      },
      {
        path: 'router',
        name: 'Router',
        component: () => import('../views/application/router/index.vue'),
        meta: {
          title: '路由示例',
          icon: 'Share'
        }
      },
      {
        path: 'usage',
        name: 'RouterUsage',
        component: () => import('../views/application/router/basic-usage.vue'),
        meta: {
          title: '路由示例',
          icon: 'Share'
        }
      },
      {
        path: 'websocket',
        name: 'ApplicationWebSocket',
        component: () => import('../views/application/websocket/websocket-example.vue'),
        meta: {
          title: 'WebSocket示例',
          icon: 'Connection'
        }
      },
      {
        path: 'sse',
        name: 'ApplicationSSE',
        component: () => import('../views/application/sse/sse-example.vue'),
        meta: {
          title: 'SSE示例',
          icon: 'Connection'
        }
      },
      {
        path: 'middleware',
        name: 'RouterMiddleware',
        component: () => import('../views/application/router/middleware-example.vue'),
        meta: {
          title: '中间件示例',
          icon: 'Switch'
        }
      },
      {
        path: 'plugin',
        name: 'RouterPlugin',
        component: () => import('../views/application/router/plugin-example.vue'),
        meta: {
          title: '插件示例',
          icon: 'Connection'
        }
      },
      {
        path: 'template',
        name: 'RouterTemplate',
        component: () => import('../views/application/router/template-example.vue'),
        meta: {
          title: '模板示例',
          icon: 'Files'
        }
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
