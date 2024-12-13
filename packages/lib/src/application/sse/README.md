# SSE (Server-Sent Events) Module

SSE模块提供了服务器发送事件(Server-Sent Events)的客户端实现，支持实时数据推送和自动重连。

## 特性

- 🔄 自动重连机制
- 📡 实时数据推送
- 🎯 事件过滤
- 💾 消息缓存
- 🔌 连接状态管理
- ⚡ 高性能设计

## 使用方法

### 基础使用

```typescript
import { createSSEService } from '@lib/application/sse';

const sseService = createSSEService({
  url: '/api/sse',
  autoReconnect: true
});

// 监听事件
sseService.on('message', event => {
  console.log('收到消息:', event.data);
});

// 启动连接
sseService.connect();

// 关闭连接
sseService.disconnect();
```

### 高级配置

```typescript
const sseService = createSSEService({
  // 基础配置
  url: '/api/sse',
  autoReconnect: true,

  // 重连配置
  reconnect: {
    maxAttempts: 5,
    delay: 1000,
    backoff: 1.5
  },

  // 事件配置
  events: {
    message: true,
    error: true,
    custom: true
  },

  // 缓存配置
  cache: {
    enabled: true,
    maxSize: 100
  }
});
```

### 事件处理

```typescript
// 监听特定事件
sseService.on('custom-event', event => {
  // 处理自定义事件
});

// 监听所有事件
sseService.onAny((eventName, event) => {
  // 处理任何事件
});

// 一次性事件监听
sseService.once('one-time-event', event => {
  // 只触发一次
});
```

### 状态管理

```typescript
// 监听连接状态
sseService.onStateChange(state => {
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

## 配置选项

| 选项                  | 类型    | 默认值 | 描述             |
| --------------------- | ------- | ------ | ---------------- |
| url                   | string  | -      | SSE服务器地址    |
| autoReconnect         | boolean | true   | 是否自动重连     |
| reconnect.maxAttempts | number  | 5      | 最大重试次数     |
| reconnect.delay       | number  | 1000   | 重试延迟(ms)     |
| reconnect.backoff     | number  | 1.5    | 重试延迟增长系数 |
| events.message        | boolean | true   | 是否启用消息事件 |
| cache.enabled         | boolean | true   | 是否启用消息缓存 |
| cache.maxSize         | number  | 100    | 最大缓存消息数   |

## 注意事项

1. SSE是单向通信机制，只能从服务器向客户端推送数据
2. 建议在组件卸载时断开连接
3. 合理配置重连参数，避免服务器压力过大
4. 注意内存使用，及时清理不需要的事件监听器
5. 考虑在弱网环境下的用户体验
