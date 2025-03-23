export * from './types';
export * from './http-client';
export * from './cancel-manager';
export * from './interceptors';
export * from './retry-strategy';
export * from './polling-manager';

import { HttpClient } from './http-client';
import { defaultRequestInterceptor, defaultResponseInterceptor } from './interceptors';
import type { HttpClientConfig } from './types';

// 创建默认配置
const defaultConfig: HttpClientConfig = {
  timeout: 10000,
  autoCancel: true,
  // 默认重试配置
  retry: {
    count: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    useExponentialBackoff: true
  },
  // 默认拦截器
  interceptors: [defaultRequestInterceptor, defaultResponseInterceptor]
};

// 创建默认实例
export const http = HttpClient.getInstance(defaultConfig);

// 创建自定义实例
export function createHttp(config: HttpClientConfig) {
  return HttpClient.getInstance({
    ...defaultConfig,
    ...config,
    // 合并拦截器
    interceptors: [...(defaultConfig.interceptors || []), ...(config.interceptors || [])],
    // 合并重试配置
    retry: {
      ...defaultConfig.retry,
      ...config.retry
    }
  });
}

export type { HttpClientConfig } from './types';
