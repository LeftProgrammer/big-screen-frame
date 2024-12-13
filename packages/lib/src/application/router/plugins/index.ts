import type { RouterService } from '../types';

/**
 * 路由插件接口
 */
export interface RouterPlugin {
  name: string;
  install: (router: RouterService, options?: any) => void;
  uninstall?: (router: RouterService) => void;
}

/**
 * 路由插件管理器
 */
export class RouterPluginManager {
  private plugins: Map<string, RouterPlugin> = new Map();
  private router: RouterService;

  constructor(router: RouterService) {
    this.router = router;
  }

  /**
   * 安装插件
   */
  use(plugin: RouterPlugin, options?: any): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} has already been installed`);
      return;
    }

    plugin.install(this.router, options);
    this.plugins.set(plugin.name, plugin);
  }

  /**
   * 卸载插件
   */
  unuse(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);
    if (plugin?.uninstall) {
      plugin.uninstall(this.router);
    }
    this.plugins.delete(pluginName);
  }

  /**
   * 获取已安装的插件
   */
  getPlugin(name: string): RouterPlugin | undefined {
    return this.plugins.get(name);
  }
}

/**
 * 常用插件
 */
export const commonPlugins = {
  /**
   * 页面切换动画插件
   */
  transition: (): RouterPlugin => ({
    name: 'transition',
    install: (router, options = { name: 'fade', mode: 'out-in' }) => {
      router.setTransition(options);
    }
  }),

  /**
   * 页面加载进度条插件
   */
  progress: (): RouterPlugin => ({
    name: 'progress',
    install: (router, options = { color: '#1890ff' }) => {
      router.on('beforeEach', () => router.startProgress());
      router.on('afterEach', () => router.finishProgress());
    }
  }),

  /**
   * 路由分析插件
   */
  analytics: (): RouterPlugin => ({
    name: 'analytics',
    install: (router, options = {}) => {
      router.on('afterEach', to => {
        // 实现路由分析逻辑
        console.log('Route changed to:', to.fullPath);
      });
    }
  }),

  /**
   * 路由缓存优化插件
   */
  cacheOptimize: (): RouterPlugin => ({
    name: 'cacheOptimize',
    install: (router, options = { maxCache: 10 }) => {
      router.on('beforeEach', to => {
        if (to.meta.keepAlive) {
          const cacheList = router.cache.getList();
          if (cacheList.length >= options.maxCache) {
            router.cache.remove(cacheList[0]);
          }
        }
      });
    }
  })
};
