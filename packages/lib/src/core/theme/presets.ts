import type { ThemeVars } from './types';

// 亮色主题
export const lightTheme: ThemeVars = {
  // 颜色系统
  'color-primary': '#409EFF',
  'color-success': '#67C23A',
  'color-warning': '#E6A23C',
  'color-danger': '#F56C6C',
  'color-info': '#909399',

  // 文本颜色
  'text-color-primary': '#303133',
  'text-color-regular': '#606266',
  'text-color-secondary': '#909399',
  'text-color-placeholder': '#C0C4CC',

  // 边框颜色
  'border-color-base': '#DCDFE6',
  'border-color-light': '#E4E7ED',
  'border-color-lighter': '#EBEEF5',
  'border-color-extra-light': '#F2F6FC',

  // 背景颜色
  'bg-color-base': '#FFFFFF',
  'bg-color-overlay': '#FFFFFF',
  'bg-color-page': '#F2F3F5',
  'bg-color-screen': '#000000',

  // 阴影
  'shadow-base': '0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04)',
  'shadow-light': '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
  'shadow-lighter': '0 2px 12px 0 rgba(0, 0, 0, 0.06)'
};

// 暗色主题
export const darkTheme: ThemeVars = {
  // 颜色系统
  'color-primary': '#409EFF',
  'color-success': '#67C23A',
  'color-warning': '#E6A23C',
  'color-danger': '#F56C6C',
  'color-info': '#909399',

  // 文本颜色
  'text-color-primary': '#E5EAF3',
  'text-color-regular': '#CFD3DC',
  'text-color-secondary': '#A3A6AD',
  'text-color-placeholder': '#8D9095',

  // 边框颜色
  'border-color-base': '#4C4D4F',
  'border-color-light': '#363637',
  'border-color-lighter': '#2B2B2C',
  'border-color-extra-light': '#1F1F20',

  // 背景颜色
  'bg-color-base': '#141414',
  'bg-color-overlay': '#1D1E1F',
  'bg-color-page': '#0A0A0A',
  'bg-color-screen': '#000000',

  // 阴影
  'shadow-base': '0 2px 4px rgba(0, 0, 0, 0.24), 0 0 6px rgba(0, 0, 0, 0.12)',
  'shadow-light': '0 2px 12px 0 rgba(0, 0, 0, 0.3)',
  'shadow-lighter': '0 2px 12px 0 rgba(0, 0, 0, 0.2)'
};
