import { computed, watchEffect, inject, provide } from 'vue';
import type { ThemeContext, ThemeType } from './types';
import { ThemeManager } from './theme-manager';

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
  const themeManager = ThemeManager.getInstance();

  // 当前主题的CSS变量
  const cssVars = computed(() => themeManager.getCSSVars);

  // 应用CSS变量到根元素
  watchEffect(() => {
    const root = document.documentElement;
    Object.entries(cssVars.value).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(key, value);
      }
    });
  });

  // 返回主题相关的方法和属性
  return {
    // 切换主题
    setTheme: (name: ThemeType) => themeManager.setTheme(name),
    // 注册新主题
    registerTheme: themeManager.registerTheme.bind(themeManager),
    // 配置主题管理器
    configure: themeManager.configure.bind(themeManager),
    // 当前主题的CSS变量
    cssVars
  };
}
