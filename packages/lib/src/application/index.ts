export * from './pinia';
export * from './auth';
export * from './router';
export * from './websocket';
export * from './sse';
export * from './monitoring';
export * from './error-handler';

import type { App } from 'vue';

export const setupApplication = (app: App) => {
  // 初始化应用层功能
};
