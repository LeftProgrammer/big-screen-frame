import { computed, watchEffect, inject, provide } from 'vue';
import type { ThemeContext, ThemeType } from './types';
import { ThemeManager } from './theme-manager';
import { useDark } from '@vueuse/core';

const THEME_CONTEXT_KEY = Symbol('theme-context');

// 提供主题上下文
export const provideTheme = () => {
  const themeManager = ThemeManager.getInstance();
  const themeContext = themeManager.getThemeContext();
  provide(THEME_CONTEXT_KEY, themeContext);
  return themeContext;
};

// 使用主题上下文
export const useThemeContext = (): ThemeContext => {
  const themeContext = inject<ThemeContext>(THEME_CONTEXT_KEY);
  if (!themeContext) {
    throw new Error('useThemeContext must be used after provideTheme');
  }
  return themeContext;
};

// 创建Vue Composable函数，提供主题相关的功能
export function useTheme() {
  const isDark = useDark();
  const themeManager = ThemeManager.getInstance();

  return {
    isDark,
    toggleTheme: () => themeManager.toggleTheme(),
    setTheme: (dark: boolean) => themeManager.setTheme(dark)
  };
}
