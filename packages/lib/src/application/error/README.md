# Error Module

错误处理模块提供了统一的错误处理机制，包括错误捕获、处理和展示。

## 特性

- 🎯 统一的错误处理
- 📝 详细的错误日志
- 🔄 错误重试机制
- 🌐 国际化错误消息
- 📊 错误统计和分析
- 🎨 可自定义错误展示

## 使用方法

### 基础使用

```typescript
import { useError } from '@lib/application/error';

const errorHandler = useError();

try {
  // 业务代码
} catch (error) {
  errorHandler.handle(error);
}
```

### 错误处理配置

```typescript
const errorHandler = useError({
  // 错误展示配置
  display: {
    showNotification: true,
    showErrorPage: true
  },

  // 错误重试配置
  retry: {
    maxAttempts: 3,
    delay: 1000
  },

  // 错误上报配置
  report: {
    enabled: true,
    url: '/api/error-report'
  }
});
```

### HTTP错误处理

```typescript
import { createHTTPErrorHandler } from '@lib/application/error';

const httpErrorHandler = createHTTPErrorHandler({
  // HTTP状态码处理
  statusHandlers: {
    401: () => {
      // 处理未授权错误
    },
    404: () => {
      // 处理未找到错误
    }
  }
});
```

## 错误类型

### 应用错误

```typescript
import { ApplicationError } from '@lib/application/error';

throw new ApplicationError({
  code: 'VALIDATION_ERROR',
  message: '验证失败',
  details: {
    field: 'username',
    rule: 'required'
  }
});
```

### 业务错误

```typescript
import { BusinessError } from '@lib/application/error';

throw new BusinessError({
  code: 'INSUFFICIENT_BALANCE',
  message: '余额不足'
});
```

## 错误展示组件

### 错误页面

```vue
<template>
  <ErrorPage :code="404" message="页面未找到" :retry="handleRetry" />
</template>
```

### 错误提示

```typescript
errorHandler.showError({
  title: '操作失败',
  message: '请稍后重试',
  type: 'warning'
});
```

## 配置选项

| 选项                     | 类型    | 默认值              | 描述             |
| ------------------------ | ------- | ------------------- | ---------------- |
| display.showNotification | boolean | true                | 是否显示错误通知 |
| display.showErrorPage    | boolean | true                | 是否显示错误页面 |
| retry.maxAttempts        | number  | 3                   | 最大重试次数     |
| retry.delay              | number  | 1000                | 重试延迟(ms)     |
| report.enabled           | boolean | true                | 是否启用错误上报 |
| report.url               | string  | '/api/error-report' | 错误上报地址     |

## 注意事项

1. 错误处理应该在应用的最外层进行全局配置
2. 对于特定的业务场景，可以使用自定义的错误处理器
3. 错误重试应该考虑业务的幂等性
4. 敏感信息不应该出现在错误日志中
