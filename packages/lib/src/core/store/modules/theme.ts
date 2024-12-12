import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ThemeType } from '../../theme/types';
import { ThemeManager } from '../../theme/theme-manager';

export const useThemeStore = defineStore('bsf-theme', () => {
  const themeManager = ThemeManager.getInstance();
  const theme = ref<ThemeType>('light');

  // 计算属性
  const isDark = computed(() => theme.value === 'dark');

  // Actions
  function setTheme(newTheme: ThemeType) {
    theme.value = newTheme;
    themeManager.setTheme(newTheme as 'light' | 'dark' | 'system');
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light');
  }

  return {
    // 状态
    theme,
    isDark,
    // 方法
    setTheme,
    toggleTheme
  };
});
