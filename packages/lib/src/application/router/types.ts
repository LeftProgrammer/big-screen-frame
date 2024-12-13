// 路由处理模块类型定义
import type {
  RouteRecordRaw,
  RouteLocationRaw,
  RouteLocationNormalized,
  NavigationGuard,
  NavigationHookAfter
} from 'vue-router';
import type { Component } from 'vue';

/**
 * 路由配置接口
 */
export interface RouterConfig {
  // 基础配置
  mode?: 'hash' | 'history';
  base?: string;

  // 默认路由配置
  defaultRoutes?: {
    home?: string;
    login?: string;
    error?: string;
    notFound?: string;
    forbidden?: string;
  };

  // 过渡动画配置
  transition?: {
    name?: string;
    mode?: 'in-out' | 'out-in';
    onBeforeEnter?: (el: Element) => void;
    onEnter?: (el: Element, done: () => void) => void;
    onAfterEnter?: (el: Element) => void;
    onBeforeLeave?: (el: Element) => void;
    onLeave?: (el: Element, done: () => void) => void;
    onAfterLeave?: (el: Element) => void;
  };

  // 进度条配置
  progress?: {
    color?: string;
    duration?: number;
    showSpinner?: boolean;
  };

  // 缓存配置
  cache?: {
    max?: number;
    include?: string[];
    exclude?: string[];
  };

  // 权限配置
  permission?: {
    loginPath?: string;
    homePath?: string;
    whiteList?: string[];
    checkPermission?: (permission: string | string[]) => boolean | Promise<boolean>;
  };
}

/**
 * 路由模块配置
 */
export interface RouterModule {
  name: string;
  routes: RouteRecordRaw[];
  beforeEnter?: NavigationGuard;
  afterEnter?: NavigationHookAfter;
}

/**
 * 路由事件类型
 */
export type RouterEventType =
  | 'beforeEach'
  | 'afterEach'
  | 'beforeEnter'
  | 'afterEnter'
  | 'beforeLeave'
  | 'afterLeave'
  | 'error';

/**
 * 路由事件处理器
 */
export type RouterEventHandler = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) => void | Promise<void>;

/**
 * 路由缓存管理器接口
 */
export interface RouterCacheManager {
  add(name: string): void;
  remove(name: string): void;
  clear(): void;
  has(name: string): boolean;
  getList(): string[];
}

/**
 * 路由服务接口
 */
export interface RouterService {
  // 路由导航
  push(to: RouteLocationRaw): Promise<void>;
  replace(to: RouteLocationRaw): Promise<void>;
  back(): void;
  forward(): void;
  go(delta: number): void;

  // 路由管理
  addRoute(route: RouteRecordRaw): void;
  removeRoute(name: string): void;
  addRouteModule(module: RouterModule): void;
  hasRoute(name: string): boolean;
  getRoutes(): RouteRecordRaw[];

  // 路由状态
  getCurrentRoute(): RouteLocationNormalized;
  getHistory(): string[];

  // 路由守卫
  beforeEach(guard: NavigationGuard): void;
  afterEach(hook: NavigationHookAfter): void;

  // 事件管理
  on(event: RouterEventType, handler: RouterEventHandler): void;
  off(event: RouterEventType, handler: RouterEventHandler): void;

  // 缓存管理
  cache: RouterCacheManager;

  // 过渡动画
  setTransition(config: RouterConfig['transition']): void;

  // 多实例支持
  createInstance(name: string, config: RouterConfig): RouterService;
  switchInstance(name: string): void;
  getInstance(name: string): RouterService | undefined;

  // 进度条控制
  startProgress(): void;
  finishProgress(): void;

  // 工具方法
  resolve(to: RouteLocationRaw): RouteLocationNormalized;
}

/**
 * 路由组件接口
 */
export interface RouterComponent extends Component {
  name?: string;
  meta?: {
    title?: string;
    icon?: string;
    keepAlive?: boolean;
    requiresAuth?: boolean;
    permissions?: string[];
    roles?: string[];
    [key: string]: any;
  };
}
