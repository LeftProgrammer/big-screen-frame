import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import type {
  Router,
  RouteRecordRaw,
  RouteLocationRaw,
  RouteLocationNormalized,
  NavigationGuard,
  NavigationHookAfter
} from 'vue-router';
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
    if (!this.cachedViews.has(name)) {
      this.cachedViews.add(name);
    }
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
      // 缓存处理
      if (to.name && to.meta?.keepAlive) {
        this._cache.add(to.name as string);
      }

      // 触发afterEach事件
      await this.triggerEvent('afterEach', to, from);
    });
  }

  /**
   * 获取路由服务实例
   */
  static getInstance(config: RouterConfig): RouterService {
    const key = config.name || 'default';
    if (!RouterServiceImpl.instances.has(key)) {
      RouterServiceImpl.instances.set(key, new RouterServiceImpl(config));
    }
    return RouterServiceImpl.instances.get(key)!;
  }

  // 中间件相关方法
  addMiddleware(middleware: any): void {
    this.middlewareManager.add(middleware);
  }

  removeMiddleware(name: string): void {
    this.middlewareManager.remove(name);
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
    let routes: RouteRecordRaw[] = [];
    switch (type) {
      case 'basic':
        routes = RouteTemplateFactory.createBasicRoutes(options);
        break;
      case 'screen':
        routes = RouteTemplateFactory.createScreenRoutes(options);
        break;
    }
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
    module.routes.forEach(route => this.addRoute(route));
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
    // TODO: 实现历史记录
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
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event)!.delete(handler);
    }
  }

  async triggerEvent(
    event: RouterEventType,
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): Promise<void> {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event)!;
      for (const handler of handlers) {
        await handler(to, from);
      }
    }
  }

  // 缓存管理
  cache(): RouterCacheManager {
    return this._cache;
  }

  // 过渡动画方法
  setTransition(config: RouterConfig['transition']): void {
    this.config.transition = config;
  }

  // 多实例支持方法
  createInstance(name: string, config: RouterConfig): RouterService {
    if (RouterServiceImpl.instances.has(name)) {
      throw new Error(`Router instance "${name}" already exists`);
    }
    const instance = new RouterServiceImpl({ ...config, name });
    RouterServiceImpl.instances.set(name, instance);
    return instance;
  }

  switchInstance(name: string): void {
    if (!RouterServiceImpl.instances.has(name)) {
      throw new Error(`Router instance "${name}" not found`);
    }
    // TODO: 实现实例切换
  }

  getInstance(name: string): RouterService | undefined {
    return RouterServiceImpl.instances.get(name);
  }

  // 工具方法
  resolve(to: RouteLocationRaw): RouteLocationNormalized {
    return this.router.resolve(to);
  }
}

// 导出默认实例创建方法
export function createRouterService(config: RouterConfig): RouterService {
  return RouterServiceImpl.getInstance(config);
}
