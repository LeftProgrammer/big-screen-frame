# 主题系统 (Theme System)

主题系统提供了一个灵活且易于扩展的方式来管理大屏应用的视觉风格。支持黑暗/明亮模式切换，以及自定义主题色配置。

## 特性

- ✨ 内置黑暗/明亮主题
- 🎨 支持自定义主题色
- 🔄 平滑的主题切换过渡
- 🌓 支持跟随系统主题
- 🔌 可选的 Element Plus 主题集成

## 快速开始

### 1. 基础使用

```typescript
import { ThemeManager } from '@bsf/core';

// 获取主题管理器实例
const themeManager = ThemeManager.getInstance();

// 配置主题
themeManager.configure({
  type: 'light', // 'light' | 'dark' | 'system'
  enableTransition: true, // 启用主题切换过渡动画
  enableElementPlus: true // 启用 Element Plus 主题同步
});

// 切换主题
themeManager.setTheme('dark');
```

### 2. 自定义主题色

```typescript
// 更新当前主题的颜色
themeManager.updateThemeColors({
  primaryColor: '#1890ff',
  successColor: '#52c41a',
  warningColor: '#faad14',
  dangerColor: '#ff4d4f',
  infoColor: '#909399'
});
```

### 3. 在组件中使用

```vue
<template>
  <div class="my-component">
    <h1>{{ title }}</h1>
    <button @click="toggleTheme">切换主题</button>
  </div>
</template>

<script setup lang="ts">
import { ThemeManager } from '@bsf/core';

const themeManager = ThemeManager.getInstance();
const toggleTheme = () => {
  const currentTheme = themeManager.getCurrentTheme();
  themeManager.setTheme(currentTheme.type === 'light' ? 'dark' : 'light');
};
</script>

<style lang="scss">
.my-component {
  color: var(--bsf-text-color-primary);
  background: var(--bsf-bg-color-base);

  h1 {
    color: var(--bsf-color-primary);
  }
}
</style>
```

### 4. 监听主题变化

```typescript
window.addEventListener('bsf-theme-change', event => {
  const { oldTheme, newTheme, vars } = event.detail;
  console.log(`Theme changed from ${oldTheme} to ${newTheme}`);
});
```

## CSS 变量

### 颜色变量

```scss
// 主色
--bsf-color-primary
--bsf-color-success
--bsf-color-warning
--bsf-color-danger
--bsf-color-info

// 文本颜色
--bsf-text-color-primary
--bsf-text-color-regular
--bsf-text-color-secondary
--bsf-text-color-placeholder

// 边框颜色
--bsf-border-color-base
--bsf-border-color-light
--bsf-border-color-lighter
--bsf-border-color-extra-light

// 背景颜色
--bsf-bg-color-base
--bsf-bg-color-light
--bsf-bg-color-lighter
```

### 尺寸变量

```scss
// 字体大小
--bsf-font-size-xs
--bsf-font-size-sm
--bsf-font-size-base
--bsf-font-size-md
--bsf-font-size-lg
--bsf-font-size-xl

// 间距
--bsf-spacing-xs
--bsf-spacing-sm
--bsf-spacing-base
--bsf-spacing-md
--bsf-spacing-lg
--bsf-spacing-xl

// 圆角
--bsf-radius-sm
--bsf-radius-base
--bsf-radius-lg
--bsf-radius-round
--bsf-radius-circle
```

### 效果变量

```scss
// 阴影
--bsf-shadow-base
--bsf-shadow-light
--bsf-shadow-dark

// 边框装饰
--bsf-border-decoration-color
--bsf-border-decoration-glow

// 过渡
--bsf-transition-fast
--bsf-transition-base
--bsf-transition-slow
```

## 最佳实践

1. **使用语义化的变量**

   ```scss
   // ✅ 好的做法
   .card {
     color: var(--bsf-text-color-primary);
     background: var(--bsf-bg-color-base);
   }

   // ❌ 避免直接使用颜色值
   .card {
     color: #303133;
     background: #ffffff;
   }
   ```

2. **主题过渡**

   ```html
   <!-- 添加过渡效果 -->
   <div class="bsf-theme-transition">
     <!-- 内容 -->
   </div>
   ```

3. **响应式主题**

   ```typescript
   themeManager.configure({
     type: 'system', // 跟随系统主题
     enableTransition: true
   });
   ```

4. **组件封装**

   ```vue
   <!-- ThemeSwitch.vue -->
   <template>
     <el-switch
       v-model="isDark"
       active-text="暗色"
       inactive-text="亮色"
       @change="handleThemeChange"
     />
   </template>

   <script setup lang="ts">
   import { ref, onMounted } from 'vue';
   import { ThemeManager } from '@bsf/core';

   const themeManager = ThemeManager.getInstance();
   const isDark = ref(false);

   onMounted(() => {
     isDark.value = themeManager.getCurrentTheme().type === 'dark';
   });

   const handleThemeChange = (value: boolean) => {
     themeManager.setTheme(value ? 'dark' : 'light');
   };
   </script>
   ```

## 扩展主题

要创建自定义主题，可以通过 `registerTheme` 方法注册新的主题：

```typescript
themeManager.registerTheme('custom', {
  bsf: {
    colors: {
      primary: '#1890ff'
      // ... 其他颜色变量
    },
    sizes: {
      // ... 尺寸变量
    },
    effects: {
      // ... 效果变量
    }
  },
  // 可选：Element Plus 主题变量
  ep: {
    colors: {
      primary: '#1890ff'
      // ... Element Plus 颜色变量
    }
  }
});
```

## Element Plus 集成

启用 Element Plus 主题同步：

```typescript
themeManager.configure({
  enableElementPlus: true
});
```

这将自动同步主题色到 Element Plus 组件，确保整体视觉统一。

## 注意事项

1. 确保在应用初始化时配置主题系统
2. 使用 CSS 变量时注意浏览器兼容性
3. 大量主题切换时，建议启用过渡动画以提供更好的用户体验
4. 自定义主题时，确保提供完整的主题变量集
