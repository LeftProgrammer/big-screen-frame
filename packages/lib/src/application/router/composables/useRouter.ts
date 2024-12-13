import { inject } from 'vue';
import type { InjectionKey } from 'vue';
import type { RouterService, RouterConfig } from '../types';
import { RouterServiceImpl } from '../services/router.service';

// 创建注入键
export const RouterSymbol: InjectionKey<RouterService> = Symbol('router');

/**
 * 路由服务组合式函数
 * @param config 路由配置
 * @returns 路由服务实例
 */
export function useRouter(config?: RouterConfig): RouterService {
  // 尝试获取已注入的路由服务
  const existingRouter = inject(RouterSymbol);
  if (existingRouter) {
    return existingRouter;
  }

  // 如果没有注入且提供了配置，创建新实例
  if (config) {
    return RouterServiceImpl.getInstance(config);
  }

  // 如果既没有注入也没有配置，抛出错误
  throw new Error('Router service not provided and no config supplied');
}
