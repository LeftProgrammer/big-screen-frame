import type { Component } from 'vue';

// 组件配置
export interface ComponentOptions {
  name: string;
  title?: string;
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  zIndex?: number;
  background?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  padding?: string;
  margin?: string;
  transform?: string;
  opacity?: number;
  setup: (options: any) => void;
  defaultConfig?: Record<string, any>;
}

// 组件注册信息
export interface ComponentRegisterInfo {
  name: string;
  component: Component;
  defaultConfig?: Record<string, any>;
}

// 插件注册信息
export interface PluginRegisterInfo {
  name: string;
  setup: (options: any) => void;
  defaultConfig?: Record<string, any>;
}

export interface ComponentSize {
  width: number;
  height: number;
}
