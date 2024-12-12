import { type App } from 'vue';
import { createPinia, type Pinia, type StateTree, type Store } from 'pinia';
import { type StoreManagerOptions, type StoreModule, type StoreRegister } from './types';
import { useThemeStore } from './modules/theme';
import { useLayoutStore } from './modules/layout';

/**
 * Store 管理器
 * 负责管理和注册 Pinia stores
 */
export class StoreManager implements StoreRegister {
  private static instance: StoreManager;
  private pinia: Pinia;
  private modules: Map<string, StoreModule>;
  private options: StoreManagerOptions;
  private initialized: boolean = false;

  private constructor(options: StoreManagerOptions = {}) {
    this.pinia = options.pinia || createPinia();
    this.modules = new Map();
    this.options = options;

    // 注册核心 store 模块
    this.registerCoreModules();
  }

  /**
   * 获取 StoreManager 实例
   */
  public static getInstance(options?: StoreManagerOptions): StoreManager {
    if (!StoreManager.instance) {
      StoreManager.instance = new StoreManager(options);
    }
    return StoreManager.instance;
  }

  /**
   * 注册核心 store 模块
   */
  private registerCoreModules(): void {
    this.use({
      id: 'bsf-theme',
      store: useThemeStore
    });
    this.use({
      id: 'bsf-layout',
      store: useLayoutStore
    });
  }

  /**
   * 注册到 Vue 应用
   * 框架内部使用，外部项目不需要调用
   */
  public register(app: App): void {
    if (!this.initialized) {
      app.use(this.pinia);
      this.initialized = true;
    }
  }

  /**
   * 使用 store 模块
   */
  public use(module: StoreModule): void {
    if (this.modules.has(module.id)) {
      console.warn(`Store module with id "${module.id}" is already registered.`);
      return;
    }
    this.modules.set(module.id, module);
  }

  /**
   * 获取指定 id 的 store 实例
   */
  public getStore<T extends StateTree = StateTree>(id: string): Store<string, T> | undefined {
    const module = this.modules.get(id);
    if (!module) {
      console.warn(`Store module with id "${id}" not found.`);
      return undefined;
    }
    return module.store() as Store<string, T>;
  }

  /**
   * 获取 Pinia 实例
   */
  public getPinia(): Pinia {
    return this.pinia;
  }

  /**
   * 重置所有 store
   */
  public reset(): void {
    this.modules.forEach(module => {
      const store = this.getStore(module.id);
      if (store && typeof store.$reset === 'function') {
        store.$reset();
      }
    });
  }
}
