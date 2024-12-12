import type { AuthConfig, TokenInfo } from '../types/auth.types';
import { storage } from '@lib/core/utils';

/**
 * Token管理服务
 */
export class TokenService {
  private static instance: TokenService;
  private config: AuthConfig;

  private constructor(config: AuthConfig) {
    this.config = config;
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
    const { token, refreshToken, expires } = tokenInfo;
    storage.set(this.config.tokenKey!, token);

    if (refreshToken) {
      storage.set('refresh_token', refreshToken);
    }

    if (expires) {
      storage.set('token_expires', expires.toString());
    }
  }

  /**
   * 获取Token
   */
  public getToken(): string | null {
    return storage.get(this.config.tokenKey!);
  }

  /**
   * 获取刷新Token
   */
  public getRefreshToken(): string | null {
    return storage.get('refresh_token');
  }

  /**
   * 获取Token过期时间
   */
  public getTokenExpires(): number | null {
    const expires = storage.get('token_expires');
    return expires ? parseInt(expires, 10) : null;
  }

  /**
   * 清除所有Token相关信息
   */
  public clearToken(): void {
    storage.remove(this.config.tokenKey!);
    storage.remove('refresh_token');
    storage.remove('token_expires');
  }

  /**
   * 检查Token是否需要刷新
   */
  public needsRefresh(): boolean {
    if (!this.config.autoRefreshToken) {
      return false;
    }

    const expires = this.getTokenExpires();
    if (!expires) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    return expires - now <= this.config.tokenRefreshThreshold!;
  }

  /**
   * 格式化Token
   */
  public formatToken(token: string): string {
    return `${this.config.tokenPrefix} ${token}`;
  }
}
