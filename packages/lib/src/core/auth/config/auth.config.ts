import type { AuthConfig } from '../types/auth.types';

/**
 * 默认认证配置
 */
export const defaultAuthConfig: AuthConfig = {
  // 基础配置
  baseURL: '/api',
  tokenKey: 'access_token',
  tokenPrefix: 'Bearer',

  // 认证选项
  autoRefreshToken: true,
  tokenRefreshThreshold: 300, // 5分钟

  // 安全配置
  enableCSRF: true,
  maxLoginAttempts: 5,

  // 存储键名配置
  storageKeys: {
    token: 'access_token',
    refreshToken: 'refresh_token',
    tokenExpires: 'token_expires',
    userInfo: 'user_info'
  },

  // API路径配置
  apiPaths: {
    login: '/auth/login',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
    userInfo: '/auth/user'
  },

  // HTTP请求头配置
  httpHeaders: {
    authorization: 'Authorization',
    csrfToken: 'X-CSRF-TOKEN'
  },

  // 错误消息配置
  errorMessages: {
    invalidCredentials: '用户名或密码错误',
    tokenExpired: '登录已过期，请重新登录',
    unauthorized: '未经授权的访问',
    networkError: '网络连接异常',
    maxLoginAttempts: '登录尝试次数过多，请稍后再试',
    unknownError: '未知错误'
  }
};

/**
 * 合并用户配置和默认配置
 */
export function mergeAuthConfig(userConfig: Partial<AuthConfig>): AuthConfig {
  return {
    ...defaultAuthConfig,
    ...userConfig,
    // 深度合并对象配置
    storageKeys: {
      ...defaultAuthConfig.storageKeys,
      ...userConfig.storageKeys
    },
    apiPaths: {
      ...defaultAuthConfig.apiPaths,
      ...userConfig.apiPaths
    },
    httpHeaders: {
      ...defaultAuthConfig.httpHeaders,
      ...userConfig.httpHeaders
    },
    errorMessages: {
      ...defaultAuthConfig.errorMessages,
      ...userConfig.errorMessages
    }
  };
}
