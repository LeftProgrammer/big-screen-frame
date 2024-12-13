# Components Module

组件模块提供了一系列可复用的 UI 组件。

## 组件列表

### 基础组件

- `Card`: 卡片容器组件
- `Loading`: 加载状态组件
- `DefaultPages`: 默认页面组件（如 404、403 等）

### 数据展示

- `ECharts`: 图表组件
- `NumberFlip`: 数字翻转动画组件
- `ScrollList`: 滚动列表组件

## 使用方法

### 组件引入

```typescript
import { Card, Loading, ECharts } from '@/components';
```

### 示例

1. 卡片组件

```vue
<template>
  <Card title="标题">
    <div>内容</div>
  </Card>
</template>
```

2. 图表组件

```vue
<template>
  <ECharts :option="chartOption" />
</template>

<script setup lang="ts">
const chartOption = {
  // ECharts 配置项
};
</script>
```

3. 数字翻转

```vue
<template>
  <NumberFlip :value="1234" />
</template>
```

## 特性

- 支持 TypeScript
- 响应式设计
- 主题定制
- 完整的类型定义

## 注意事项

1. 所有组件都支持主题系统
2. 组件props都有详细的类型定义
3. 支持按需引入
4. 提供完整的事件支持
