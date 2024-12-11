import { useDark, useToggle } from '@vueuse/core';
import { watch } from 'vue';
import { darkTheme, lightTheme } from './presets';
import type { ThemeVars } from './types';

export class ThemeManager {
  private static instance: ThemeManager;
  private isDark = useDark();
  private toggleDark = useToggle(this.isDark);

  private constructor() {
    this.init();
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  private init() {
    // 初始化时应用主题变量
    this.applyThemeVars(this.isDark.value);

    // 监听主题变化
    watch(this.isDark, isDark => {
      this.applyThemeVars(isDark);
    });
  }

  private applyThemeVars(isDark: boolean) {
    const vars = isDark ? darkTheme : lightTheme;
    const html = document.documentElement;

    // 设置主题类型
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // 应用主题变量
    Object.entries(vars).forEach(([key, value]) => {
      html.style.setProperty(`--bsf-${key}`, value);
    });

    // 同步 Element Plus 主题变量
    this.syncElementPlusVars(vars);
  }

  private syncElementPlusVars(vars: ThemeVars) {
    const html = document.documentElement;
    const elVars = {
      // 主色系
      '--el-color-primary': vars['color-primary'],
      '--el-color-success': vars['color-success'],
      '--el-color-warning': vars['color-warning'],
      '--el-color-danger': vars['color-danger'],
      '--el-color-info': vars['color-info'],

      // 文本颜色
      '--el-text-color-primary': vars['text-color-primary'],
      '--el-text-color-regular': vars['text-color-regular'],
      '--el-text-color-secondary': vars['text-color-secondary'],
      '--el-text-color-placeholder': vars['text-color-placeholder'],

      // 边框颜色
      '--el-border-color': vars['border-color-base'],
      '--el-border-color-light': vars['border-color-light'],
      '--el-border-color-lighter': vars['border-color-lighter'],
      '--el-border-color-extra-light': vars['border-color-extra-light'],

      // 背景颜色
      '--el-bg-color': vars['bg-color-base'],
      '--el-bg-color-overlay': vars['bg-color-overlay'],
      '--el-bg-color-page': vars['bg-color-page'],

      // 阴影
      '--el-box-shadow': vars['shadow-base'],
      '--el-box-shadow-light': vars['shadow-light'],
      '--el-box-shadow-lighter': vars['shadow-lighter']
    };

    Object.entries(elVars).forEach(([key, value]) => {
      html.style.setProperty(key, value);
    });
  }

  public toggleTheme() {
    this.toggleDark();
  }

  public setTheme(isDark: boolean) {
    this.isDark.value = isDark;
  }

  public getCurrentTheme(): ThemeVars {
    return this.isDark.value ? darkTheme : lightTheme;
  }
}
