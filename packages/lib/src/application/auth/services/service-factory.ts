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
    // 确保所有实例化的服务都有config属性
    if (CustomAuthService) {
      const service = new CustomAuthService(config);
      // 确保自定义服务实现了必要的接口
      if (!('config' in service)) {
        console.warn('Custom AuthService should implement the IAuthService interface properly with config property');
        return AuthService.getInstance(config);
      }
      return service;
    }
    return AuthService.getInstance(config);
  }

  /**
   * 创建Token服务实例
   */
  static createTokenService(config: AuthConfig): ITokenService {
    const CustomTokenService = config.customServices?.tokenService;
    // 确保所有实例化的服务都有config属性
    if (CustomTokenService) {
      const service = new CustomTokenService(config);
      // 确保自定义服务实现了必要的接口
      if (!('config' in service)) {
        console.warn('Custom TokenService should implement the ITokenService interface properly with config property');
        return TokenService.getInstance(config);
      }
      return service;
    }
    return TokenService.getInstance(config);
  }
}
