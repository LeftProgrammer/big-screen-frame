import { type App } from 'vue';
import { StoreManager } from './store-manager';

export function installStore(app: App): void {
  // 获取 StoreManager 实例并注册
  const storeManager = StoreManager.getInstance();
  storeManager.register(app);
}
