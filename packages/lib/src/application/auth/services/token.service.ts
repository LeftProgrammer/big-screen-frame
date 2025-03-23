import type { AuthConfig, TokenInfo, ITokenService } from '../types/auth.types';
import { storage } from '../../../core/utils';
import { defaultAuthConfig } from '../config/auth.config';

/**
 * Token管理服务
 */
export class TokenService implements ITokenService {
  private static instance: TokenService;
  public config: AuthConfig;

  private constructor(config: AuthConfig) {
    // 确保config至少包含必需的属性
    this.config = {
      ...defaultAuthConfig,
      ...config
    };
  }

  public static getInstance(config: AuthConfig): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService(config);
    }
    return TokenService.instance;
  }

  /**
   * 保存Token信息
   */
  public setToken(tokenInfo: TokenInfo): void {
    const { token, refreshToken, expiresIn } = tokenInfo;
    
    // 确保token是字符串类型
    if (token && typeof token === 'string') {
      const tokenKey = this.config.tokenKey || defaultAuthConfig.tokenKey || 'access_token';
      storage.set(tokenKey, token);
    } else {
      console.warn('Invalid token format: token must be a non-empty string');
    }

    if (refreshToken && typeof refreshToken === 'string') {
      const refreshTokenKey = this.config.storageKeys?.refreshToken || 'refresh_token';
      storage.set(refreshTokenKey, refreshToken);
    }

    if (expiresIn !== undefined) {
      // 计算过期的绝对时间戳（毫秒）
      const expiresAt = Date.now() + expiresIn * 1000;
      const tokenExpiresKey = this.config.storageKeys?.tokenExpires || 'token_expires';
      storage.set(tokenExpiresKey, expiresAt.toString());
    }
  }

  /**
   * 获取Token
   */
  public getToken(): string | null {
    const tokenKey = this.config.tokenKey || defaultAuthConfig.tokenKey || 'access_token';
    return storage.get<string>(tokenKey);
  }

  /**
   * 获取刷新Token
   */
  public getRefreshToken(): string | null {
    const refreshTokenKey = this.config.storageKeys?.refreshToken || 'refresh_token';
    return storage.get<string>(refreshTokenKey);
  }

  /**
   * 获取Token过期时间
   */
  public getTokenExpires(): number | null {
    const tokenExpiresKey = this.config.storageKeys?.tokenExpires || 'token_expires';
    const expires = storage.get<string>(tokenExpiresKey);
    return expires ? parseInt(expires, 10) : null;
  }

  /**
   * 清除所有Token相关信息
   */
  public clearToken(): void {
    const tokenKey = this.config.tokenKey || defaultAuthConfig.tokenKey || 'access_token';
    storage.remove(tokenKey);
    
    const refreshTokenKey = this.config.storageKeys?.refreshToken || 'refresh_token';
    storage.remove(refreshTokenKey);
    
    const tokenExpiresKey = this.config.storageKeys?.tokenExpires || 'token_expires';
    storage.remove(tokenExpiresKey);
  }

  /**
   * 检查Token是否需要刷新
   */
  public needsRefresh(): boolean {
    const expires = this.getTokenExpires();
    if (!expires) return true;

    // 刷新阈值，默认为过期前5分钟
    const refreshThreshold = 5 * 60 * 1000;
    return Date.now() > expires - refreshThreshold;
  }

  /**
   * 格式化Token
   */
  public formatToken(token: string): string {
    if (!token || typeof token !== 'string') {
      return '';
    }
    
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
}
