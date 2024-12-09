# Big Screen Framework Library

一个基于 Vue 3 的大屏开发框架库，提供了丰富的组件和功能，帮助你快速开发大屏项目。

## 特性

- 🚀 基于 Vue 3 + TypeScript
- 📦 开箱即用的组件库
- 🎨 可定制的主题系统
- 📏 灵活的布局系统
- 🔌 插件化架构
- 💪 完整的 TypeScript 类型支持
- 📱 响应式设计

## 安装

```bash
pnpm add @jinghe/jinghe-lanhai
```

## 快速开始

```typescript
import { createApp } from 'vue'
import BigScreen from '@jinghe/jinghe-lanhai'
import '@jinghe/jinghe-lanhai/dist/style.css'

const app = createApp(App)

app.use(BigScreen, {
  theme: 'dark',
  autoResize: true,
  grid: {
    enabled: true,
    size: 10
  }
})

app.mount('#app')
```

## 使用组件

```vue
<template>
  <bs-scale-screen>
    <bs-container>
      <!-- 你的大屏内容 -->
    </bs-container>
  </bs-scale-screen>
</template>
```

## 按需引入

```typescript
import { createBigScreen } from '@jinghe/jinghe-lanhai'
import { ScaleScreen, Container } from '@jinghe/jinghe-lanhai/components'

const bigScreen = createBigScreen({
  // 你的配置
})

app.use(bigScreen)
   .component('ScaleScreen', ScaleScreen)
   .component('Container', Container)
```

## 主题定制

```typescript
import { createBigScreen } from '@jinghe/jinghe-lanhai'

const bigScreen = createBigScreen({
  theme: {
    // 自定义主题配置
    colors: {
      primary: '#1890ff',
      // ...
    },
    // ...
  }
})
```

## TypeScript 支持

本库提供完整的 TypeScript 类型定义，支持组件属性和方法的类型提示。

## 开发指南

1. 克隆仓库
```bash
git clone [repository-url]
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 构建库
```bash
pnpm build
```

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (git checkout -b feature/AmazingFeature)
3. 提交你的改动 (git commit -m 'Add some AmazingFeature')
4. 推送到分支 (git push origin feature/AmazingFeature)
5. 开启一个 Pull Request

## License

[MIT License](LICENSE)