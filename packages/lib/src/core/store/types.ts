import type { App } from 'vue';
import type { Pinia, StateTree, Store, StoreDefinition } from 'pinia';

// Store 模块配置接口
export interface StoreModule {
  id: string;
  store: StoreDefinition;
}

// Store 配置选项
export interface StoreOptions {
  // 持久化配置
  persist?: {
    enabled?: boolean;
    strategies?: PersistStrategy[];
  };
}

// 持久化策略
export interface PersistStrategy {
  key?: string;
  storage?: Storage;
  paths?: string[];
}

// Store 管理器配置
export interface StoreManagerOptions {
  // 自定义 pinia 实例
  pinia?: Pinia;
  // 默认配置
  defaultOptions?: StoreOptions;
}

// Store 注册器接口
export interface StoreRegister {
  register(app: App): void;
  use(module: StoreModule): void;
  getStore<T extends StateTree = StateTree>(id: string): Store<string, T> | undefined;
}
