/**
 * SSE配置选项
 */
export interface SSEConfig {
  /**
   * SSE服务器URL
   */
  url: string;

  /**
   * 重连配置
   */
  reconnect?: {
    /**
     * 是否启用自动重连
     */
    enabled?: boolean;
    /**
     * 最大重试次数
     */
    maxAttempts?: number;
    /**
     * 重试延迟(毫秒)
     */
    delay?: number;
  };

  /**
   * 心跳配置
   */
  heartbeat?: {
    /**
     * 是否启用心跳
     */
    enabled?: boolean;
    /**
     * 心跳间隔(毫秒)
     */
    interval?: number;
  };

  /**
   * 事件处理配置
   */
  events?: {
    /**
     * 事件名称列表
     */
    names?: string[];
    /**
     * 是否启用默认消息处理
     */
    enableDefaultHandler?: boolean;
  };

  /**
   * 请求配置
   */
  request?: {
    /**
     * 请求头
     */
    headers?: Record<string, string>;
    /**
     * 凭证模式
     */
    withCredentials?: boolean;
  };
}

/**
 * SSE事件类型
 */
export type SSEEventType = 'open' | 'message' | 'error' | 'close';

/**
 * SSE事件处理器
 */
export type SSEEventHandler = (event: Event | MessageEvent) => void | Promise<void>;

/**
 * SSE中间件接口
 */
export interface SSEMiddleware {
  /**
   * 中间件名称
   */
  name: string;

  /**
   * 连接前处理
   */
  beforeConnect?: (config: SSEConfig) => Promise<SSEConfig>;

  /**
   * 连接后处理
   */
  afterConnect?: () => Promise<void>;

  /**
   * 消息处理
   */
  beforeMessage?: (data: any) => Promise<any>;

  /**
   * 错误处理
   */
  onError?: (error: Error) => Promise<void>;

  /**
   * 关闭处理
   */
  onClose?: () => Promise<void>;
}

/**
 * SSE服务接口
 */
export interface SSEService {
  /**
   * 是否已连接
   */
  readonly connected: boolean;

  /**
   * 是否正在连接
   */
  readonly connecting: boolean;

  /**
   * 连接SSE服务器
   */
  connect(config?: Partial<SSEConfig>): Promise<void>;

  /**
   * 断开连接
   */
  disconnect(): void;

  /**
   * 添加中间件
   */
  addMiddleware(middleware: SSEMiddleware): void;

  /**
   * 移除中间件
   */
  removeMiddleware(name: string): void;

  /**
   * 添加事件监听器
   */
  on(event: SSEEventType | string, handler: SSEEventHandler): void;

  /**
   * 移除事件监听器
   */
  off(event: SSEEventType | string, handler: SSEEventHandler): void;

  /**
   * 发送心跳
   */
  sendHeartbeat?(): void;
}
