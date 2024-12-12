// 缩放模式
export type ScaleMode = 'fit' | 'stretch' | 'uniform';

// 对齐方式
export type AlignType = 'center' | 'top' | 'bottom' | 'left' | 'right';

// 主题类型
export type ThemeType = 'light' | 'dark' | 'custom';

// 网格配置
export interface GridOptions {
  enabled: boolean;
  size: number;
  color?: string;
  opacity?: number;
  showGuides?: boolean;
}

// 手势配置
export interface GestureOptions {
  enabled: boolean;
  minScale?: number;
  maxScale?: number;
  scaleSensitivity?: number;
  dragEnabled?: boolean;
}

// 快捷键配置
export interface ShortcutOptions {
  enabled: boolean;
  zoomIn?: string;
  zoomOut?: string;
  reset?: string;
  toggleFullscreen?: string;
}

// 导航器配置
export interface NavigatorOptions {
  enabled: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  width?: number;
  height?: number;
  opacity?: number;
}

// 高级配置选项
export interface AdvancedOptions {
  grid?: GridOptions;
  gestures?: GestureOptions;
  shortcuts?: ShortcutOptions;
  navigator?: NavigatorOptions;
  smoothScaling?: boolean;
  scaleStep?: number;
  transitionDuration?: number;
  debounceDelay?: number;
  className?: string;
}

// 组件实例方法
export interface ScaleScreenMethods {
  reset: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setScale: (scale: number) => void;
  toggleFullscreen: () => Promise<void>;
  getSnapshot: () => Promise<string>;
}

// 组件事件
export interface ScaleScreenEvents {
  onScale: (scale: number) => void;
  onModeChange: (mode: ScaleMode) => void;
  onAlignChange: (horizontal: AlignType, vertical: AlignType) => void;
  onFullscreenChange: (isFullscreen: boolean) => void;
  onResize: (width: number, height: number) => void;
}

// 组件属性
export interface ScaleScreenProps {
  // 基础属性
  width: number;
  height: number;
  mode?: ScaleMode;
  alignX?: AlignType;
  alignY?: AlignType;
  autoResize?: boolean;
  theme?: ThemeType;

  // 缩放限制
  minScale?: number;
  maxScale?: number;

  // 高级配置
  options?: AdvancedOptions;
}

// 组件实例类型
export type ScaleScreenInstance = ScaleScreenMethods & {
  props: ScaleScreenProps;
};
