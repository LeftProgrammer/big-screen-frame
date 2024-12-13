// 路由处理模块
import type { RouterService } from './types';
export * from './types';
export * from './composables/useRouter';
export * from './middleware';
export * from './plugins';
export * from './templates';
export { RouterServiceImpl as RouterService, createRouterService } from './services/router.service';
