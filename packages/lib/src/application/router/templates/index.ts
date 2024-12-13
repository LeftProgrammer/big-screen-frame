import type { RouteRecordRaw } from 'vue-router';
import type { Component } from 'vue';

/**
 * 基础路由模板
 */
export const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/BasicLogin.vue'),
    meta: {
      title: '登录',
      hidden: true
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../components/404.vue'),
    meta: {
      title: '404',
      hidden: true
    }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('../components/403.vue'),
    meta: {
      title: '403',
      hidden: true
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
    component: () => import('../components/ScreenLayout.vue'),
    children: [
      {
        path: 'index',
        name: 'ScreenIndex',
        component: () => import('../components/ScreenIndex.vue'),
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
    forbiddenComponent?: Component;
  }): RouteRecordRaw[] {
    const routes = [...basicRoutes];

    if (options?.loginComponent) {
      routes[0].component = options.loginComponent;
    }
    if (options?.notFoundComponent) {
      routes[1].component = options.notFoundComponent;
    }
    if (options?.forbiddenComponent) {
      routes[2].component = options.forbiddenComponent;
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
}
