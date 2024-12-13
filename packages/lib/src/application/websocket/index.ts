// WebSocket数据处理模块
export * from './types';
export * from './services/websocket.service';
export * from './middleware';
export * from './composables/useWebSocket';

// 导出工厂函数
import { WebSocketConfig } from './types';
import { WebSocketServiceImpl } from './services/websocket.service';

export const createWebSocketService = (config?: Partial<WebSocketConfig>) => {
  const service = new WebSocketServiceImpl();
  if (config) {
    service.connect(config);
  }
  return service;
};
