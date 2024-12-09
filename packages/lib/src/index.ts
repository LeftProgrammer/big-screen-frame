import type { App } from 'vue'

// 导出核心功能
export * from './core'

// 导出组件
export * from './components'

// 导出应用层
export * from './application'

// Plugin install function
export function install(app: App): void {
  // Install core modules
  app.config.globalProperties.$version = '1.0.0'
  console.log('Library installed')
}
