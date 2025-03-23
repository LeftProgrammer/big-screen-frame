import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../services/auth.service';
import { http } from '../../../core/http';
import { AuthConfig, AuthErrorType } from '../types/auth.types';
import { useAuthStore } from '../../../core/store/modules/auth';

// 模拟依赖
vi.mock('../../../core/http', () => ({
  http: {
    post: vi.fn(),
    get: vi.fn()
  }
}));

vi.mock('../../../core/store/modules/auth', () => ({
  useAuthStore: vi.fn().mockReturnValue({
    setAuthenticated: vi.fn(),
    setUserInfo: vi.fn(),
    setToken: vi.fn(),
    setError: vi.fn()
  })
}));

describe('AuthService', () => {
  let authService: any;
  const mockStore = useAuthStore();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // 创建测试配置
    const config: AuthConfig = {
      baseURL: 'http://test-api.example.com',
      tokenKey: 'x-auth-token',
      tokenPrefix: 'Bearer',
      endpoints: {
        login: '/api/login'
      },
      // 自定义响应处理函数 - 测试自定义逻辑
      response: {
        isSuccessful: (response: any) => {
          // 检查自定义成功条件 - 例如检查特殊状态码
          return response.statusCode === 0 || response.statusCode === '0';
        },
        extractLoginData: (response: any) => {
          // 自定义数据提取逻辑 - 处理特殊格式
          if (response.data && response.data.access_token) {
            return {
              token: response.data.access_token,
              userInfo: response.data.user
            };
          }
          return { token: null };
        }
      }
    };
    
    // 获取实例（我们无法直接创建实例，所以需要一些变通方法）
    authService = (AuthService as any).getInstance(config);
  });

  describe('isLoginSuccessful', () => {
    it('应该正确识别标准成功响应 (success: true)', () => {
      const response = { success: true, result: { token: 'token123' } };
      const result = authService.isLoginSuccessful(response);
      expect(result).toBe(true);
    });

    it('应该正确识别基于状态码的成功响应 (code: 200)', () => {
      const response = { code: 200, result: { token: 'token123' } };
      const result = authService.isLoginSuccessful(response);
      expect(result).toBe(true);
    });

    it('应该正确识别字符串状态码的成功响应 (code: "200")', () => {
      const response = { code: '200', result: { token: 'token123' } };
      const result = authService.isLoginSuccessful(response);
      expect(result).toBe(true);
    });

    it('应该正确识别基于status字段的成功响应', () => {
      const response = { status: 200, data: { token: 'token123' } };
      const result = authService.isLoginSuccessful(response);
      expect(result).toBe(true);
    });

    it('应该正确识别特殊情况：有成功消息且有token的响应', () => {
      const response = { message: '登录成功', token: 'token123' };
      const result = authService.isLoginSuccessful(response);
      expect(result).toBe(true);
    });

    it('应该使用配置的自定义成功判断函数', () => {
      const response = { statusCode: '0', data: { access_token: 'token123' } };
      const result = authService.isLoginSuccessful(response);
      expect(result).toBe(true);
    });

    it('应该正确识别失败响应', () => {
      const response = { success: false, message: '密码错误' };
      const result = authService.isLoginSuccessful(response);
      expect(result).toBe(false);
    });

    it('应该正确处理空响应', () => {
      const result = authService.isLoginSuccessful(null);
      expect(result).toBe(false);
    });
  });

  describe('extractLoginData', () => {
    it('应该能从标准格式结果中提取token和用户信息', () => {
      const response = {
        success: true,
        result: {
          token: 'token123',
          userInfo: { id: '1', username: 'test' }
        }
      };
      
      const { extractedToken, extractedUserInfo } = authService.extractLoginData(response);
      
      expect(extractedToken).toBe('token123');
      expect(extractedUserInfo).toEqual({ id: '1', username: 'test' });
    });

    it('应该能从根级别格式中提取token和用户信息', () => {
      const response = {
        success: true,
        token: 'token123',
        userInfo: { id: '1', username: 'test' }
      };
      
      const { extractedToken, extractedUserInfo } = authService.extractLoginData(response);
      
      expect(extractedToken).toBe('token123');
      expect(extractedUserInfo).toEqual({ id: '1', username: 'test' });
    });

    it('应该能从data字段中提取token', () => {
      const response = {
        success: true,
        data: {
          token: 'token123',
          userInfo: { id: '1', username: 'test' }
        }
      };
      
      const { extractedToken, extractedUserInfo } = authService.extractLoginData(response);
      
      expect(extractedToken).toBe('token123');
      expect(extractedUserInfo).toEqual({ id: '1', username: 'test' });
    });

    it('应该能从object字段中提取token', () => {
      const response = {
        success: true,
        object: {
          token: 'token123',
          userInfo: { id: '1', username: 'test' }
        }
      };
      
      const { extractedToken, extractedUserInfo } = authService.extractLoginData(response);
      
      expect(extractedToken).toBe('token123');
      expect(extractedUserInfo).toEqual({ id: '1', username: 'test' });
    });

    it('应该正确处理从user字段中提取用户信息', () => {
      const response = {
        success: true,
        token: 'token123',
        user: { id: '1', username: 'test' }
      };
      
      const { extractedToken, extractedUserInfo } = authService.extractLoginData(response);
      
      expect(extractedToken).toBe('token123');
      expect(extractedUserInfo).toEqual({ id: '1', username: 'test' });
    });

    it('应该使用配置的自定义数据提取函数', () => {
      const response = {
        statusCode: '0',
        data: {
          access_token: 'token123',
          user: { id: '1', username: 'test' }
        }
      };
      
      const { extractedToken, extractedUserInfo } = authService.extractLoginData(response);
      
      expect(extractedToken).toBe('token123');
      expect(extractedUserInfo).toEqual({ id: '1', username: 'test' });
    });

    it('当找不到数据时应返回null', () => {
      const response = {
        success: true,
        message: '操作成功'
      };
      
      const { extractedToken, extractedUserInfo } = authService.extractLoginData(response);
      
      expect(extractedToken).toBeNull();
      expect(extractedUserInfo).toBeNull();
    });
  });

  describe('login', () => {
    it('应该成功处理标准登录响应', async () => {
      const mockResponse = {
        data: {
          success: true,
          code: 200,
          message: '登录成功',
          result: {
            token: 'token123',
            userInfo: { id: '1', username: 'test' }
          },
          timestamp: Date.now()
        }
      };
      
      (http.post as any).mockResolvedValue(mockResponse);
      
      const result = await authService.login({ username: 'test', password: 'password' });
      
      expect(http.post).toHaveBeenCalledWith('/api/login', { username: 'test', password: 'password' });
      expect(result.success).toBe(true);
      expect(result.result.token).toBe('token123');
      expect(mockStore.setAuthenticated).toHaveBeenCalledWith(true);
      expect(mockStore.setUserInfo).toHaveBeenCalled();
    });

    it('应该处理特殊格式的登录响应', async () => {
      const mockResponse = {
        data: {
          statusCode: '0',
          message: '登录成功',
          data: {
            access_token: 'token123',
            user: { id: '1', username: 'test' }
          }
        }
      };
      
      (http.post as any).mockResolvedValue(mockResponse);
      
      const result = await authService.login({ username: 'test', password: 'password' });
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('登录成功');
      expect(mockStore.setAuthenticated).toHaveBeenCalledWith(true);
    });

    it('应该处理登录错误（无token）', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: '登录成功',
          result: {} // 无token
        }
      };
      
      (http.post as any).mockResolvedValue(mockResponse);
      
      try {
        await authService.login({ username: 'test', password: 'password' });
        fail('应该抛出错误');
      } catch (error: any) {
        expect(error.type).toBe(AuthErrorType.UNKNOWN);
        expect(error.message).toContain('未包含token信息');
      }
    });

    it('应该处理显式登录失败', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: '用户名或密码错误',
          code: 401
        }
      };
      
      (http.post as any).mockResolvedValue(mockResponse);
      
      try {
        await authService.login({ username: 'test', password: 'password' });
        fail('应该抛出错误');
      } catch (error: any) {
        expect(error.message).toBe('用户名或密码错误');
      }
    });

    it('应该处理网络错误', async () => {
      (http.post as any).mockRejectedValue(new Error('网络错误'));
      
      try {
        await authService.login({ username: 'test', password: 'password' });
        fail('应该抛出错误');
      } catch (error: any) {
        expect(authService.loginAttempts).toBe(1);
      }
    });
  });
});
