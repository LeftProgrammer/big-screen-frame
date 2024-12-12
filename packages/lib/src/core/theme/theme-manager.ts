import { useDark, useToggle } from '@vueuse/core';
import { watch, Ref } from 'vue';
import { darkTheme, lightTheme } from './presets';
import type { ThemeVars } from './types';

interface ThemeManagerOptions {
  // Add any options you want to support
}

export class ThemeManager {
  private static instance: ThemeManager;
  private isDark: Ref<boolean>;
  private toggleDark: () => boolean;

  constructor(options: ThemeManagerOptions = {}) {
    // 使用 VueUse 的 useDark 和 useToggle，配置为使用 Element Plus 的暗黑模式类名
    this.isDark = useDark({
      selector: 'html',
      attribute: 'class',
      valueDark: 'el-theme-dark',
      valueLight: 'el-theme-light',
      // 这里很重要：监听系统主题变化
      onChanged: (isDark: boolean) => {
        // 同步主题属性
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        // 触发主题变化事件
        window.dispatchEvent(new CustomEvent('themechange', { detail: { isDark } }));
      }
    });
    this.toggleDark = useToggle(this.isDark);
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  public getCurrentTheme(): ThemeVars {
    return this.isDark.value ? darkTheme : lightTheme;
  }

  public setTheme(theme: 'light' | 'dark' | 'system'): void {
    if (theme === 'system') {
      // 检查系统主题
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.isDark.value = prefersDark.matches;
      // 监听系统主题变化
      prefersDark.addEventListener('change', e => {
        this.isDark.value = e.matches;
      });
    } else {
      this.isDark.value = theme === 'dark';
    }
  }

  public toggleTheme(): void {
    this.toggleDark();
  }
}
