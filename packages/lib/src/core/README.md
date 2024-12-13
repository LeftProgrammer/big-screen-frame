# Core Module

核心模块提供了框架的基础设施和工具。

## 模块结构

```
core/
├── events/         # 事件系统
├── hooks/          # 通用 Hooks
├── http/           # HTTP 请求
├── layout/         # 布局系统
├── store/          # 状态管理
├── theme/          # 主题系统
├── transition/     # 过渡动画
└── utils/          # 工具函数
```

## 功能模块

### HTTP 模块

基于 Axios 的 HTTP 请求封装：

- 请求拦截器
- 响应拦截器
- 错误处理
- 请求重试
- 取消请求

### Store 模块

状态管理系统：

- 全局状态
- 持久化
- 状态订阅

### Theme 模块

主题管理系统：

- 主题切换
- 主题定制
- 动态主题

### Utils 模块

工具函数集合：

- 存储工具 (storage.ts)
- URL处理 (url.ts)
- 日期处理 (datetime.ts)
- 类型检查 (type-check.ts)

## 使用示例

1. HTTP 请求

```typescript
import { http } from '@/core/http';

const response = await http.get('/api/data');
```

2. 状态管理

```typescript
import { createStore } from '@/core/store';

const store = createStore({
  state: {
    count: 0
  },
  actions: {
    increment(state) {
      state.count++;
    }
  }
});
```

3. 工具函数

```typescript
import { storage, DateTimeUtils } from '@/core/utils';

// 存储数据
storage.set('key', 'value');

// 格式化日期
const date = DateTimeUtils.format(new Date(), 'yyyy-MM-dd');
```

## 特性

- 模块化设计
- TypeScript 支持
- 完整的类型定义
- 可扩展的架构

## 注意事项

1. 所有模块支持按需引入
2. 提供完整的类型定义
3. 支持自定义配置
4. 遵循最佳实践
