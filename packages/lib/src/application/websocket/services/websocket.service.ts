import type {
  WebSocketConfig,
  WebSocketService,
  WebSocketMiddleware,
  WebSocketEventType,
  WebSocketEventHandler
} from '../types';

/**
 * WebSocket 服务实现
 */
export class WebSocketServiceImpl implements WebSocketService {
  private socket: WebSocket | null = null;
  private config: WebSocketConfig | null = null;
  private middlewares: WebSocketMiddleware[] = [];
  private eventHandlers: Map<string, Set<WebSocketEventHandler>> = new Map();
  private reconnectAttempts = 0;
  private heartbeatTimer: number | null = null;
  private heartbeatTimeoutTimer: number | null = null;

  // 连接状态
  public get connected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  public get connecting(): boolean {
    return this.socket?.readyState === WebSocket.CONNECTING;
  }

  /**
   * 连接到 WebSocket 服务器
   */
  public async connect(config?: Partial<WebSocketConfig>): Promise<void> {
    // 如果已经连接，先断开
    if (this.socket) {
      this.disconnect();
    }

    // 合并配置
    this.config = {
      ...this.config,
      ...config,
      reconnect: {
        enabled: true,
        maxAttempts: 5,
        delay: 3000,
        ...config?.reconnect
      },
      heartbeat: {
        enabled: true,
        message: 'ping',
        interval: 30000,
        timeout: 3000,
        ...config?.heartbeat
      },
      message: {
        format: 'json',
        ...config?.message
      }
    };

    // 执行中间件
    for (const middleware of this.middlewares) {
      if (middleware.beforeConnect) {
        this.config = await middleware.beforeConnect(this.config);
      }
    }

    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.config!.url, this.config!.protocols);

        // 设置事件处理器
        this.socket.onopen = async event => {
          // 重置重连次数
          this.reconnectAttempts = 0;

          // 执行中间件
          for (const middleware of this.middlewares) {
            if (middleware.afterConnect) {
              await middleware.afterConnect(this.socket!);
            }
          }

          // 触发事件
          this.triggerEvent('open', event);
          this.config?.onOpen?.(event);

          // 启动心跳
          if (this.config?.heartbeat?.enabled) {
            this.startHeartbeat();
          }

          resolve();
        };

        this.socket.onclose = async event => {
          // 执行中间件
          for (const middleware of this.middlewares) {
            if (middleware.onClose) {
              await middleware.onClose(event);
            }
          }

          // 触发事件
          this.triggerEvent('close', event);
          this.config?.onClose?.(event);

          // 尝试重连
          if (this.config?.reconnect?.enabled) {
            this.tryReconnect();
          }
        };

        this.socket.onerror = async event => {
          const error = new Error('WebSocket error');

          // 执行中间件
          for (const middleware of this.middlewares) {
            if (middleware.onError) {
              await middleware.onError(error);
            }
          }

          // 触发事件
          this.triggerEvent('error', event);
          this.config?.onError?.(event);

          reject(error);
        };

        this.socket.onmessage = async event => {
          let data = event.data;

          // 解析消息
          if (this.config?.message?.format === 'json') {
            try {
              data = JSON.parse(data);
            } catch (error) {
              console.error('Failed to parse WebSocket message:', error);
            }
          }

          if (this.config?.message?.parser) {
            data = this.config.message.parser(data);
          }

          // 执行中间件
          for (const middleware of this.middlewares) {
            if (middleware.beforeMessage) {
              data = await middleware.beforeMessage(data);
            }
          }

          // 触发事件
          this.triggerEvent('message', { ...event, data });
          this.config?.onMessage?.(event);

          // 执行中间件
          for (const middleware of this.middlewares) {
            if (middleware.afterMessage) {
              await middleware.afterMessage(data);
            }
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 断开连接
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    // 停止心跳
    this.stopHeartbeat();
  }

  /**
   * 重新连接
   */
  public async reconnect(): Promise<void> {
    this.disconnect();
    await this.connect(this.config || undefined);
  }

  /**
   * 发送消息
   */
  public send(data: any): void {
    if (!this.connected) {
      throw new Error('WebSocket is not connected');
    }

    if (typeof data === 'object' && this.config?.message?.format === 'json') {
      this.sendJson(data);
    } else {
      this.socket!.send(data);
    }
  }

  /**
   * 发送 JSON 消息
   */
  public sendJson(data: object): void {
    if (!this.connected) {
      throw new Error('WebSocket is not connected');
    }

    const message = this.config?.message?.serializer
      ? this.config.message.serializer(data)
      : JSON.stringify(data);

    this.socket!.send(message);
  }

  /**
   * 添加事件监听器
   */
  public on(event: string, handler: WebSocketEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  /**
   * 移除事件监听器
   */
  public off(event: string, handler: WebSocketEventHandler): void {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event)!.delete(handler);
    }
  }

  /**
   * 添加一次性事件监听器
   */
  public once(event: string, handler: WebSocketEventHandler): void {
    const onceHandler = (event: Event | MessageEvent | CloseEvent) => {
      handler(event);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  /**
   * 添加中间件
   */
  public use(middleware: WebSocketMiddleware): void {
    this.middlewares.push(middleware);
  }

  /**
   * 移除中间件
   */
  public eject(middleware: WebSocketMiddleware): void {
    const index = this.middlewares.indexOf(middleware);
    if (index !== -1) {
      this.middlewares.splice(index, 1);
    }
  }

  /**
   * 启动心跳
   */
  public startHeartbeat(): void {
    if (!this.config?.heartbeat?.enabled) {
      return;
    }

    this.stopHeartbeat();

    const sendHeartbeat = () => {
      if (this.connected) {
        this.send(this.config!.heartbeat!.message!);
        this.triggerEvent('heartbeat', new Event('heartbeat'));

        // 设置超时定时器
        this.heartbeatTimeoutTimer = window.setTimeout(() => {
          console.warn('Heartbeat timeout, reconnecting...');
          this.reconnect();
        }, this.config!.heartbeat!.timeout);
      }
    };

    // 启动心跳定时器
    this.heartbeatTimer = window.setInterval(sendHeartbeat, this.config.heartbeat.interval);

    // 立即发送一次心跳
    sendHeartbeat();
  }

  /**
   * 停止心跳
   */
  public stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  /**
   * 触发事件
   */
  private triggerEvent(event: WebSocketEventType, payload: any): void {
    if (this.eventHandlers.has(event)) {
      for (const handler of this.eventHandlers.get(event)!) {
        handler(payload);
      }
    }
  }

  /**
   * 尝试重连
   */
  private async tryReconnect(): Promise<void> {
    const { maxAttempts = 5, delay = 3000 } = this.config!.reconnect!;

    if (this.reconnectAttempts >= maxAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting... Attempt ${this.reconnectAttempts} of ${maxAttempts}`);

    // 触发重连事件
    this.triggerEvent('reconnect', new Event('reconnect'));

    // 延迟重连
    await new Promise(resolve => setTimeout(resolve, delay));
    await this.reconnect();
  }
}
