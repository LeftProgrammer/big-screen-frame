import { ref } from 'vue';
import type { ThemeVars, ThemeOptions, EPThemeVars, ThemeType, ThemeColors } from './types';
import { defaultTheme, darkTheme } from './presets';

export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme = ref<string>('light');
  private themes = new Map<string, ThemeVars>();
  private options = ref<ThemeOptions>({
    type: 'light',
    enableTransition: true,
    enableElementPlus: false
  });

  private constructor() {
    // 注册默认主题
    this.registerTheme('light', defaultTheme);
    this.registerTheme('dark', darkTheme);

    // 监听系统主题变化
    this.setupSystemThemeListener();
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  // 获取主题上下文
  getThemeContext() {
    return {
      type: this.currentTheme.value as ThemeType,
      enableTransition: this.options.value.enableTransition
    };
  }

  // 获取 CSS 变量
  get getCSSVars() {
    const theme = this.themes.get(this.currentTheme.value)!;
    const vars: Record<string, string> = {};

    // 转换主题变量为 CSS 变量
    const { colors, sizes, effects } = theme.bsf;

    // 处理颜色变量
    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        vars[`--bsf-color-${key}`] = value;
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          vars[`--bsf-color-${key}-${subKey}`] = subValue as string;
        });
      }
    });

    // 处理尺寸变量
    Object.entries(sizes).forEach(([key, value]) => {
      if (typeof value === 'string') {
        vars[`--bsf-size-${key}`] = value;
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          vars[`--bsf-size-${key}-${subKey}`] = subValue as string;
        });
      }
    });

    // 处理效果变量
    Object.entries(effects).forEach(([key, value]) => {
      if (typeof value === 'string') {
        vars[`--bsf-effect-${key}`] = value;
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          vars[`--bsf-effect-${key}-${subKey}`] = subValue as string;
        });
      }
    });

    return vars;
  }

  // 配置主题管理器
  configure(options: ThemeOptions) {
    this.options.value = { ...this.options.value, ...options };

    // 根据配置动态加载 Element Plus 样式
    if (options.enableElementPlus) {
      this.loadElementPlusStyles();
    }

    // 应用初始主题
    if (options.type) {
      this.setTheme(options.type);
    }

    // 应用自定义颜色
    if (options.colors) {
      this.updateThemeColors(options.colors);
    }
  }

  // 注册新主题
  registerTheme(name: string, vars: ThemeVars) {
    this.themes.set(name, vars);

    // 如果启用了 Element Plus，同步主题
    if (this.options.value.enableElementPlus && vars.ep) {
      this.syncElementPlusTheme(vars.ep);
    }
  }

  // 切换主题
  setTheme(name: ThemeType) {
    if (!this.themes.has(name)) {
      console.warn(`Theme ${name} not found, falling back to light theme`);
      name = 'light';
    }

    const oldTheme = this.currentTheme.value;
    this.currentTheme.value = name;

    // 更新 data-theme 属性
    document.documentElement.setAttribute('data-theme', name);

    // 应用主题过渡
    if (this.options.value.enableTransition) {
      document.documentElement.classList.add('bsf-theme-transition');
      window.setTimeout(() => {
        document.documentElement.classList.remove('bsf-theme-transition');
      }, 300);
    }

    // 应用 CSS 变量
    this.applyCssVars();

    // 触发主题变更事件
    this.emitThemeChangeEvent(oldTheme, name);
  }

  // 更新主题颜色
  updateThemeColors(colors: Partial<ThemeColors>) {
    const currentVars = this.themes.get(this.currentTheme.value)!;
    const updatedVars = {
      ...currentVars,
      bsf: {
        ...currentVars.bsf,
        colors: {
          ...currentVars.bsf.colors,
          ...colors
        }
      }
    };

    this.themes.set(this.currentTheme.value, updatedVars);
    this.applyCssVars();
  }

  // 获取当前主题
  getCurrentTheme() {
    return {
      type: this.currentTheme.value,
      vars: this.themes.get(this.currentTheme.value)!
    };
  }

  // 获取 CSS 变量值
  getCssVar(key: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(`--bsf-${key}`).trim();
  }

  // 私有方法：监听系统主题变化
  private setupSystemThemeListener() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const theme = e.matches ? 'dark' : 'light';
        if (this.options.value.type === 'system') {
          this.setTheme(theme);
        }
      };

      mediaQuery.addEventListener('change', handleChange);
    }
  }

  // 私有方法：加载 Element Plus 样式
  private loadElementPlusStyles() {
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = 'https://unpkg.com/element-plus/dist/index.css';
    document.head.appendChild(styleLink);
  }

  // 私有方法：同步 Element Plus 主题
  private syncElementPlusTheme(epTheme: EPThemeVars) {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --el-color-primary: ${epTheme.colors.primary};
        --el-color-success: ${epTheme.colors.success};
        --el-color-warning: ${epTheme.colors.warning};
        --el-color-danger: ${epTheme.colors.danger};
        --el-color-info: ${epTheme.colors.info};
      }
    `;
    document.head.appendChild(style);
  }

  // 私有方法：应用 CSS 变量
  private applyCssVars() {
    const root = document.documentElement;
    const vars = this.getCSSVars;

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  // 私有方法：触发主题变更事件
  private emitThemeChangeEvent(oldTheme: string, newTheme: string) {
    const event = new CustomEvent('bsf-theme-change', {
      detail: {
        oldTheme,
        newTheme,
        vars: this.themes.get(newTheme)!
      }
    });
    window.dispatchEvent(event);
  }
}
