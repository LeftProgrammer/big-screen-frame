/**
 * 核心模块接口定义
 */

// 布局接口
export interface LayoutOptions {
  /** 布局类型 */
  type?: 'fixed' | 'responsive'
  /** 设计稿宽度 */
  width?: number
  /** 设计稿高度 */
  height?: number
}

// 主题接口
export interface ThemeOptions {
  /** 主题名称 */
  name?: string
  /** 主题变量 */
  variables?: Record<string, string>
}

// 事件接口
export interface EventOptions {
  /** 事件名称 */
  name: string
  /** 事件处理函数 */
  handler: (...args: any[]) => void
}

// Store接口
export interface StoreOptions {
  /** Store ID */
  id: string
  /** Store 状态 */
  state?: Record<string, any>
}

// 工具函数接口
export interface Utils {
  /** 版本号 */
  version: string
  /** 调试模式 */
  debug?: boolean
}
