// websocket.ts
import { ref } from 'vue';

export interface WebSocketOptions {
  url: string;
  protocols?: string | string[];
  autoReconnect?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  heartbeatInterval?: number;
  heartbeatMessage?: string | object;
  onMessage?: (event: MessageEvent) => void;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private retryCount = 0;
  private heartbeatTimer: number | null = null;
  private reconnectTimer: number | null = null;
  private options: Required<WebSocketOptions>;

  // 响应式状态
  public isConnected = ref(false);
  public isReconnecting = ref(false);

  constructor(options: WebSocketOptions) {
    this.options = {
      autoReconnect: true,
      maxRetries: 3,
      retryDelay: 3000,
      heartbeatInterval: 30000,
      heartbeatMessage: 'ping',
      protocols: [],
      onMessage: () => {},
      onOpen: () => {},
      onClose: () => {},
      onError: () => {},
      ...options,
    };
  }

  public connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket(this.options.url, this.options.protocols);

    this.ws.onopen = (event: Event) => {
      this.isConnected.value = true;
      this.retryCount = 0;
      this.startHeartbeat();
      this.options.onOpen(event);
    };

    this.ws.onmessage = (event: MessageEvent) => {
      this.options.onMessage(event);
    };

    this.ws.onclose = (event: CloseEvent) => {
      this.isConnected.value = false;
      this.stopHeartbeat();
      this.options.onClose(event);
      
      if (this.options.autoReconnect && this.retryCount < this.options.maxRetries) {
        this.reconnect();
      }
    };

    this.ws.onerror = (event: Event) => {
      this.options.onError(event);
    };
  }

  private reconnect(): void {
    if (this.reconnectTimer) {
      return;
    }

    this.isReconnecting.value = true;
    this.retryCount++;

    this.reconnectTimer = window.setTimeout(() => {
      this.connect();
      this.reconnectTimer = null;
      this.isReconnecting.value = false;
    }, this.options.retryDelay);
  }

  private startHeartbeat(): void {
    if (this.heartbeatTimer) {
      return;
    }

    this.heartbeatTimer = window.setInterval(() => {
      this.send(this.options.heartbeatMessage);
    }, this.options.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  public send(data: string | object): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    const message = typeof data === 'string' ? data : JSON.stringify(data);
    this.ws.send(message);
  }

  public disconnect(): void {
    this.options.autoReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Composition API hook
export function useWebSocket(options: WebSocketOptions) {
  const wsClient = new WebSocketClient(options);

  return {
    connect: () => wsClient.connect(),
    disconnect: () => wsClient.disconnect(),
    send: (data: string | object) => wsClient.send(data),
    isConnected: wsClient.isConnected,
    isReconnecting: wsClient.isReconnecting,
  };
}
