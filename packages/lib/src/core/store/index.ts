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

// 创建 pinia 实例
const pinia = createPinia();

// 注册 store
export function setupStore(app: App) {
  app.use(pinia);
}

// 导出 store 模块
export { useThemeStore, useLayoutStore };

// 导出 store 实例
export default pinia;

// 导出组合式函数
export function useStore() {
  return {
    theme: useThemeStore(),
    layout: useLayoutStore()
  };
}
