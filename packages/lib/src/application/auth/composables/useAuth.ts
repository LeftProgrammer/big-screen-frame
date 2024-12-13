import { computed } from 'vue';
import type { AuthConfig, LoginParams, UserInfo } from '../types/auth.types';
import { mergeAuthConfig } from '../config/auth.config';
import { ServiceFactory } from '../services/service-factory';
import { useAuthStore } from '@lib/core/store';

/**
 * 认证组合式函数
 */
export function useAuth(config?: Partial<AuthConfig>) {
  const authConfig = mergeAuthConfig(config || {});
  const authService = ServiceFactory.createAuthService(authConfig);
  const authStore = useAuthStore();

  // 计算属性
  const isLoggedIn = computed(() => authStore.isAuthenticated);
  const userInfo = computed(() => authStore.userInfo);
  const loading = computed(() => authStore.loading);
  const error = computed(() => authStore.error);

  /**
   * 用户登录
   */
  const login = async (params: LoginParams) => {
    authStore.setLoading(true);
    authStore.setError(null);

    try {
      // 执行登录前钩子
      if (authConfig.hooks?.beforeLogin) {
        const result = await authConfig.hooks.beforeLogin(params);
        if (result === false) return;
        if (typeof result === 'object') {
          params = result;
        }
      }

      // 执行登录
      await authService.login(params);

      // 执行登录后钩子
      if (authConfig.hooks?.afterLogin) {
        await authConfig.hooks.afterLogin(authStore.userInfo!);
      }
    } catch (err: any) {
      authStore.setError(err);
      throw err;
    } finally {
      authStore.setLoading(false);
    }
  };

  /**
   * 用户登出
   */
  const logout = async () => {
    authStore.setLoading(true);
    authStore.setError(null);

    try {
      // 执行登出前钩子
      if (authConfig.hooks?.beforeLogout) {
        const canLogout = await authConfig.hooks.beforeLogout();
        if (!canLogout) return;
      }

      // 执行登出
      await authService.logout();

      // 执行登出后钩子
      if (authConfig.hooks?.afterLogout) {
        await authConfig.hooks.afterLogout();
      }
    } catch (err: any) {
      authStore.setError(err);
      throw err;
    } finally {
      authStore.setLoading(false);
    }
  };

  /**
   * 获取当前用户信息
   */
  const getCurrentUser = async (): Promise<UserInfo> => {
    authStore.setLoading(true);
    authStore.setError(null);

    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (err: any) {
      authStore.setError(err);
      throw err;
    } finally {
      authStore.setLoading(false);
    }
  };

  /**
   * 检查认证状态
   */
  const checkAuth = (): boolean => {
    return authService.checkAuth();
  };

  // TODO: 这些方法需要实现
  const refreshToken = () => {};
  const updateUserInfo = () => {};
  const hasPermission = () => {};
  const hasRole = () => {};
  const hasAnyPermission = () => {};
  const hasAllPermissions = () => {};
  const hasAnyRole = () => {};
  const hasAllRoles = () => {};

  return {
    // 状态
    isLoggedIn,
    userInfo,
    loading,
    error,

    // 方法
    login,
    logout,
    refreshToken,
    updateUserInfo,
    checkAuth,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    hasAnyRole,
    hasAllRoles
  };
}
