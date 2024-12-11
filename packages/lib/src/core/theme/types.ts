// 主题类型定义
export type ThemeType = 'dark' | 'light' | string;

// 主题变量类型定义
export interface ThemeVars {
  // 颜色系统
  'color-primary': string;
  'color-success': string;
  'color-warning': string;
  'color-danger': string;
  'color-info': string;

  // 文本颜色
  'text-color-primary': string;
  'text-color-regular': string;
  'text-color-secondary': string;
  'text-color-placeholder': string;

  // 边框颜色
  'border-color-base': string;
  'border-color-light': string;
  'border-color-lighter': string;
  'border-color-extra-light': string;

  // 背景颜色
  'bg-color-base': string;
  'bg-color-overlay': string;
  'bg-color-page': string;
  'bg-color-screen': string;

  // 阴影
  'shadow-base': string;
  'shadow-light': string;
  'shadow-lighter': string;
}

// 主题配置选项
export interface ThemeOptions {
  type: ThemeType;
  cssVars?: Record<string, string>;
  enableTransition?: boolean;
  transitionDuration?: number; // 过渡动画持续时间（毫秒）
  enableElementPlus?: boolean;
}

// 主题上下文
export interface ThemeContext {
  currentTheme: ThemeType;
  cssVars: Record<string, string>;
  enableTransition: boolean;
  transitionDuration: number;
  // 切换主题
  changeTheme: (theme: ThemeType) => void;
  // 更新主题配置
  updateTheme: (options: Partial<ThemeOptions>) => void;
  // 获取CSS变量值
  getCssVar: (key: string) => string;
  // 设置过渡动画
  setTransition: (enable: boolean, duration?: number) => void;
}
