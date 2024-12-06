// sse.ts
import { ref } from 'vue';

export interface SSEOptions {
  url: string;
  withCredentials?: boolean;
  autoReconnect?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  events?: string[];
  onMessage?: (event: MessageEvent) => void;
  onOpen?: (event: Event) => void;
  onError?: (event: Event) => void;
}

export class SSEClient {
  private eventSource: EventSource | null = null;
  private retryCount = 0;
  private reconnectTimer: number | null = null;
  private options: Required<SSEOptions>;

  // 响应式状态
  public isConnected = ref(false);
  public isReconnecting = ref(false);

  constructor(options: SSEOptions) {
    this.options = {
      withCredentials: false,
      autoReconnect: true,
      maxRetries: 3,
      retryDelay: 3000,
      events: ['message'],
      onMessage: () => {},
      onOpen: () => {},
      onError: () => {},
      ...options,
    };
  }

  public connect(): void {
    if (this.eventSource) {
      return;
    }

    this.eventSource = new EventSource(this.options.url, {
      withCredentials: this.options.withCredentials,
    });

    this.eventSource.onopen = (event: Event) => {
      this.isConnected.value = true;
      this.retryCount = 0;
      this.options.onOpen(event);
    };

    // 注册事件监听器
    this.options.events.forEach(eventName => {
      this.eventSource?.addEventListener(eventName, (event: MessageEvent) => {
        this.options.onMessage(event);
      });
    });

    this.eventSource.onerror = (event: Event) => {
      this.isConnected.value = false;
      this.options.onError(event);

      if (this.options.autoReconnect && this.retryCount < this.options.maxRetries) {
        this.reconnect();
      } else {
        this.disconnect();
      }
    };
  }

  private reconnect(): void {
    if (this.reconnectTimer) {
      return;
    }

    this.isReconnecting.value = true;
    this.retryCount++;

    this.reconnectTimer = window.setTimeout(() => {
      this.disconnect();
      this.connect();
      this.reconnectTimer = null;
      this.isReconnecting.value = false;
    }, this.options.retryDelay);
  }

  public disconnect(): void {
    this.options.autoReconnect = false;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.isConnected.value = false;
  }
}

// Composition API hook
export function useSSE(options: SSEOptions) {
  const sseClient = new SSEClient(options);

  return {
    connect: () => sseClient.connect(),
    disconnect: () => sseClient.disconnect(),
    isConnected: sseClient.isConnected,
    isReconnecting: sseClient.isReconnecting,
  };
}
