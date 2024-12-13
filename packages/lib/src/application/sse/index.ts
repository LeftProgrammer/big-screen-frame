// SSE数据处理模块
import type { SSEConfig, SSEService } from './types';
import { SSEServiceImpl } from './services/sse.service';

export * from './types';
export * from './services/sse.service';
export * from './middleware';
export * from './composables/useSSE';

/**
 * 创建SSE服务实例
 */
export function createSSEService(config?: Partial<SSEConfig>): SSEService {
  const service = new SSEServiceImpl();
  if (config) {
    service.connect(config);
  }
  return service;
}
