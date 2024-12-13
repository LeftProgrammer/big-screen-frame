import type { SSEConfig, SSEService, SSEMiddleware, SSEEventType, SSEEventHandler } from '../types';

/**
 * SSE服务实现
 */
export class SSEServiceImpl implements SSEService {
  private eventSource: EventSource | null = null;
  private config: SSEConfig | null = null;
  private middlewares: SSEMiddleware[] = [];
  private eventHandlers: Map<string, Set<SSEEventHandler>> = new Map();
  private reconnectAttempts = 0;
  private heartbeatTimer: number | null = null;

  // 连接状态
  public get connected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  public get connecting(): boolean {
    return this.eventSource?.readyState === EventSource.CONNECTING;
  }

  /**
   * 连接到SSE服务器
   */
  public async connect(config?: Partial<SSEConfig>): Promise<void> {
    // 如果已经连接，先断开
    if (this.eventSource) {
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
        interval: 30000,
        ...config?.heartbeat
      },
      events: {
        names: [],
        enableDefaultHandler: true,
        ...config?.events
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
        // 创建EventSource实例
        this.eventSource = new EventSource(this.config!.url, {
          withCredentials: this.config?.request?.withCredentials
        });

        // 设置事件处理器
        this.eventSource.onopen = async event => {
          // 重置重连次数
          this.reconnectAttempts = 0;

          // 执行中间件
          for (const middleware of this.middlewares) {
            if (middleware.afterConnect) {
              await middleware.afterConnect();
            }
          }

          // 启动心跳
          if (this.config?.heartbeat?.enabled) {
            this.startHeartbeat();
          }

          // 触发事件处理器
          this.emit('open', event);

          resolve();
        };

        this.eventSource.onerror = async event => {
          const error = new Error('SSE error');

          // 执行中间件
          for (const middleware of this.middlewares) {
            if (middleware.onError) {
              await middleware.onError(error);
            }
          }

          // 触发事件处理器
          this.emit('error', event);

          // 处理重连
          if (this.config?.reconnect?.enabled && this.shouldReconnect()) {
            this.reconnectAttempts++;
            setTimeout(() => {
              this.connect(this.config!);
            }, this.config.reconnect.delay);
          } else {
            reject(error);
          }
        };

        // 注册事件监听器
        if (this.config?.events?.names?.length) {
          for (const eventName of this.config.events.names) {
            this.eventSource.addEventListener(eventName, async event => {
              let data = (event as MessageEvent).data;

              // 执行中间件
              for (const middleware of this.middlewares) {
                if (middleware.beforeMessage) {
                  data = await middleware.beforeMessage(data);
                }
              }

              // 触发事件处理器
              this.emit(eventName, event);
            });
          }
        }

        // 默认消息处理
        if (this.config?.events?.enableDefaultHandler) {
          this.eventSource.onmessage = async event => {
            let data = event.data;

            // 执行中间件
            for (const middleware of this.middlewares) {
              if (middleware.beforeMessage) {
                data = await middleware.beforeMessage(data);
              }
            }

            // 触发事件处理器
            this.emit('message', event);
          };
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 断开连接
   */
  public disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    // 停止心跳
    if (this.heartbeatTimer) {
      window.clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    // 执行中间件
    for (const middleware of this.middlewares) {
      if (middleware.onClose) {
        middleware.onClose();
      }
    }

    // 触发事件处理器
    this.emit('close', new Event('close'));
  }

  /**
   * 添加中间件
   */
  public addMiddleware(middleware: SSEMiddleware): void {
    this.middlewares.push(middleware);
  }

  /**
   * 移除中间件
   */
  public removeMiddleware(name: string): void {
    const index = this.middlewares.findIndex(m => m.name === name);
    if (index !== -1) {
      this.middlewares.splice(index, 1);
    }
  }

  /**
   * 添加事件监听器
   */
  public on(event: SSEEventType | string, handler: SSEEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  /**
   * 移除事件监听器
   */
  public off(event: SSEEventType | string, handler: SSEEventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(event);
      }
    }
  }

  /**
   * 触发事件处理器
   */
  private emit(event: SSEEventType | string, data: Event | MessageEvent): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      for (const handler of handlers) {
        handler(data);
      }
    }
  }

  /**
   * 判断是否应该重连
   */
  private shouldReconnect(): boolean {
    return (
      this.config?.reconnect?.enabled &&
      this.reconnectAttempts < (this.config?.reconnect?.maxAttempts || 0)
    );
  }

  /**
   * 启动心跳
   */
  private startHeartbeat(): void {
    if (this.heartbeatTimer) {
      window.clearInterval(this.heartbeatTimer);
    }

    this.heartbeatTimer = window.setInterval(() => {
      if (this.connected) {
        this.emit('heartbeat', new Event('heartbeat'));
      }
    }, this.config?.heartbeat?.interval || 30000);
  }
}
