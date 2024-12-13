import type { RouteRecordRaw } from 'vue-router';
import type { Component } from 'vue';

/**
 * 基础路由模板
 */
export const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../../../components/default-pages/BasicLogin.vue'),
    meta: {
      title: '登录',
      layout: 'blank'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../../../components/default-pages/BasicDashboard.vue'),
    meta: {
      title: '仪表盘',
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../../../components/default-pages/BasicNotFound.vue'),
    meta: {
      title: '404',
      layout: 'blank'
    }
  }
];

/**
 * 管理路由模板
 */
export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'Admin',
    component: () =>
      import('../../../../examples/views/application/router/components/BasicAdmin.vue'),
    meta: {
      title: '管理',
      requiresAuth: true,
      roles: ['admin']
    }
  }
];

/**
 * 大屏路由模板
 */
export const screenRoutes: RouteRecordRaw[] = [
  {
    path: '/screen',
    name: 'Screen',
    component: () =>
      import('../../../../examples/views/application/router/components/ScreenLayout.vue'),
    children: [
      {
        path: 'index',
        name: 'ScreenIndex',
        component: () =>
          import('../../../../examples/views/application/router/components/ScreenIndex.vue'),
        meta: {
          title: '大屏首页',
          keepAlive: true
        }
      }
    ]
  }
];

/**
 * 路由模板工厂
 */
export class RouteTemplateFactory {
  /**
   * 创建基础路由
   */
  static createBasicRoutes(options?: {
    loginComponent?: Component;
    notFoundComponent?: Component;
    dashboardComponent?: Component;
  }): RouteRecordRaw[] {
    const routes = [...basicRoutes];

    if (options?.loginComponent) {
      routes[1].component = options.loginComponent;
    }
    if (options?.notFoundComponent) {
      routes[3].component = options.notFoundComponent;
    }
    if (options?.dashboardComponent) {
      routes[2].component = options.dashboardComponent;
    }

    return routes;
  }

  /**
   * 创建大屏路由
   */
  static createScreenRoutes(options?: {
    layout?: Component;
    home?: Component;
    children?: RouteRecordRaw[];
  }): RouteRecordRaw[] {
    const routes = [...screenRoutes];

    if (options?.layout) {
      routes[0].component = options.layout;
    }
    if (options?.home) {
      routes[0].children![0].component = options.home;
    }
    if (options?.children) {
      routes[0].children!.push(...options.children);
    }

    return routes;
  }

  /**
   * 创建管理路由
   */
  static createAdminRoutes(options?: { adminComponent?: Component }): RouteRecordRaw[] {
    const routes = [...adminRoutes];

    if (options?.adminComponent) {
      routes[0].component = options.adminComponent;
    }

    return routes;
  }
}
