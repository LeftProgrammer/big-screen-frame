import { ServiceFactory } from './service-factory';
import { http } from '../../../core/http';
import { TokenService } from './token.service';
import {
  AuthConfig,
  IAuthService,
  LoginParams,
  UserInfo,
  TokenInfo,
  AuthErrorType,
  AuthError,
  JeecgResponse,
  LoginResult
} from '../types/auth.types';
import { useAuthStore } from '../../../core/store';

/**
 * 认证服务
 */
export class AuthService implements IAuthService {
  private static instance: AuthService;
  public config: AuthConfig;
  private tokenService: TokenService;
  private loginAttempts: number = 0;
  private _store: ReturnType<typeof useAuthStore> | null = null;

  private get store(): ReturnType<typeof useAuthStore> {
    if (!this._store) {
      try {
        this._store = useAuthStore();
      } catch (error) {
        console.error('Failed to get auth store:', error);
        throw new Error('Authentication store is not available. Make sure Pinia is properly initialized before using authentication services.');
      }
    }
    return this._store;
  }

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
   * 支持多种API响应格式，更灵活地处理不同后端系统返回的数据结构
   */
  public async login(params: LoginParams): Promise<JeecgResponse<LoginResult>> {
    try {
      if (this.loginAttempts >= this.config.maxLoginAttempts!) {
        throw this.createError(AuthErrorType.UNAUTHORIZED, '登录尝试次数过多，请稍后再试');
      }

      // 获取接口配置
      const loginEndpoint = this.config.endpoints?.login || '/sys/login';
      const response = await http.post<any>(loginEndpoint, params);
      const responseData = response.data;
      
      console.log('登录原始响应:', responseData);
      
      // 检查登录是否成功 - 现在支持多种响应格式
      if (this.isLoginSuccessful(responseData)) {
        console.log('登录成功，开始处理响应数据');
        
        // 提取token和用户信息 - 支持多种数据结构
        const { extractedToken, extractedUserInfo } = this.extractLoginData(responseData);
        
        if (extractedToken) {
          // 保存Token信息
          this.tokenService.setToken({ token: extractedToken });

          // 如果有用户信息，则更新
          if (extractedUserInfo) {
            this.store.setUserInfo(extractedUserInfo);
          }
          
          this.store.setAuthenticated(true);
          
          // 重置登录尝试次数
          this.loginAttempts = 0;
          
          // 返回统一格式的响应
          return {
            success: true,
            code: typeof responseData.code !== 'undefined' ? responseData.code : 200,
            message: responseData.message || '登录成功',
            result: {
              token: extractedToken,
              userInfo: extractedUserInfo || {
                id: params.username || '',
                username: params.username || ''
              }
            },
            timestamp: responseData.timestamp || Date.now()
          };
        } else {
          // 登录成功但未找到token - 生成一个临时token
          console.warn('登录响应中未找到token，创建临时token');
          
          // 创建一个临时token (使用时间戳和用户名的组合)
          const tempToken = `temp_${Date.now()}_${params.username}`;
          this.tokenService.setToken({ token: tempToken });
          
          // 创建最小用户信息
          const minUserInfo = {
            id: params.username || '',
            username: params.username || ''
          };
          
          this.store.setUserInfo(minUserInfo);
          this.store.setAuthenticated(true);
          this.loginAttempts = 0;
          
          // 返回带有临时token的响应
          return {
            success: true,
            code: 200,
            message: '登录成功(临时凭证)',
            result: {
              token: tempToken,
              userInfo: minUserInfo
            },
            timestamp: Date.now()
          };
        }
      } else if (responseData.message === '登录成功') {
        // 特殊情况：消息为"登录成功"但其他指标不符合成功条件
        console.warn('响应消息为"登录成功"，但状态码或success标志不符合预期，系统将尝试提取可用信息');
        
        const { extractedToken, extractedUserInfo } = this.extractLoginData(responseData);
        
        if (extractedToken) {
          // 即使其他指标不符合，只要能提取到token就认为成功
          this.tokenService.setToken({ token: extractedToken });
          
          this.store.setUserInfo(extractedUserInfo);
          
          this.store.setAuthenticated(true);
          this.loginAttempts = 0;
          
          return {
            success: true,
            code: 200,
            message: '登录成功',
            result: {
              token: extractedToken,
              userInfo: extractedUserInfo || {
                id: '',
                username: ''
              }
            },
            timestamp: Date.now()
          };
        }
      }
      
      // 处理明确的登录失败
      throw this.createError(
        AuthErrorType.UNKNOWN, 
        responseData?.message || '登录失败，服务返回异常'
      );
    } catch (error: any) {
      this.loginAttempts++;
      
      // 特殊错误处理：响应可能包含登录成功信息
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // 检查错误响应中是否包含"登录成功"消息
        if (errorData.message === '登录成功' || 
            (typeof errorData === 'string' && errorData.includes('登录成功'))) {
          console.warn('服务端返回错误但消息为"登录成功"，系统将尝试恢复登录状态');
          
          // 尝试提取数据
          const { extractedToken, extractedUserInfo } = this.extractLoginData(errorData);
          
          if (extractedToken) {
            this.tokenService.setToken({ token: extractedToken });
            
            this.store.setUserInfo(extractedUserInfo);
            
            this.store.setAuthenticated(true);
            this.loginAttempts = 0;
            
            return {
              success: true,
              code: 200,
              message: '登录成功（自动恢复）',
              result: {
                token: extractedToken,
                userInfo: extractedUserInfo || {
                  id: '',
                  username: ''
                }
              },
              timestamp: Date.now()
            };
          }
        }
      }
      
      // 处理标准HTTP错误
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          throw this.createError(AuthErrorType.INVALID_CREDENTIALS, this.config.errorMessages?.invalidCredentials || '用户名或密码错误');
        } else if (status === 403) {
          throw this.createError(AuthErrorType.UNAUTHORIZED, this.config.errorMessages?.unauthorized || '没有权限访问');
        }
      }
      
      throw this.createError(AuthErrorType.UNKNOWN, error.message || this.config.errorMessages?.unknownError || '未知错误');
    }
  }
  
  /**
   * 判断登录是否成功
   * 支持多种成功状态判断方式
   */
  private isLoginSuccessful(response: any): boolean {
    // 没有响应数据，肯定失败
    if (!response) return false;
    
    // 检查多种成功指标
    if (response.success === true) return true;  // 标准success字段
    if (response.code === 200 || response.code === '200') return true;  // 状态码
    if (response.status === 200 || response.status === '200') return true;  // 另一种状态表示
    if (response.message === '登录成功' && response.token) return true;  // 特殊情况：有成功消息且有token
    
    // 自定义判断函数，由配置提供
    if (this.config.response?.isSuccessful && this.config.response.isSuccessful(response)) {
      return true;
    }
    
    return false;
  }
  
  /**
   * 从登录响应中提取token和用户信息
   * 支持多种数据结构格式
   */
  private extractLoginData(response: any): { extractedToken: string | null; extractedUserInfo: UserInfo | null } {
    let extractedToken: string | null = null;
    let extractedUserInfo: UserInfo | null = null;
    
    // 配置提供的自定义提取函数
    if (this.config.response?.extractLoginData) {
      const customExtracted = this.config.response.extractLoginData(response);
      if (customExtracted.token) {
        return {
          extractedToken: customExtracted.token,
          extractedUserInfo: customExtracted.userInfo || null
        };
      }
    }
    
    // 标准格式：result.token 和 result.userInfo
    if (response.result) {
      if (response.result.token) {
        extractedToken = response.result.token;
      }
      if (response.result.userInfo) {
        extractedUserInfo = response.result.userInfo;
      }
    }
    
    // 根级别格式：直接包含token和userInfo
    if (!extractedToken && response.token) {
      extractedToken = response.token;
    }
    if (!extractedUserInfo && response.userInfo) {
      extractedUserInfo = response.userInfo;
    }
    
    // 其他可能的token位置
    if (!extractedToken) {
      // 检查data字段
      if (response.data && response.data.token) {
        extractedToken = response.data.token;
      }
      // 检查object字段
      else if (response.object && response.object.token) {
        extractedToken = response.object.token;
      }
    }
    
    // 其他可能的userInfo位置
    if (!extractedUserInfo) {
      // 检查data字段
      if (response.data && response.data.userInfo) {
        extractedUserInfo = response.data.userInfo;
      }
      // 检查object字段
      else if (response.object && response.object.userInfo) {
        extractedUserInfo = response.object.userInfo;
      }
      // 检查user字段
      else if (response.user) {
        extractedUserInfo = response.user;
      }
    }
    
    return { extractedToken, extractedUserInfo };
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

      const { token, expiresIn } = response.data;
      this.tokenService.setToken({ token, refreshToken, expiresIn });
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
   * 设置token
   */
  public setToken(token: string): void {
    this.tokenService.setToken({ token });
  }

  /**
   * 获取token
   */
  public getToken(): string | null {
    return this.tokenService.getToken();
  }

  /**
   * 创建错误对象
   */
  private createError(type: AuthErrorType, message: string, originalError?: Error): AuthError {
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
