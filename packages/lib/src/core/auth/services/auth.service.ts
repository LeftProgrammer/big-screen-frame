import type {
  AuthConfig,
  LoginParams,
  UserInfo,
  TokenInfo,
  AuthError,
  IAuthService
} from '../types/auth.types';
import { AuthErrorType } from '../types/auth.types';
import { TokenService } from './token.service';
import { ServiceFactory } from './service-factory';
import { http } from '@lib/core/http';
import { useAuthStore } from '@lib/core/store';

/**
 * 认证服务
 */
export class AuthService implements IAuthService {
  private static instance: AuthService;
  private config: AuthConfig;
  private tokenService: TokenService;
  private loginAttempts: number = 0;
  private store = useAuthStore();

  private constructor(config: AuthConfig) {
    this.config = config;
    this.tokenService = ServiceFactory.createTokenService(config);
  }

  public static getInstance(config: AuthConfig): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService(config);
    }
    return AuthService.instance;
  }

  /**
   * 用户登录
   */
  public async login(params: LoginParams): Promise<void> {
    try {
      if (this.loginAttempts >= this.config.maxLoginAttempts!) {
        throw this.createError(AuthErrorType.UNAUTHORIZED, '登录尝试次数过多，请稍后再试');
      }

      const response = await http.post<TokenInfo & { user: UserInfo }>('/auth/login', params);

      const { token, refreshToken, expires, user } = response.data;

      // 保存Token信息
      this.tokenService.setToken({ token, refreshToken, expires });

      // 更新认证状态
      this.store.setAuthenticated(true);
      this.store.setUserInfo(user);

      // 重置登录尝试次数
      this.loginAttempts = 0;
    } catch (error: any) {
      this.loginAttempts++;
      throw this.handleError(error);
    }
  }

  /**
   * 第三方登录
   */
  public async thirdPartyLogin(provider: string, params: Record<string, any>): Promise<void> {
    if (!this.config.thirdParty?.handleCallback) {
      throw new Error('Third party login callback handler not configured');
    }
    await this.config.thirdParty.handleCallback(provider, params);
  }

  /**
   * 检查权限
   */
  public checkPermission(permission: string | string[]): boolean {
    if (this.config.permission?.checkPermission) {
      return this.config.permission.checkPermission(permission);
    }
    const userPermissions = this.store.userInfo?.permissions || [];
    const requiredPermissions = Array.isArray(permission) ? permission : [permission];
    return requiredPermissions.every(p => userPermissions.includes(p));
  }

  /**
   * 检查角色
   */
  public checkRole(role: string | string[]): boolean {
    if (this.config.permission?.checkRole) {
      return this.config.permission.checkRole(role);
    }
    const userRoles = this.store.userInfo?.roles || [];
    const requiredRoles = Array.isArray(role) ? role : [role];
    return requiredRoles.some(r => userRoles.includes(r));
  }

  /**
   * 检查API是否为公开接口
   */
  public isPublicPath(path: string): boolean {
    const publicPaths = this.config.request?.publicPaths || [];
    return publicPaths.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(path);
      }
      return path.startsWith(pattern);
    });
  }

  /**
   * 防止重复登录检查
   */
  public shouldRedirectToHome(): boolean {
    if (!this.config.router?.homePath) return false;
    return this.checkAuth() && window.location.pathname === this.config.router.loginPath;
  }

  /**
   * 用户登出
   */
  public async logout(): Promise<void> {
    try {
      await http.post('/auth/logout');
    } finally {
      this.tokenService.clearToken();
      this.store.reset();
    }
  }

  /**
   * 刷新Token
   */
  public async refreshToken(): Promise<void> {
    try {
      const refreshToken = this.tokenService.getRefreshToken();
      if (!refreshToken) {
        throw this.createError(AuthErrorType.TOKEN_EXPIRED, 'Refresh token not found');
      }

      const response = await http.post<TokenInfo>('/auth/refresh', {
        refreshToken
      });

      const { token, expires } = response.data;
      this.tokenService.setToken({ token, refreshToken, expires });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * 获取当前用户信息
   */
  public async getCurrentUser(): Promise<UserInfo> {
    try {
      const response = await http.get<UserInfo>('/auth/user');
      this.store.setUserInfo(response.data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * 检查认证状态
   */
  public checkAuth(): boolean {
    const token = this.tokenService.getToken();
    return !!token;
  }

  /**
   * 创建认证错误
   */
  private createError(type: AuthErrorType, message: string, originalError?: any): AuthError {
    return {
      type,
      message,
      originalError
    };
  }

  /**
   * 处理认证错误
   */
  private handleError(error: any): AuthError {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return this.createError(AuthErrorType.UNAUTHORIZED, '未授权或Token已过期', error);
        case 403:
          return this.createError(AuthErrorType.UNAUTHORIZED, '没有访问权限', error);
        default:
          return this.createError(AuthErrorType.UNKNOWN, '认证服务异常', error);
      }
    }

    if (error.request) {
      return this.createError(AuthErrorType.NETWORK_ERROR, '网络连接异常', error);
    }

    return this.createError(AuthErrorType.UNKNOWN, error.message || '未知错误', error);
  }
}
