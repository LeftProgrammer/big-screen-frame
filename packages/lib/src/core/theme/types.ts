// 主题类型定义
export type ThemeType = 'dark' | 'light' | string;

// 颜色变量定义
export interface ThemeColors {
  // 品牌色
  primaryColor: string;
  successColor: string;
  warningColor: string;
  dangerColor: string;
  infoColor: string;

  // 文字颜色
  textPrimary: string;
  textRegular: string;
  textSecondary: string;
  textPlaceholder: string;

  // 边框颜色
  borderColorBase: string;
  borderColorLight: string;
  borderColorLighter: string;
  borderColorExtraLight: string;

  // 背景颜色
  bgColor: string;
  bgColorLight: string;
  bgColorLighter: string;
  bgColorExtraLight: string;
}

// 主题相关的类型定义
export interface ThemeColorVars {
  primary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  text: {
    primary: string;
    regular: string;
    secondary: string;
    placeholder: string;
  };
  border: {
    base: string;
    light: string;
    lighter: string;
    extra_light: string;
  };
  background: {
    base: string;
    light: string;
    lighter: string;
  };
  chart: string[];
}

export interface ThemeSizeVars {
  font: {
    xs: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    xs: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
  };
  radius: {
    sm: string;
    base: string;
    lg: string;
    round: string;
    circle: string;
  };
}

export interface ThemeEffectVars {
  shadow: {
    base: string;
    light: string;
    dark: string;
  };
  border: {
    decoration: {
      color: string;
      glow: string;
    };
  };
  transition: {
    fast: string;
    base: string;
    slow: string;
  };
}

export interface BSFThemeVars {
  colors: ThemeColorVars;
  sizes: ThemeSizeVars;
  effects: ThemeEffectVars;
}

// Element Plus 主题变量（可选）
export interface EPThemeVars {
  colors: {
    primary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    // ... 其他 Element Plus 颜色变量
  };
  // ... 其他 Element Plus 变量
}

export interface ThemeVars {
  bsf: BSFThemeVars;
  ep?: EPThemeVars;
}

// 主题配置选项
export interface ThemeOptions {
  type: ThemeType;
  colors?: Partial<ThemeColors>;
  cssVars?: Record<string, string>;
  enableTransition?: boolean;
  enableElementPlus?: boolean;
}

// 主题上下文
export interface ThemeContext {
  currentTheme: ThemeType;
  colors: ThemeColors;
  cssVars: Record<string, string>;
  // 切换主题
  changeTheme: (theme: ThemeType) => void;
  // 更新主题配置
  updateTheme: (options: Partial<ThemeOptions>) => void;
  // 获取CSS变量值
  getCssVar: (key: string) => string;
}
