import { defineStore } from 'pinia';
import type { AuthState, UserInfo, AuthError } from '../../auth/types/auth.types';
import { storage } from '@lib/core/utils';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: !!storage.get('access_token'),
    userInfo: storage.get('user_info') ? JSON.parse(storage.get('user_info')!) : null,
    token: storage.get('access_token'),
    refreshToken: storage.get('refresh_token'),
    loading: false,
    error: null
  }),

  getters: {
    /**
     * 获取用户角色
     */
    roles: (state): string[] => {
      return state.userInfo?.roles || [];
    },

    /**
     * 获取用户权限
     */
    permissions: (state): string[] => {
      return state.userInfo?.permissions || [];
    },

    /**
     * 是否为管理员
     */
    isAdmin: (state): boolean => {
      return state.userInfo?.roles?.includes('admin') || false;
    }
  },

  actions: {
    /**
     * 设置认证状态
     */
    setAuthenticated(value: boolean) {
      this.isAuthenticated = value;
    },

    /**
     * 设置用户信息
     */
    setUserInfo(userInfo: UserInfo | null) {
      this.userInfo = userInfo;
      if (userInfo) {
        storage.set('user_info', JSON.stringify(userInfo));
      } else {
        storage.remove('user_info');
      }
    },

    /**
     * 设置Token
     */
    setToken(token: string | null) {
      this.token = token;
      if (token) {
        storage.set('access_token', token);
      } else {
        storage.remove('access_token');
      }
    },

    /**
     * 设置刷新Token
     */
    setRefreshToken(token: string | null) {
      this.refreshToken = token;
      if (token) {
        storage.set('refresh_token', token);
      } else {
        storage.remove('refresh_token');
      }
    },

    /**
     * 设置加载状态
     */
    setLoading(value: boolean) {
      this.loading = value;
    },

    /**
     * 设置错误信息
     */
    setError(error: AuthError | null) {
      this.error = error;
    },

    /**
     * 重置状态
     */
    reset() {
      this.isAuthenticated = false;
      this.userInfo = null;
      this.token = null;
      this.refreshToken = null;
      this.loading = false;
      this.error = null;

      // 清除存储
      storage.remove('access_token');
      storage.remove('refresh_token');
      storage.remove('user_info');
    },

    /**
     * 检查权限
     */
    hasPermission(permission: string): boolean {
      return this.permissions.includes(permission);
    },

    /**
     * 检查角色
     */
    hasRole(role: string): boolean {
      return this.roles.includes(role);
    },

    /**
     * 检查多个权限（任一满足）
     */
    hasAnyPermission(permissions: string[]): boolean {
      return permissions.some(permission => this.hasPermission(permission));
    },

    /**
     * 检查多个权限（全部满足）
     */
    hasAllPermissions(permissions: string[]): boolean {
      return permissions.every(permission => this.hasPermission(permission));
    },

    /**
     * 检查多个角色（任一满足）
     */
    hasAnyRole(roles: string[]): boolean {
      return roles.some(role => this.hasRole(role));
    },

    /**
     * 检查多个角色（全部满足）
     */
    hasAllRoles(roles: string[]): boolean {
      return roles.every(role => this.hasRole(role));
    }
  }
});
