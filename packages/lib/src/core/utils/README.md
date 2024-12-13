# Utils Module

工具函数模块提供了一系列常用的工具函数。

## 模块列表

### Storage (storage.ts)

本地存储工具：

```typescript
import { storage } from '@/core/utils';

// 存储数据
storage.set('key', { value: 123 });

// 获取数据
const data = storage.get('key');

// 删除数据
storage.remove('key');
```

### URL (url.ts)

URL处理工具：

```typescript
import { URLUtils } from '@/core/utils';

// 解析URL参数
const params = URLUtils.parseParams(window.location.href);

// 构建URL
const url = URLUtils.buildURL('/api', { id: 1, type: 'user' });

// 提取域名
const domain = URLUtils.extractDomain('https://example.com/path');
```

### DateTime (datetime.ts)

日期时间处理工具：

```typescript
import { DateTimeUtils } from '@/core/utils';

// 格式化日期
const date = DateTimeUtils.format(new Date(), 'yyyy-MM-dd HH:mm:ss');

// 获取相对时间
const relativeTime = DateTimeUtils.getRelativeTime(someDate);

// 日期范围
const dateRange = DateTimeUtils.getDateRange(startDate, endDate);
```

### TypeCheck (type-check.ts)

类型检查工具：

```typescript
import { TypeUtils } from '@/core/utils';

// 检查空值
if (TypeUtils.isEmpty(value)) {
  // 处理空值
}

// 获取类型
const type = TypeUtils.getType(value);

// 类型检查
if (TypeUtils.isNumber(value)) {
  // 处理数字
}
```

## 特性

- 全面的 TypeScript 支持
- 详细的类型定义
- 完整的错误处理
- 统一的接口设计

## 使用建议

1. 优先使用这些工具函数而不是重复实现
2. 所有工具函数都经过类型检查和错误处理
3. 支持按需导入，减少打包体积
4. 提供了详细的类型提示

## 注意事项

1. 所有工具函数都是无状态的
2. 错误处理会通过日志记录
3. 返回值类型都有明确定义
4. 参数验证确保安全使用
