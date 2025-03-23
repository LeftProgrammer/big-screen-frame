// 导出类型定义
export * from './types';
// 导出 store 管理器
export * from './store-manager';
// 导出插件安装函数
export * from './plugin';
// 导出核心 store 模块
import { createPinia } from 'pinia';
import type { App } from 'vue';
import { useThemeStore } from './modules/theme';
import { useLayoutStore } from './modules/layout';
import { useAuthStore } from './modules/auth';

// 创建 pinia 实例，但不要立即使用它
let pinia: ReturnType<typeof createPinia> | null = null;

// 获取pinia实例的函数，确保只在需要时创建
export function getPinia() {
  if (!pinia) {
    pinia = createPinia();
  }
  return pinia;
}

// 注册 store
export function setupStore(app: App) {
  const piniaInstance = getPinia();
  app.use(piniaInstance);
}

// 导出 store 模块
export { useThemeStore, useLayoutStore, useAuthStore };

// 导出组合式函数
export function useStore() {
  return {
    theme: useThemeStore(),
    layout: useLayoutStore(),
    auth: useAuthStore()
  };
}
