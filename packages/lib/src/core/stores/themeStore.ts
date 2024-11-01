// stores/themeStore.ts
import { defineStore } from 'pinia';
import ThemeSwitcher from '@/core/theme/theme-switcher';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'light-theme',
  }),
  actions: {
    initTheme(customThemes?: { light?: ThemeConfig; dark?: ThemeConfig }) {
      ThemeSwitcher.initTheme(customThemes);
    },
    toggleTheme() {
      this.theme = this.theme === 'light-theme' ? 'dark-theme' : 'light-theme';
      ThemeSwitcher.setTheme(this.theme);
    },
  },
});
