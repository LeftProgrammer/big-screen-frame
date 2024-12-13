import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import type {
  Router,
  RouteRecordRaw,
  RouteLocationRaw,
  RouteLocationNormalized,
  NavigationGuard,
  NavigationHookAfter
} from 'vue-router';
import NProgress from 'nprogress';
import type {
  RouterService,
  RouterConfig,
  RouterModule,
  RouterEventType,
  RouterEventHandler,
  RouterCacheManager
} from '../types';
import { RouterMiddlewareManager } from '../middleware';
import { RouterPluginManager } from '../plugins';
import { RouteTemplateFactory } from '../templates';

/**
 * 路由缓存管理器实现
 */
class RouterCacheManagerImpl implements RouterCacheManager {
  private cachedViews: Set<string>;
  private config: RouterConfig['cache'];

  constructor(config?: RouterConfig['cache']) {
    this.cachedViews = new Set();
    this.config = config || {};
  }

  add(name: string): void {
    if (this.config.exclude?.includes(name)) return;
    if (this.config.max && this.cachedViews.size >= this.config.max) {
      const firstView = this.cachedViews.values().next().value;
      this.cachedViews.delete(firstView);
    }
    this.cachedViews.add(name);
  }

  remove(name: string): void {
    this.cachedViews.delete(name);
  }

  clear(): void {
    this.cachedViews.clear();
  }

  has(name: string): boolean {
    return this.cachedViews.has(name);
  }

  getList(): string[] {
    return Array.from(this.cachedViews);
  }
}

/**
 * 路由服务实现
 */
export class RouterServiceImpl implements RouterService {
  private router: Router;
  private config: RouterConfig;
  private static instances: Map<string, RouterServiceImpl> = new Map();
  private eventHandlers: Map<RouterEventType, Set<RouterEventHandler>>;
  private _cache: RouterCacheManagerImpl;
  private middlewareManager: RouterMiddlewareManager;
  private pluginManager: RouterPluginManager;

  private constructor(config: RouterConfig) {
    this.config = config;
    this.eventHandlers = new Map();
    this.middlewareManager = new RouterMiddlewareManager();

    // 创建路由实例
    this.router = createRouter({
      history:
        config.mode === 'hash' ? createWebHashHistory(config.base) : createWebHistory(config.base),
      routes: []
    });

    // 初始化缓存管理器
    this._cache = new RouterCacheManagerImpl(config.cache);

    // 初始化插件管理器
    this.pluginManager = new RouterPluginManager(this);

    // 初始化进度条
    if (config.progress) {
      NProgress.configure(config.progress);
    }

    // 添加默认路由
    if (config.defaultRoutes) {
      const defaultRoutes = RouteTemplateFactory.createBasicRoutes();
      defaultRoutes.forEach(route => this.addRoute(route));
    }

    // 设置全局前置守卫
    this.router.beforeEach(async (to, from, next) => {
      try {
        // 执行中间件链
        await this.middlewareManager.executeMiddlewares(to, from, next);
      } catch (error) {
        console.error('Router middleware error:', error);
        next(false);
      }
    });

    // 设置全局后置钩子
    this.router.afterEach(async (to, from) => {
      // 结束进度条
      this.finishProgress();

      // 缓存处理
      if (to.name && to.meta?.keepAlive) {
        this._cache.add(to.name as string);
      }

      // 触发afterEach事件
      await this.triggerEvent('afterEach', to, from);
    });
  }

  public static getInstance(config: RouterConfig): RouterService {
    if (!RouterServiceImpl.instances.has('default')) {
      RouterServiceImpl.instances.set('default', new RouterServiceImpl(config));
    }
    return RouterServiceImpl.instances.get('default')!;
  }

  // 中间件相关方法
  addMiddleware(middleware: any): void {
    this.middlewareManager.addMiddleware(middleware);
  }

  removeMiddleware(name: string): void {
    this.middlewareManager.removeMiddleware(name);
  }

  // 插件相关方法
  use(plugin: any, options?: any): void {
    this.pluginManager.use(plugin, options);
  }

  unuse(pluginName: string): void {
    this.pluginManager.unuse(pluginName);
  }

  // 模板相关方法
  addTemplateRoutes(type: 'basic' | 'screen', options?: any): void {
    const routes =
      type === 'basic'
        ? RouteTemplateFactory.createBasicRoutes(options)
        : RouteTemplateFactory.createScreenRoutes(options);

    routes.forEach(route => this.addRoute(route));
  }

  // 路由导航方法
  async push(to: RouteLocationRaw): Promise<void> {
    await this.router.push(to);
  }

  async replace(to: RouteLocationRaw): Promise<void> {
    await this.router.replace(to);
  }

  back(): void {
    this.router.back();
  }

  forward(): void {
    this.router.forward();
  }

  go(delta: number): void {
    this.router.go(delta);
  }

  // 路由管理方法
  addRoute(route: RouteRecordRaw): void {
    this.router.addRoute(route);
  }

  removeRoute(name: string): void {
    this.router.removeRoute(name);
  }

  addRouteModule(module: RouterModule): void {
    // 添加模块路由
    module.routes.forEach(route => this.addRoute(route));

    // 添加模块级导航守卫
    if (module.beforeEnter) {
      this.router.beforeEach(module.beforeEnter);
    }
    if (module.afterEnter) {
      this.router.afterEach(module.afterEnter);
    }
  }

  hasRoute(name: string): boolean {
    return this.router.hasRoute(name);
  }

  getRoutes(): RouteRecordRaw[] {
    return this.router.getRoutes();
  }

  // 路由状态方法
  getCurrentRoute(): RouteLocationNormalized {
    return this.router.currentRoute.value;
  }

  getHistory(): string[] {
    // 实现路由历史记录
    return [];
  }

  // 路由守卫方法
  beforeEach(guard: NavigationGuard): void {
    this.router.beforeEach(guard);
  }

  afterEach(hook: NavigationHookAfter): void {
    this.router.afterEach(hook);
  }

  // 事件管理方法
  on(event: RouterEventType, handler: RouterEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  off(event: RouterEventType, handler: RouterEventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private async triggerEvent(
    event: RouterEventType,
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): Promise<void> {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      for (const handler of handlers) {
        await handler(to, from);
      }
    }
  }

  // 缓存管理
  get cache(): RouterCacheManager {
    return this._cache;
  }

  // 过渡动画方法
  setTransition(config: RouterConfig['transition']): void {
    this.config.transition = config;
  }

  // 多实例支持方法
  createInstance(name: string, config: RouterConfig): RouterService {
    if (!RouterServiceImpl.instances.has(name)) {
      RouterServiceImpl.instances.set(name, new RouterServiceImpl(config));
    }
    return RouterServiceImpl.instances.get(name)!;
  }

  switchInstance(name: string): void {
    if (!RouterServiceImpl.instances.has(name)) {
      throw new Error(`Router instance "${name}" not found`);
    }
    // 实现实例切换逻辑
  }

  getInstance(name: string): RouterService | undefined {
    return RouterServiceImpl.instances.get(name);
  }

  // 进度条控制方法
  startProgress(): void {
    if (this.config.progress) {
      NProgress.start();
    }
  }

  finishProgress(): void {
    if (this.config.progress) {
      NProgress.done();
    }
  }

  // 工具方法
  resolve(to: RouteLocationRaw): RouteLocationNormalized {
    return this.router.resolve(to);
  }
}
