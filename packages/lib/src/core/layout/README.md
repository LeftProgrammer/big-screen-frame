# Scale Screen 大屏自适应组件

一个功能强大的大屏自适应缩放组件，专门用于处理大屏可视化项目中的屏幕适配问题。

## 特性

- 🖥️ 多种缩放模式（适应、拉伸、统一）
- 🎯 灵活的对齐方式
- 🔍 支持缩放和拖拽
- 📏 可选的网格和参考线
- ⌨️ 快捷键支持
- 🎨 主题切换
- 🗺️ 导航器
- 📸 屏幕快照

## 基础使用

```vue
<template>
  <scale-screen :width="1920" :height="1080" mode="fit" theme="dark" :auto-resize="true">
    <!-- 你的大屏内容 -->
  </scale-screen>
</template>

<script setup lang="ts">
import { ScaleScreen } from '@/core/layout';
</script>
```

## 组件属性

### 基础属性

| 属性名     | 类型                            | 默认值   | 说明                     |
| ---------- | ------------------------------- | -------- | ------------------------ |
| width      | number                          | -        | 设计稿宽度（必填）       |
| height     | number                          | -        | 设计稿高度（必填）       |
| mode       | 'fit' \| 'stretch' \| 'uniform' | 'fit'    | 缩放模式                 |
| alignX     | 'center' \| 'left' \| 'right'   | 'center' | 水平对齐方式             |
| alignY     | 'center' \| 'top' \| 'bottom'   | 'center' | 垂直对齐方式             |
| autoResize | boolean                         | true     | 是否自动响应容器大小变化 |
| theme      | 'light' \| 'dark' \| 'custom'   | 'light'  | 主题模式                 |
| minScale   | number                          | 0.1      | 最小缩放比例             |
| maxScale   | number                          | 5        | 最大缩放比例             |

### 高级配置

```typescript
interface AdvancedOptions {
  // 网格配置
  grid?: {
    enabled: boolean; // 是否启用网格
    size: number; // 网格大小
    color?: string; // 网格颜色
    opacity?: number; // 网格透明度
    showGuides?: boolean; // 是否显示参考线
  };

  // 手势配置
  gestures?: {
    enabled: boolean; // 是否启用手势
    minScale?: number; // 最小缩放比例
    maxScale?: number; // 最大缩放比例
    scaleSensitivity?: number; // 缩放灵敏度
    dragEnabled?: boolean; // 是否允许拖拽
  };

  // 快捷键配置
  shortcuts?: {
    enabled: boolean; // 是否启用快捷键
    zoomIn?: string; // 放大快捷键
    zoomOut?: string; // 缩小快捷键
    reset?: string; // 重置快捷键
    toggleFullscreen?: string; // 全屏切换快捷键
  };

  // 导航器配置
  navigator?: {
    enabled: boolean; // 是否启用导航器
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    width?: number; // 导航器宽度
    height?: number; // 导航器高度
    opacity?: number; // 导航器透明度
  };

  smoothScaling?: boolean; // 是否启用平滑缩放
  scaleStep?: number; // 缩放步长
  transitionDuration?: number; // 过渡动画持续时间
  debounceDelay?: number; // 防抖延迟时间
  className?: string; // 自定义类名
}
```

## 组件事件

| 事件名           | 参数                                         | 说明               |
| ---------------- | -------------------------------------------- | ------------------ |
| scale            | (scale: number)                              | 缩放比例变化时触发 |
| modeChange       | (mode: ScaleMode)                            | 缩放模式变化时触发 |
| alignChange      | (horizontal: AlignType, vertical: AlignType) | 对齐方式变化时触发 |
| fullscreenChange | (isFullscreen: boolean)                      | 全屏状态变化时触发 |
| resize           | (width: number, height: number)              | 容器大小变化时触发 |

## 组件方法

通过模板引用可以访问以下方法：

```typescript
interface ScaleScreenMethods {
  reset: () => void; // 重置缩放
  zoomIn: () => void; // 放大
  zoomOut: () => void; // 缩小
  setScale: (scale: number) => void; // 设置缩放比例
  toggleFullscreen: () => Promise<void>; // 切换全屏
  getSnapshot: () => Promise<string>; // 获取快照
}
```

## 插槽

| 插槽名    | 说明         |
| --------- | ------------ |
| default   | 大屏内容     |
| toolbar   | 自定义工具栏 |
| navigator | 自定义导航器 |

## 使用示例

### 1. 基础缩放

```vue
<template>
  <scale-screen ref="screenRef" :width="1920" :height="1080" mode="fit" @scale="handleScale">
    <your-dashboard />
  </scale-screen>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ScaleScreenInstance } from '@/core/layout';

const screenRef = ref<ScaleScreenInstance>();

const handleScale = (scale: number) => {
  console.log('当前缩放比例:', scale);
};
</script>
```

### 2. 高级配置

```vue
<template>
  <scale-screen
    :width="1920"
    :height="1080"
    :options="{
      grid: {
        enabled: true,
        size: 100,
        showGuides: true
      },
      gestures: {
        enabled: true,
        dragEnabled: true
      },
      navigator: {
        enabled: true,
        position: 'bottom-right'
      },
      shortcuts: {
        enabled: true,
        zoomIn: '+',
        zoomOut: '-',
        reset: 'r'
      }
    }"
  >
    <your-dashboard />
  </scale-screen>
</template>
```

## 最佳实践

### 1. 设计稿适配

```vue
<template>
  <scale-screen
    :width="1920"
    :height="1080"
    mode="uniform"
    :min-scale="0.5"
    :max-scale="2"
    :auto-resize="true"
  >
    <!-- 使用 px 作为单位，无需考虑适配问题 -->
    <div style="width: 400px; height: 300px;">图表内容</div>
  </scale-screen>
</template>
```

### 2. 自定义工具栏

```vue
<template>
  <scale-screen ref="screenRef">
    <template #toolbar>
      <div class="custom-toolbar">
        <button @click="screenRef?.zoomIn()">放大</button>
        <button @click="screenRef?.zoomOut()">缩小</button>
        <button @click="screenRef?.reset()">重置</button>
        <button @click="screenRef?.toggleFullscreen()">全屏</button>
      </div>
    </template>
  </scale-screen>
</template>
```

## 注意事项

1. **性能优化**

   - 避免在缩放过程中进行复杂计算
   - 合理使用 `debounceDelay` 控制resize频率
   - 大型图表建议使用 `v-show` 而不是 `v-if`

2. **样式处理**

   - 所有尺寸单位使用 px
   - 避免使用 vw、vh 等相对单位
   - 字体大小会跟随缩放，无需特殊处理

3. **事件处理**
   - 鼠标事件的坐标需要考虑缩放比例
   - 拖拽功能开启时注意与内部组件的事件冲突

## 常见问题

1. **Q: 为什么图表大小不跟随缩放？**
   A: 确保图表容器使用 px 单位，且在数据更新后调用图表的 resize 方法。

2. **Q: 如何保持文字清晰度？**
   A: 建议使用 svg 格式的图标，避免使用位图。对于必要的位图，考虑使用 2x 或 3x 图片。

3. **Q: 全屏模式下闪烁？**
   A: 检查是否有组件在全屏切换时触发了不必要的重渲染，可以使用 `v-show` 替代 `v-if`。

## 贡献指南

1. Fork 本仓库
2. 创建特性分支
3. 提交变更
4. 发起 Pull Request

## 许可证

MIT License
