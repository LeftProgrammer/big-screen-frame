# Events Module

事件系统模块提供了一个轻量级但功能强大的事件总线实现，支持事件发布/订阅、异步事件处理和事件过滤。

## 特性

- 📡 发布/订阅模式
- ⚡ 异步事件处理
- 🎯 事件过滤
- 🔄 事件链
- 💾 事件历史
- 🎨 类型安全

## 使用方法

### 基础使用

```typescript
import { createEventBus } from '@lib/core/events';

const eventBus = createEventBus();

// 订阅事件
eventBus.on('userLogin', user => {
  console.log('用户登录:', user);
});

// 发布事件
eventBus.emit('userLogin', { id: 1, name: 'John' });
```

### 类型安全的事件

```typescript
interface Events {
  userLogin: { id: number; name: string };
  userLogout: { id: number };
  dataUpdate: { type: string; data: any };
}

const eventBus = createEventBus<Events>();

// TypeScript 会提供完整的类型检查和提示
eventBus.on('userLogin', user => {
  console.log(user.id, user.name);
});
```

### 异步事件处理

```typescript
// 异步事件处理器
eventBus.on('dataUpdate', async data => {
  await processData(data);
});

// 等待所有处理器完成
await eventBus.emitAsync('dataUpdate', {
  type: 'users',
  data: userData
});
```

### 事件过滤

```typescript
// 使用过滤器
eventBus.on(
  'dataUpdate',
  data => {
    // 只处理用户数据
  },
  {
    filter: data => data.type === 'users'
  }
);
```

### 一次性事件

```typescript
// 只监听一次
eventBus.once('initialization', config => {
  // 处理初始化配置
});
```

### 事件链

```typescript
// 创建事件链
eventBus
  .chain('userAction')
  .handle('validate', validateUser)
  .handle('process', processUser)
  .handle('notify', notifyUser)
  .execute(userData);
```

## API 参考

### EventBus 实例方法

| 方法                           | 描述           |
| ------------------------------ | -------------- |
| on(event, handler, options?)   | 订阅事件       |
| once(event, handler, options?) | 订阅一次性事件 |
| off(event, handler?)           | 取消订阅       |
| emit(event, data)              | 同步发布事件   |
| emitAsync(event, data)         | 异步发布事件   |
| clear(event?)                  | 清除事件监听器 |

### 事件处理器选项

| 选项     | 类型                 | 描述         |
| -------- | -------------------- | ------------ |
| filter   | (data: T) => boolean | 事件过滤器   |
| async    | boolean              | 是否异步处理 |
| priority | number               | 处理器优先级 |
| timeout  | number               | 处理超时时间 |

## 最佳实践

1. 使用类型定义确保类型安全

```typescript
interface Events {
  [key: string]: any;
}

const eventBus = createEventBus<Events>();
```

2. 合理使用事件过滤

```typescript
eventBus.on('dataChange', handler, {
  filter: data => data.important === true
});
```

3. 注意清理事件监听器

```typescript
// 在组件卸载时
onUnmounted(() => {
  eventBus.off('eventName', handler);
});
```

4. 使用异步事件处理大量数据

```typescript
eventBus.on(
  'bulkData',
  async data => {
    await processInBatches(data);
  },
  { async: true }
);
```

## 注意事项

1. 避免过度使用全局事件总线
2. 及时清理不再需要的事件监听器
3. 合理使用事件过滤器减少不必要的处理
4. 注意异步事件处理的错误捕获
5. 使用类型定义提高代码可维护性
