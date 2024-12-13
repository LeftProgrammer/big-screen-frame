# Transition Module

过渡动画模块提供了一系列可复用的过渡效果和动画组件，用于创建流畅的用户界面交互。

## 特性

- 🎨 预设动画效果
- ⚡ 性能优化
- 🔄 可自定义
- 📱 响应式支持
- 🎯 组件集成
- 💫 动画编排

## 预设动画

### 淡入淡出

```vue
<template>
  <Fade>
    <div v-if="visible">内容</div>
  </Fade>
</template>

<script setup>
import { Fade } from '@lib/core/transition';
</script>
```

### 滑动

```vue
<template>
  <Slide direction="left">
    <div v-if="visible">内容</div>
  </Slide>
</template>

<script setup>
import { Slide } from '@lib/core/transition';
</script>
```

### 缩放

```vue
<template>
  <Scale>
    <div v-if="visible">内容</div>
  </Scale>
</template>

<script setup>
import { Scale } from '@lib/core/transition';
</script>
```

## 组合使用

### 组合多个效果

```vue
<template>
  <TransitionGroup>
    <Fade v-for="item in items" :key="item.id">
      <Slide direction="right">
        <div class="item">
          {{ item.content }}
        </div>
      </Slide>
    </Fade>
  </TransitionGroup>
</template>
```

### 自定义动画

```vue
<template>
  <CustomTransition :enter="enterClass" :leave="leaveClass" :duration="300">
    <div v-if="visible">内容</div>
  </CustomTransition>
</template>
```

## API参考

### Fade 组件

| 属性     | 类型                 | 默认值   | 描述         |
| -------- | -------------------- | -------- | ------------ |
| duration | number               | 300      | 动画持续时间 |
| delay    | number               | 0        | 动画延迟时间 |
| mode     | 'in-out' \| 'out-in' | 'out-in' | 过渡模式     |

### Slide 组件

| 属性      | 类型                                | 默认值 | 描述         |
| --------- | ----------------------------------- | ------ | ------------ |
| direction | 'left' \| 'right' \| 'up' \| 'down' | 'left' | 滑动方向     |
| distance  | string                              | '100%' | 滑动距离     |
| duration  | number                              | 300    | 动画持续时间 |

### Scale 组件

| 属性         | 类型   | 默认值   | 描述         |
| ------------ | ------ | -------- | ------------ |
| initialScale | number | 0.8      | 初始缩放比例 |
| duration     | number | 300      | 动画持续时间 |
| origin       | string | 'center' | 缩放原点     |

## 动画Hooks

### useTransition

```typescript
import { useTransition } from '@lib/core/transition';

const {
  isVisible,
  style,
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave
} = useTransition();
```

### useAnimation

```typescript
import { useAnimation } from '@lib/core/transition';

const { play, pause, reverse, finish, cancel } = useAnimation(element, keyframes, options);
```

## 最佳实践

1. 使用适当的过渡模式

```vue
<Fade mode="out-in">
  <component :is="currentComponent" />
</Fade>
```

2. 处理动画事件

```vue
<Slide
  @before-enter="onBeforeEnter"
  @after-enter="onAfterEnter"
  @before-leave="onBeforeLeave"
  @after-leave="onAfterLeave"
>
  <div v-if="visible">
    内容
  </div>
</Slide>
```

3. 优化性能

```vue
<TransitionGroup :css="false" @enter="onEnter" @leave="onLeave">
  <!-- 使用 JavaScript 动画代替 CSS -->
</TransitionGroup>
```

## 注意事项

1. 避免在频繁更新的列表中使用复杂动画
2. 使用 `v-show` 代替 `v-if` 实现频繁切换的动画
3. 大型列表动画考虑使用虚拟滚动
4. 注意动画的性能影响
5. 合理设置动画持续时间，避免影响用户体验
