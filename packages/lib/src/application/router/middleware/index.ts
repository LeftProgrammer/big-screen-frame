import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import type { RouterService } from '../types';

/**
 * 路由中间件接口
 */
export interface RouterMiddleware {
  name: string;
  order?: number;
  handler: (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
    routerService: RouterService
  ) => Promise<void> | void;
}

/**
 * 路由中间件管理器
 */
export class RouterMiddlewareManager {
  private middlewares: RouterMiddleware[] = [];

  /**
   * 添加中间件
   */
  addMiddleware(middleware: RouterMiddleware): void {
    this.middlewares.push(middleware);
    // 按order排序
    this.middlewares.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * 移除中间件
   */
  removeMiddleware(name: string): void {
    const index = this.middlewares.findIndex(m => m.name === name);
    if (index !== -1) {
      this.middlewares.splice(index, 1);
    }
  }

  /**
   * 执行中间件链
   */
  async executeMiddlewares(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
    routerService: RouterService
  ): Promise<void> {
    let index = 0;

    const runMiddleware = async () => {
      if (index >= this.middlewares.length) {
        next();
        return;
      }

      const middleware = this.middlewares[index++];
      try {
        await middleware.handler(
          to,
          from,
          async () => {
            await runMiddleware();
          },
          routerService
        );
      } catch (error) {
        console.error(`Middleware ${middleware.name} error:`, error);
        next(false);
      }
    };

    await runMiddleware();
  }
}

/**
 * 常用中间件
 */
export const commonMiddlewares = {
  /**
   * 权限验证中间件
   */
  auth: (authService: any): RouterMiddleware => ({
    name: 'auth',
    order: 1,
    handler: async (to, from, next, routerService) => {
      if (to.meta.requiresAuth && !authService.isAuthenticated) {
        next({ name: 'Login', query: { redirect: to.fullPath } });
      } else {
        next();
      }
    }
  }),

  /**
   * 进度条中间件
   */
  progress: (nprogress: any): RouterMiddleware => ({
    name: 'progress',
    order: 0,
    handler: (to, from, next, routerService) => {
      nprogress.start();
      next();
    }
  }),

  /**
   * 标题更新中间件
   */
  title: (): RouterMiddleware => ({
    name: 'title',
    order: 2,
    handler: (to, from, next, routerService) => {
      if (to.meta.title) {
        document.title = to.meta.title as string;
      }
      next();
    }
  }),

  /**
   * 数据清理中间件
   */
  cleanup: (stores: any[]): RouterMiddleware => ({
    name: 'cleanup',
    order: 3,
    handler: (to, from, next, routerService) => {
      stores.forEach(store => store.$reset?.());
      next();
    }
  })
};
