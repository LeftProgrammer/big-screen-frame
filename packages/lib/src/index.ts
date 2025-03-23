import type { App } from 'vue'

// 核心模块
import * as coreHttp from './core/http'
import * as coreLayout from './core/layout'
import * as coreStore from './core/store'
import * as coreTheme from './core/theme'
import * as coreUtils from './core/utils'
import * as coreEvents from './core/events'
import * as coreTransition from './core/transition'

// 应用层模块
import * as appAuth from './application/auth'
import * as appRouter from './application/router'
import * as appSse from './application/sse'
import * as appWebsocket from './application/websocket'
import * as appError from './application/error'

// 组件模块
import * as componentsCard from './components/card'
import * as componentsEcharts from './components/echarts'
import * as componentsLoading from './components/loading'
import * as componentsNumberFlip from './components/number-flip'
import * as componentsScrollList from './components/scroll-list'
// 直接导入default-pages组件
import BasicDashboard from './components/default-pages/BasicDashboard.vue'
import BasicLogin from './components/default-pages/BasicLogin.vue' 
import BasicNotFound from './components/default-pages/BasicNotFound.vue'

// 命名空间导出
export const $http = coreHttp
export const $layout = coreLayout
export const $store = coreStore
export const $theme = coreTheme
export const $utils = coreUtils
export const $events = coreEvents
export const $transition = coreTransition

export const $auth = appAuth
export const $router = appRouter
export const $sse = appSse
export const $websocket = appWebsocket
export const $error = appError

export const $components = {
  card: componentsCard,
  echarts: componentsEcharts,
  loading: componentsLoading,
  numberFlip: componentsNumberFlip,
  scrollList: componentsScrollList,
  defaultPages: {
    BasicDashboard,
    BasicLogin,
    BasicNotFound
  }
}

// 为了向后兼容，继续导出原始模块
export * from './core'
export * from './components'
export * from './application'

// Plugin install function
export function install(app: App): void {
  // Install core modules
  app.config.globalProperties.$version = '1.0.0'
  console.log('Library installed')
}
