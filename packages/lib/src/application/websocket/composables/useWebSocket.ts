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

  // 连接状态处理
  const handleConnectionChange = () => {
    connected.value = ws.value.connected;
    connecting.value = ws.value.connecting;
  };

  // 错误处理
  const handleError = (event: Event) => {
    error.value = new Error('WebSocket error');
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
      await ws.value.connect(config);
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
    ws.value.disconnect();
    connected.value = false;
    connecting.value = false;
  };

  // 重新连接
  const reconnect = async () => {
    await ws.value.reconnect();
  };

  // 发送消息
  const send = (message: any) => {
    if (!connected.value) {
      throw new Error('WebSocket is not connected');
    }
    ws.value.send(message);
  };

  // 发送 JSON 消息
  const sendJson = (data: object) => {
    if (!connected.value) {
      throw new Error('WebSocket is not connected');
    }
    ws.value.sendJson(data);
  };

  // 生命周期处理
  onMounted(() => {
    ws.value.on('open', handleConnectionChange);
    ws.value.on('close', handleConnectionChange);
    ws.value.on('error', handleError);
    ws.value.on('message', handleMessage);
    connect();
  });

  onUnmounted(() => {
    ws.value.off('open', handleConnectionChange);
    ws.value.off('close', handleConnectionChange);
    ws.value.off('error', handleError);
    ws.value.off('message', handleMessage);
    disconnect();
  });

  return {
    ws,
    connected,
    connecting,
    error,
    data,
    connect,
    disconnect,
    reconnect,
    send,
    sendJson
  };
}
