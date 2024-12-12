import type { AuthConfig, IAuthService, ITokenService } from '../types/auth.types';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

/**
 * 服务工厂类
 */
export class ServiceFactory {
  /**
   * 创建认证服务实例
   */
  static createAuthService(config: AuthConfig): IAuthService {
    const CustomAuthService = config.customServices?.authService;
    return CustomAuthService ? new CustomAuthService(config) : AuthService.getInstance(config);
  }

  /**
   * 创建Token服务实例
   */
  static createTokenService(config: AuthConfig): ITokenService {
    const CustomTokenService = config.customServices?.tokenService;
    return CustomTokenService ? new CustomTokenService(config) : TokenService.getInstance(config);
  }
}
