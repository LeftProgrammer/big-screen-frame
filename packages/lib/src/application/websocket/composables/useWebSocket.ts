import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import { WebSocketServiceImpl } from '../services/websocket.service';
import type { WebSocketConfig, WebSocketService } from '../types';

export function useWebSocket(config: WebSocketConfig) {
  const ws = ref<WebSocketService>(new WebSocketServiceImpl());
  const connected = ref(false);
  const connecting = ref(false);
  const error = ref<Error | null>(null);
  const data: Ref<any> = ref(null);
  let isDestroyed = false;

  // 连接状态处理
  const handleConnectionChange = () => {
    if (!isDestroyed) {
      connected.value = ws.value.connected;
      connecting.value = ws.value.connecting;
    }
  };

  // 错误处理
  const handleError = (event: Event) => {
    if (!isDestroyed) {
      error.value = new Error('WebSocket error');
      handleConnectionChange();
    }
  };

  // 消息处理
  const handleMessage = (event: MessageEvent) => {
    if (!isDestroyed) {
      try {
        data.value = event.data;
      } catch (err) {
        error.value = err as Error;
      }
    }
  };

  // 连接处理
  const connect = async () => {
    if (isDestroyed) return;

    try {
      error.value = null;
      connecting.value = true;
      await ws.value.connect(config);
      if (!isDestroyed) {
        connected.value = true;
      }
    } catch (err) {
      if (!isDestroyed) {
        error.value = err as Error;
        connected.value = false;
      }
    } finally {
      if (!isDestroyed) {
        connecting.value = false;
      }
    }
  };

  // 断开连接
  const disconnect = () => {
    if (!isDestroyed && ws.value) {
      ws.value.disconnect();
      connected.value = false;
      connecting.value = false;
    }
  };

  // 发送消息
  const send = (data: any) => {
    if (!isDestroyed && ws.value && connected.value) {
      ws.value.send(data);
    }
  };

  // 生命周期处理
  onMounted(() => {
    ws.value.on('open', handleConnectionChange);
    ws.value.on('close', handleConnectionChange);
    ws.value.on('error', handleError);
    ws.value.on('message', handleMessage);
    connect();
  });

  // 组件卸载时清理
  onUnmounted(() => {
    isDestroyed = true;
    try {
      if (ws.value) {
        disconnect();
      }
    } catch (error) {
      console.error('Error during WebSocket cleanup:', error);
    }
  });

  return {
    ws,
    data,
    error,
    isConnected: connected,
    isConnecting: connecting,
    connect,
    disconnect,
    send
  };
}
