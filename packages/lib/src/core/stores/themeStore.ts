// src/store/themeStore.ts

import { defineStore } from 'pinia';

interface ThemeState {
  isDarkMode: boolean;
  primaryColor: string; // 允许开发人员配置主题色
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    isDarkMode: false,  // 默认是亮色模式
    primaryColor: '#007bff', // 默认主色
  }),
  actions: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.updateTheme(); // 更新主题样式
    },
    setPrimaryColor(color: string) {
      this.primaryColor = color;  // 允许开发人员设置主色
      this.updateTheme(); // 更新主题样式
    },
    updateTheme() {
      const root = document.documentElement;
      if (this.isDarkMode) {
        // 更新暗色模式样式
        root.style.setProperty('--primary-color', this.primaryColor || '#1e90ff');
        root.style.setProperty('--secondary-color', '#343a40');
        root.style.setProperty('--background-color', '#121212');
        root.style.setProperty('--text-color', '#f1f1f1');
      } else {
        // 更新亮色模式样式
        root.style.setProperty('--primary-color', this.primaryColor || '#007bff');
        root.style.setProperty('--secondary-color', '#6c757d');
        root.style.setProperty('--background-color', '#ffffff');
        root.style.setProperty('--text-color', '#333');
      }
    },
  },
});
