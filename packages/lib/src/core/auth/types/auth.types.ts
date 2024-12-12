import type { AxiosError } from 'axios';

/**
 * 认证配置接口
 */
export interface AuthConfig {
  // 基础配置
  baseURL?: string;
  tokenKey?: string;
  tokenPrefix?: string;

  // 认证选项
  autoRefreshToken?: boolean;
  tokenRefreshThreshold?: number; // Token 刷新阈值（秒）

  // 安全配置
  enableCSRF?: boolean;
  maxLoginAttempts?: number;

  // 存储键名配置
  storageKeys?: {
    token?: string;
    refreshToken?: string;
    tokenExpires?: string;
    userInfo?: string;
  };

  // API路径配置
  apiPaths?: {
    login?: string;
    logout?: string;
    refreshToken?: string;
    userInfo?: string;
  };

  // HTTP请求头配置
  httpHeaders?: {
    authorization?: string;
    csrfToken?: string;
  };

  // 错误消息配置
  errorMessages?: {
    invalidCredentials?: string;
    tokenExpired?: string;
    unauthorized?: string;
    networkError?: string;
    maxLoginAttempts?: string;
    unknownError?: string;
  };

  // 自定义服务
  customServices?: {
    authService?: new (config: AuthConfig) => IAuthService;
    tokenService?: new (config: AuthConfig) => ITokenService;
  };

  // 认证钩子
  hooks?: {
    beforeLogin?: (params: LoginParams) => Promise<LoginParams | boolean>;
    afterLogin?: (userInfo: UserInfo) => Promise<void>;
    beforeLogout?: () => Promise<boolean>;
    afterLogout?: () => Promise<void>;
  };

  // 权限相关配置
  permission?: {
    // 权限检查函数
    checkPermission?: (permission: string | string[]) => boolean;
    // 角色检查函数
    checkRole?: (role: string | string[]) => boolean;
  };

  // 路由相关配置
  router?: {
    // 登录页路由
    loginPath?: string;
    // 登录成功后跳转路由
    homePath?: string;
    // 白名单路由（无需认证）
    whiteList?: string[];
  };

  // 第三方登录配置
  thirdParty?: {
    // 支持的第三方登录类型
    providers?: string[];
    // 处理第三方登录回调
    handleCallback?: (provider: string, params: Record<string, any>) => Promise<void>;
  };

  // 请求配置
  request?: {
    // 公开API路径前缀或匹配规则
    publicPaths?: (string | RegExp)[];
    // 请求重试次数（用于token刷新后重试）
    retryCount?: number;
  };

  // Token同步配置
  tokenSync?: {
    // 是否启用多标签页同步
    enabled?: boolean;
    // 同步方式：'localStorage' | 'broadcastChannel'
    method?: string;
    // 同步事件名称
    eventName?: string;
  };
}

/**
 * 认证服务接口
 */
export interface IAuthService {
  login(params: LoginParams): Promise<void>;
  logout(): Promise<void>;
  refreshToken(): Promise<void>;
  getCurrentUser(): Promise<UserInfo>;
  checkAuth(): boolean;
}

/**
 * Token服务接口
 */
export interface ITokenService {
  setToken(tokenInfo: TokenInfo): void;
  getToken(): string | null;
  getRefreshToken(): string | null;
  getTokenExpires(): number | null;
  clearToken(): void;
  needsRefresh(): boolean;
  formatToken(token: string): string;
}

/**
 * 用户登录参数
 */
export interface LoginParams {
  username: string;
  password: string;
  [key: string]: any;
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string | number;
  username: string;
  roles?: string[];
  permissions?: string[];
  [key: string]: any;
}

/**
 * Token信息接口
 */
export interface TokenInfo {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

/**
 * 认证错误类型
 */
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN'
}

/**
 * 认证错误接口
 */
export interface AuthError {
  type: AuthErrorType;
  message: string;
  originalError?: AxiosError | Error;
}

/**
 * 认证状态
 */
export interface AuthState {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: AuthError | null;
}
