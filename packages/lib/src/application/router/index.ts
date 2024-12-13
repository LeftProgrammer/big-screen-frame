// 路由处理模块
import type { RouterService } from './types';
export * from './types';
export * from './composables/useRouter';
export * from './middleware';
export * from './plugins';
export * from './templates';
export { RouterServiceImpl as RouterService } from './services/router.service';

export class RouterServiceImpl implements RouterService {
  constructor() {}
}

export interface RouterConfig {
  // 待定义
}
