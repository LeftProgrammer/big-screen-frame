# Application Module

应用层模块提供了构建应用所需的高级功能组件。

## 模块结构

```
application/
├── auth/           # 认证授权模块
├── error/          # 错误处理模块
├── router/         # 路由管理模块
├── sse/            # SSE (Server-Sent Events) 模块
└── websocket/      # WebSocket 通信模块
```

## 功能模块

### Auth 模块

提供认证和授权相关功能：

- 用户认证
- 权限控制
- Token 管理

### Error 模块

统一的错误处理机制：

- 错误拦截
- 错误展示
- 错误上报

### Router 模块

路由管理功能：

- 路由配置
- 路由守卫
- 权限路由

### SSE 模块

Server-Sent Events 支持：

- SSE 连接管理
- 事件监听
- 自动重连

### WebSocket 模块

WebSocket 通信支持：

- 连接管理
- 消息处理
- 心跳检测

## 使用示例

```typescript
// 使用 SSE
import { createSSEService } from '@/application/sse';

const sseService = createSSEService({
  url: '/api/sse',
  autoReconnect: true
});

// 使用 WebSocket
import { createWebSocketService } from '@/application/websocket';

const wsService = createWebSocketService({
  url: 'ws://example.com',
  protocols: ['protocol1']
});
```

## 注意事项

1. 各模块都支持独立使用
2. 提供 TypeScript 类型支持
3. 支持自定义配置和扩展
