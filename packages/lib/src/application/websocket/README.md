# WebSocket Module

WebSocket模块提供了WebSocket客户端的完整实现，支持双向通信、自动重连和心跳检测。

## 特性

- 🔄 自动重连机制
- 💓 心跳检测
- 📡 双向实时通信
- 🎯 消息过滤
- 💾 消息缓存
- 🔌 连接状态管理
- ⚡ 高性能设计

## 使用方法

### 基础使用

```typescript
import { createWebSocketService } from '@lib/application/websocket';

const wsService = createWebSocketService({
  url: 'ws://example.com/ws',
  protocols: ['v1']
});

// 监听消息
wsService.onMessage(message => {
  console.log('收到消息:', message);
});

// 发送消息
wsService.send({
  type: 'chat',
  content: 'Hello!'
});

// 启动连接
wsService.connect();

// 关闭连接
wsService.disconnect();
```

### 高级配置

```typescript
const wsService = createWebSocketService({
  // 基础配置
  url: 'ws://example.com/ws',
  protocols: ['v1'],

  // 重连配置
  reconnect: {
    enabled: true,
    maxAttempts: 5,
    delay: 1000,
    backoff: 1.5
  },

  // 心跳配置
  heartbeat: {
    enabled: true,
    interval: 30000,
    message: 'ping'
  },

  // 消息配置
  message: {
    parse: true,
    stringify: true,
    compress: false
  }
});
```

### 消息处理

```typescript
// 发送消息
wsService.send({
  type: 'chat',
  content: 'Hello!',
  timestamp: Date.now()
});

// 监听特定类型消息
wsService.onMessageType('chat', message => {
  // 处理聊天消息
});

// 监听所有消息
wsService.onMessage(message => {
  // 处理任何消息
});

// 发送二进制数据
wsService.sendBinary(binaryData);
```

### 中间件支持

```typescript
// 添加发送中间件
wsService.use('send', (message, next) => {
  // 处理发送的消息
  message.timestamp = Date.now();
  next(message);
});

// 添加接收中间件
wsService.use('receive', (message, next) => {
  // 处理接收的消息
  if (message.type === 'error') {
    console.error(message);
  }
  next(message);
});
```

## 配置选项

| 选项                  | 类型     | 默认值 | 描述                |
| --------------------- | -------- | ------ | ------------------- |
| url                   | string   | -      | WebSocket服务器地址 |
| protocols             | string[] | []     | WebSocket子协议     |
| reconnect.enabled     | boolean  | true   | 是否启用自动重连    |
| reconnect.maxAttempts | number   | 5      | 最大重试次数        |
| reconnect.delay       | number   | 1000   | 重试延迟(ms)        |
| heartbeat.enabled     | boolean  | true   | 是否启用心跳检测    |
| heartbeat.interval    | number   | 30000  | 心跳间隔(ms)        |
| message.parse         | boolean  | true   | 是否自动解析消息    |

## 注意事项

1. 在组件卸载时务必调用 disconnect() 断开连接
2. 合理配置心跳间隔，避免无谓的网络消耗
3. 大量数据传输时考虑使用二进制消息
4. 注意处理网络异常情况
5. 使用中间件时注意性能影响

## 错误处理

```typescript
wsService.onError(error => {
  console.error('WebSocket错误:', error);
});

wsService.onClose(event => {
  console.log('连接关闭:', event.code, event.reason);
});
```

## 状态监控

```typescript
wsService.onStateChange(state => {
  switch (state) {
    case 'connecting':
      console.log('正在连接...');
      break;
    case 'connected':
      console.log('已连接');
      break;
    case 'disconnected':
      console.log('已断开');
      break;
    case 'error':
      console.log('连接错误');
      break;
  }
});
```
