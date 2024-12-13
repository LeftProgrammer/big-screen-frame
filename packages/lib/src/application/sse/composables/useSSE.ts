import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import { SSEServiceImpl } from '../services/sse.service';
import type { SSEConfig, SSEService, SSEEventType, SSEEventHandler } from '../types';

export function useSSE(config: SSEConfig) {
  const sse = ref<SSEService>(new SSEServiceImpl());
  const connected = ref(false);
  const connecting = ref(false);
  const error = ref<Error | null>(null);
  const data: Ref<any> = ref(null);

  // 连接状态处理
  const handleConnectionChange = () => {
    connected.value = sse.value.connected;
    connecting.value = sse.value.connecting;
  };

  // 错误处理
  const handleError = (event: Event) => {
    error.value = new Error('SSE error');
    handleConnectionChange();
  };

  // 消息处理
  const handleMessage = (event: MessageEvent) => {
    try {
      data.value = event.data;
    } catch (err) {
      error.value = err as Error;
    }
  };

  // 连接处理
  const connect = async () => {
    try {
      error.value = null;
      connecting.value = true;
      await sse.value.connect(config);
      connected.value = true;
    } catch (err) {
      error.value = err as Error;
      connected.value = false;
    } finally {
      connecting.value = false;
    }
  };

  // 断开连接
  const disconnect = () => {
    sse.value.disconnect();
    connected.value = false;
    connecting.value = false;
  };

  // 添加事件监听
  const on = (event: SSEEventType | string, handler: SSEEventHandler) => {
    sse.value.on(event, handler);
  };

  // 移除事件监听
  const off = (event: SSEEventType | string, handler: SSEEventHandler) => {
    sse.value.off(event, handler);
  };

  // 组件挂载时自动连接
  onMounted(() => {
    if (config) {
      connect();
    }
  });

  // 组件卸载时自动断开
  onUnmounted(() => {
    if (connected.value) {
      disconnect();
    }
  });

  return {
    sse,
    data,
    error,
    connected,
    connecting,
    connect,
    disconnect,
    on,
    off
  };
}
