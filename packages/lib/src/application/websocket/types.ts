// WebSocket数据处理模块类型定义
/**
 * WebSocket 配置接口
 */
export interface WebSocketConfig {
  // 基础配置
  url: string;
  protocols?: string | string[];

  // 重连配置
  reconnect?: {
    enabled: boolean;
    maxAttempts?: number;
    delay?: number;
  };

  // 心跳配置
  heartbeat?: {
    enabled: boolean;
    message?: string | object;
    interval?: number;
    timeout?: number;
  };

  // 消息配置
  message?: {
    format?: 'json' | 'text';
    parser?: (data: any) => any;
    serializer?: (data: any) => string;
  };

  // 事件处理
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
}

/**
 * WebSocket 服务接口
 */
export interface WebSocketService {
  // 连接状态
  readonly connected: boolean;
  readonly connecting: boolean;

  // 连接管理
  connect(config?: Partial<WebSocketConfig>): Promise<void>;
  disconnect(): void;
  reconnect(): Promise<void>;

  // 消息发送
  send(data: any): void;
  sendJson(data: object): void;

  // 事件监听
  on(event: string, handler: WebSocketEventHandler): void;
  off(event: string, handler: WebSocketEventHandler): void;
  once(event: string, handler: WebSocketEventHandler): void;

  // 中间件
  use(middleware: WebSocketMiddleware): void;
  eject(middleware: WebSocketMiddleware): void;

  // 心跳管理
  startHeartbeat(): void;
  stopHeartbeat(): void;
}

/**
 * WebSocket 中间件接口
 */
export interface WebSocketMiddleware {
  name: string;
  beforeConnect?: (config: WebSocketConfig) => Promise<WebSocketConfig> | WebSocketConfig;
  afterConnect?: (socket: WebSocket) => Promise<void> | void;
  beforeMessage?: (data: any) => Promise<any> | any;
  afterMessage?: (data: any) => Promise<void> | void;
  onError?: (error: Error) => Promise<void> | void;
  onClose?: (event: CloseEvent) => Promise<void> | void;
}

/**
 * WebSocket 事件类型
 */
export type WebSocketEventType = 'open' | 'close' | 'error' | 'message' | 'reconnect' | 'heartbeat';

/**
 * WebSocket 事件处理器
 */
export type WebSocketEventHandler = (event: Event | MessageEvent | CloseEvent) => void;
