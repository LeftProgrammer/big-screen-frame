# 样式系统 (Style System)

一个模块化的样式系统，专为大屏项目设计。提供了完整的主题支持、响应式布局和丰富的工具类。

## 目录结构

```
styles/
  ├── base/              # 基础样式模块
  │   ├── normalize.scss  # 样式重置和标准化
  │   ├── mixins.scss    # Sass混入函数
  │   ├── utilities.scss # 工具类
  │   └── variables.scss # 基础变量
  │
  ├── themes/            # 主题系统
  │   ├── _variables.scss # 主题变量定义
  │   ├── _builder.scss  # 主题构建器
  │   ├── dark.scss     # 暗色主题
  │   ├── light.scss    # 亮色主题
  │   └── index.scss    # 主题入口
  │
  ├── vendors/           # 第三方库集成
  │   └── element-plus.scss # Element Plus 样式覆盖
  │
  └── index.scss         # 样式系统入口
```

## 使用指南

### 1. 引入样式

在你的项目入口文件中引入样式系统：

```scss
// main.ts 或 main.js
import '@bsf/styles/index.scss'
```

### 2. 使用工具类

```html
<div class="bsf-flex bsf-justify-between bsf-items-center">
  <div class="bsf-text-primary bsf-text-xl">标题</div>
  <div class="bsf-text-regular bsf-text-sm">内容</div>
</div>
```

### 3. 使用主题变量

```scss
.my-component {
  color: var(--bsf-text-color-primary);
  background: var(--bsf-bg-color-base);
  border: 1px solid var(--bsf-border-color-base);

  &:hover {
    background: var(--bsf-bg-color-light);
  }
}
```

### 4. 使用混入函数

```scss
.my-component {
  @include flex(column, center, center);
  @include scrollbar;

  .title {
    @include text-ellipsis;
  }
}
```

## 主题系统

主题系统提供了完整的暗色/亮色模式支持，详细文档请参考 [主题系统文档](../core/theme/README.md)。

### 基础用法

```typescript
import { ThemeManager } from '@bsf/core';

const themeManager = ThemeManager.getInstance();
themeManager.setTheme('dark'); // 切换到暗色主题
```

### 自定义主题

```typescript
themeManager.configure({
  colors: {
    primaryColor: '#1890ff',
    successColor: '#52c41a'
  }
});
```

## 工具类

### 布局类

```scss
.bsf-flex           // display: flex
.bsf-inline-flex    // display: inline-flex
.bsf-grid          // display: grid
.bsf-block         // display: block
.bsf-hidden        // display: none

// Flex 布局
.bsf-flex-row      // flex-direction: row
.bsf-flex-col      // flex-direction: column
.bsf-flex-wrap     // flex-wrap: wrap
.bsf-flex-nowrap   // flex-wrap: nowrap

// 对齐
.bsf-items-start    // align-items: flex-start
.bsf-items-center   // align-items: center
.bsf-items-end      // align-items: flex-end

.bsf-justify-start  // justify-content: flex-start
.bsf-justify-center // justify-content: center
.bsf-justify-end    // justify-content: flex-end
.bsf-justify-between // justify-content: space-between
```

### 间距类

```scss
// Margin
.bsf-m-{size}      // margin: {size}
.bsf-mt-{size}     // margin-top: {size}
.bsf-mr-{size}     // margin-right: {size}
.bsf-mb-{size}     // margin-bottom: {size}
.bsf-ml-{size}     // margin-left: {size}
.bsf-mx-{size}     // margin-left: {size}; margin-right: {size}
.bsf-my-{size}     // margin-top: {size}; margin-bottom: {size}

// Padding
.bsf-p-{size}      // padding: {size}
.bsf-pt-{size}     // padding-top: {size}
.bsf-pr-{size}     // padding-right: {size}
.bsf-pb-{size}     // padding-bottom: {size}
.bsf-pl-{size}     // padding-left: {size}
.bsf-px-{size}     // padding-left: {size}; padding-right: {size}
.bsf-py-{size}     // padding-top: {size}; padding-bottom: {size}
```

### 文本类

```scss
// 文本对齐
.bsf-text-left     // text-align: left
.bsf-text-center   // text-align: center
.bsf-text-right    // text-align: right

// 文本大小
.bsf-text-xs       // font-size: var(--bsf-font-size-xs)
.bsf-text-sm       // font-size: var(--bsf-font-size-sm)
.bsf-text-base     // font-size: var(--bsf-font-size-base)
.bsf-text-lg       // font-size: var(--bsf-font-size-lg)
.bsf-text-xl       // font-size: var(--bsf-font-size-xl)

// 文本颜色
.bsf-text-primary  // color: var(--bsf-text-color-primary)
.bsf-text-regular  // color: var(--bsf-text-color-regular)
.bsf-text-secondary // color: var(--bsf-text-color-secondary)
```

### 边框类

```scss
.bsf-border        // border: 1px solid var(--bsf-border-color-base)
.bsf-border-t      // border-top: 1px solid var(--bsf-border-color-base)
.bsf-border-r      // border-right: 1px solid var(--bsf-border-color-base)
.bsf-border-b      // border-bottom: 1px solid var(--bsf-border-color-base)
.bsf-border-l      // border-left: 1px solid var(--bsf-border-color-base)

// 圆角
.bsf-rounded-sm    // border-radius: var(--bsf-radius-sm)
.bsf-rounded       // border-radius: var(--bsf-radius-base)
.bsf-rounded-lg    // border-radius: var(--bsf-radius-lg)
.bsf-rounded-full  // border-radius: var(--bsf-radius-circle)
```

### 大屏特有类

```scss
// 边框装饰
.bsf-border-decoration  // 添加发光边框效果

// 背景模糊
.bsf-backdrop-blur     // 背景模糊效果

// 卡片
.bsf-card             // 大屏卡片样式

// 动画
.bsf-animate-spin     // 旋转动画
.bsf-animate-pulse    // 脉冲动画
.bsf-animate-bounce   // 弹跳动画
```

## Sass 混入函数

### 布局相关

```scss
// 清除浮动
@include clearfix;

// Flex 布局
@include flex($direction: row, $justify: flex-start, $align: stretch);

// Grid 布局
@include grid($columns: 12, $gap: var(--bsf-spacing-base));
```

### 文本相关

```scss
// 文本省略
@include text-ellipsis;
@include text-ellipsis-multiple($lines: 2);

// 禁用文本选择
@include no-select;
```

### 滚动条

```scss
// 自定义滚动条样式
@include scrollbar($width: 6px, $thumb-color: rgba(0, 0, 0, 0.3));
```

## Element Plus 集成

样式系统提供了与 Element Plus 的无缝集成：

1. 启用 Element Plus 主题同步：

```typescript
themeManager.configure({
  enableElementPlus: true
});
```

2. 使用自定义变量覆盖 Element Plus 样式：

```scss
// vendors/element-plus.scss
:root {
  --el-color-primary: var(--bsf-color-primary);
  --el-text-color-primary: var(--bsf-text-color-primary);
  // ... 其他变量
}
```

## 最佳实践

1. **使用语义化的类名和变量**

```scss
// ✅ 好的做法
.card {
  @include flex(column);
  background: var(--bsf-bg-color-base);
}

// ❌ 避免这样做
.card {
  display: flex;
  flex-direction: column;
  background: #ffffff;
}
```

2. **保持一致的命名规范**

- 所有工具类以 `bsf-` 为前缀
- 使用 kebab-case 命名方式
- 遵循 `[前缀]-[属性]-[值]` 的模式

3. **模块化和组织**

- 相关的样式放在一起
- 使用 `@use` 而不是 `@import`
- 避免深层嵌套（最多3层）

4. **响应式设计**

```scss
.component {
  @include respond-to('sm') {
    // 小屏幕样式
  }

  @include respond-to('lg') {
    // 大屏幕样式
  }
}
```

5. **性能优化**

- 避免过度使用混入函数
- 合理使用选择器
- 避免不必要的嵌套

## 贡献指南

1. **添加新的工具类**

- 在 `utilities.scss` 中添加新类
- 遵循现有的命名规范
- 添加相应的文档注释

2. **添加新的混入函数**

- 在 `mixins.scss` 中添加
- 提供清晰的参数说明
- 考虑函数的复用性

3. **修改主题变量**

- 在 `_variables.scss` 中修改
- 确保在明暗两个主题中都有对应值
- 更新相关文档
