/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
  TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPIRES: 'token_expires',
  USER_INFO: 'user_info'
} as const;

/**
 * API路径常量
 */
export const API_PATHS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  USER_INFO: '/auth/user'
} as const;

/**
 * HTTP请求头常量
 */
export const HTTP_HEADERS = {
  AUTHORIZATION: 'Authorization',
  CSRF_TOKEN: 'X-CSRF-TOKEN'
} as const;

/**
 * 错误消息常量
 */
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: '用户名或密码错误',
  TOKEN_EXPIRED: '登录已过期，请重新登录',
  UNAUTHORIZED: '未经授权的访问',
  NETWORK_ERROR: '网络连接异常',
  MAX_LOGIN_ATTEMPTS: '登录尝试次数过多，请稍后再试',
  UNKNOWN_ERROR: '未知错误'
} as const;
