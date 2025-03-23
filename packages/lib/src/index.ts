import type { App } from 'vue'

// 核心模块
import * as coreHttp from './core/http'
import * as coreLayout from './core/layout'
import * as coreStore from './core/store'
import * as coreTheme from './core/theme'
import * as coreUtils from './core/utils'
import * as coreEvents from './core/events'
import * as coreTransition from './core/transition'

// 应用层模块 - 延迟导入auth，避免在Pinia初始化前访问store
// import * as appAuth from './application/auth'
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

// 明确导出类型，确保使用者可以通过TypeScript导入
export type {
  HttpClientConfig,
  RequestConfig,
  ResponseData,
  HttpMethod,
  UploadConfig,
  DownloadConfig,
  PollingConfig,
  ProgressEvent,
  HttpInterceptor,
  RetryOptions
} from './core/http/types';
export type { RetryOptions as RetryStrategyOptions } from './core/http/retry-strategy';

// 命名空间导出
export const $http = coreHttp.http
export const $layout = coreLayout
export const $store = coreStore
export const $theme = coreTheme
export const $utils = coreUtils
export const $events = coreEvents
export const $transition = coreTransition

// 对于auth模块，使用一个懒加载函数，避免过早访问Pinia
import type { LoginPageConfig, LoginFormConfig } from './application/auth/types/component-types';

export const $auth = {
  // 异步加载模块，避免在导入时就初始化
  async useAuth(...args: any[]) {
    const authModule = await import('./application/auth');
    return authModule.useAuth(...args);
  },
  async login(username: string, password: string) {
    const authModule = await import('./application/auth');
    return authModule.login(username, password);
  },
  async logout() {
    const authModule = await import('./application/auth');
    return authModule.logout();
  },
  async getUser() {
    const authModule = await import('./application/auth');
    return authModule.getUser();
  },
  async getToken() {
    const authModule = await import('./application/auth');
    return authModule.getToken();
  },
  async setToken(token: string) {
    const authModule = await import('./application/auth');
    return authModule.setToken(token);
  },
  async setUser(user: any) {
    const authModule = await import('./application/auth');
    return authModule.setUser(user);
  },
  // 获取组件，这些可以安全导出，因为它们不依赖Pinia
  LoginPage: async () => {
    const authModule = await import('./application/auth');
    return authModule.LoginPage;
  },
  LoginForm: async () => {
    const authModule = await import('./application/auth');
    return authModule.LoginForm;
  }
}

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
