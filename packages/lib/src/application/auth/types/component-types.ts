import type { Component } from 'vue';

/**
 * 登录表单图标配置
 */
export interface LoginFormIcons {
  username: Component;
  password: Component;
}

/**
 * 登录表单配置
 */
export interface LoginFormConfig {
  title?: string;
  fields?: {
    username?: {
      label?: string;
      placeholder?: string;
    };
    password?: {
      label?: string;
      placeholder?: string;
    };
  };
  submitText?: string;
  icons?: LoginFormIcons;
  showRememberMe?: boolean;
  rememberMeText?: string;
}

/**
 * 登录页面配置
 */
export interface LoginPageConfig {
  title?: string;
  subtitle?: string;
  logo?: string;
  backgroundImage?: string;
  showFooter?: boolean;
  footerText?: string;
  footer?: string;
  redirectUrl?: string;
  formConfig?: LoginFormConfig;
}
