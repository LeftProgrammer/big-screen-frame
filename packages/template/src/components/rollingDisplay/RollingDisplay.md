# RollingDisplay 滚动展示组件

一个支持垂直和水平方向滚动的展示组件，适用于公告、消息、新闻等内容的滚动展示。

## 安装

```bash
# 复制组件到你的项目中
src/components/rollingDisplay/index.vue
src/components/rollingDisplay/ImagePreview.vue
```

## 快速开始

```vue
<template>
  <RollingDisplay :data="messages" />
</template>

<script setup lang="ts">
import RollingDisplay from '@/components/rollingDisplay/index.vue'

const messages = [
  '普通文本消息',
  { text: '带图片的消息', image: '/icon.png' },
  { html: '<b style="color: red">HTML 内容</b>' }
]
</script>
```

## 组件属性

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| data | 展示的数据列表 | `(string \| RollingItem)[]` | `[]` |
| direction | 滚动方向 | `'vertical' \| 'horizontal'` | `'vertical'` |
| speed | 滚动速度(越大越快) | `number` | `50` |
| hoverPause | 鼠标悬停时是否暂停 | `boolean` | `true` |
| clickable | 是否可点击 | `boolean` | `true` |
| width | 容器宽度 | `string \| number` | `'300px'` |
| height | 容器高度 | `string \| number` | - |
| wheelable | 是否支持鼠标滚轮 | `boolean` | `true` |

## 数据格式

```typescript
// 字符串格式
const messages = ['消息1', '消息2', '消息3']

// 对象格式
interface RollingItem {
  text?: string;   // 文本内容
  image?: string;  // 图片URL
  html?: string;   // HTML内容
}

const items = [
  { text: '普通消息' },
  { text: '带图片', image: '/icon.png' },
  { html: '<span style="color: red">HTML</span>' }
]
```

## 常用示例

### 1. 垂直滚动公告

```vue
<template>
  <RollingDisplay
    :data="notices"
    direction="vertical"
    :speed="50"
    :hover-pause="true"
    width="300px"
    height="200px"
  />
</template>

<script setup>
const notices = [
  '公告内容1',
  '公告内容2',
  '公告内容3'
]
</script>
```

### 2. 水平滚动带图标的消息

```vue
<template>
  <RollingDisplay
    :data="messages"
    direction="horizontal"
    :speed="30"
    width="100%"
    height="65px"
  />
</template>

<script setup>
const messages = [
  { text: '消息1', image: '/warning.png' },
  { text: '消息2', image: '/info.png' },
  { text: '消息3', image: '/success.png' }
]
</script>
```

### 3. 自定义内容展示

```vue
<template>
  <RollingDisplay :data="items">
    <template #item="{ item, index }">
      <div class="custom-item">
        <span class="number">{{ index + 1 }}</span>
        <img v-if="item.icon" :src="item.icon" />
        <span class="title">{{ item.title }}</span>
        <span class="time">{{ item.time }}</span>
      </div>
    </template>
  </RollingDisplay>
</template>
```

## 组件事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 当前项改变 | `{ currentIndex: number, currentItem: string \| RollingItem }` |
| itemClick | 点击项目 | `{ item: string \| RollingItem, index: number }` |
| pause | 滚动暂停 | - |
| resume | 滚动恢复 | - |

## 组件方法

通过 ref 调用：

```vue
<template>
  <RollingDisplay ref="rollingRef" :data="items" />
</template>

<script setup>
const rollingRef = ref()

// 暂停滚动
rollingRef.value?.pause()

// 恢复滚动
rollingRef.value?.resume()

// 滚动到指定索引
rollingRef.value?.scrollTo(2)

// 获取当前索引
const currentIndex = rollingRef.value?.getCurrentIndex()

// 获取当前项
const currentItem = rollingRef.value?.getCurrentItem()
</script>
```

## 图片预览功能

组件内置图片预览功能，支持：
- 点击图片放大预览
- 鼠标拖拽
- 滚轮缩放
- 旋转图片
- 全屏显示

快捷键：
- `+/-` 或滚轮：缩放
- `←/→`：旋转
- `F`：全屏
- `ESC`：关闭

## 注意事项

1. 设置合适的容器尺寸以获得最佳效果
2. HTML内容需注意XSS风险
3. 图片URL需确保可访问
4. 水平滚动时文本会自动截断
5. 滚动速度建议值: 30-100