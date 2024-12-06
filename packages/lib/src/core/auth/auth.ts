// auth.ts
import { ref } from 'vue';
import { api } from '../api/request';

export interface AuthConfig {
  tokenKey?: string;
  refreshTokenKey?: string;
  tokenPrefix?: string;
  loginUrl?: string;
  logoutUrl?: string;
  refreshTokenUrl?: string;
  userInfoUrl?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  [key: string]: any;
}

export interface TokenResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface UserInfo {
  id: string | number;
  username: string;
  [key: string]: any;
}

export class AuthService {
  private config: Required<AuthConfig>;
  private refreshTokenTimeout: number | null = null;

  // 响应式状态
  public isAuthenticated = ref(false);
  public userInfo = ref<UserInfo | null>(null);
  public isLoading = ref(false);

  constructor(config: AuthConfig = {}) {
    this.config = {
      tokenKey: 'access_token',
      refreshTokenKey: 'refresh_token',
      tokenPrefix: 'Bearer',
      loginUrl: '/auth/login',
      logoutUrl: '/auth/logout',
      refreshTokenUrl: '/auth/refresh',
      userInfoUrl: '/auth/user',
      ...config,
    };

    // 初始化时检查token
    this.checkAuth();
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.config.tokenKey);
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.config.refreshTokenKey);
  }

  private setTokens(token: string, refreshToken?: string): void {
    localStorage.setItem(this.config.tokenKey, token);
    if (refreshToken) {
      localStorage.setItem(this.config.refreshTokenKey, refreshToken);
    }
  }

  private clearTokens(): void {
    localStorage.removeItem(this.config.tokenKey);
    localStorage.removeItem(this.config.refreshTokenKey);
  }

  private setupRefreshToken(expiresIn: number): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }

    // 在token过期前5分钟刷新
    const timeout = (expiresIn - 300) * 1000;
    this.refreshTokenTimeout = window.setTimeout(() => {
      this.refreshToken();
    }, timeout);
  }

  private async checkAuth(): Promise<void> {
    const token = this.getStoredToken();
    if (token) {
      try {
        await this.fetchUserInfo();
        this.isAuthenticated.value = true;
      } catch {
        this.clearTokens();
        this.isAuthenticated.value = false;
      }
    }
  }

  public async login(credentials: LoginCredentials): Promise<void> {
    this.isLoading.value = true;
    try {
      const response = await api.post<TokenResponse>(this.config.loginUrl, credentials);
      const { token, refreshToken, expiresIn } = response.data;

      this.setTokens(token, refreshToken);
      if (expiresIn) {
        this.setupRefreshToken(expiresIn);
      }

      await this.fetchUserInfo();
      this.isAuthenticated.value = true;
    } finally {
      this.isLoading.value = false;
    }
  }

  public async logout(): Promise<void> {
    try {
      await api.post(this.config.logoutUrl);
    } finally {
      if (this.refreshTokenTimeout) {
        clearTimeout(this.refreshTokenTimeout);
      }
      this.clearTokens();
      this.isAuthenticated.value = false;
      this.userInfo.value = null;
    }
  }

  public async refreshToken(): Promise<void> {
    const refreshToken = this.getStoredRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await api.post<TokenResponse>(this.config.refreshTokenUrl, {
        refreshToken,
      });
      const { token, refreshToken: newRefreshToken, expiresIn } = response.data;

      this.setTokens(token, newRefreshToken);
      if (expiresIn) {
        this.setupRefreshToken(expiresIn);
      }
    } catch (error) {
      this.clearTokens();
      this.isAuthenticated.value = false;
      throw error;
    }
  }

  private async fetchUserInfo(): Promise<void> {
    const response = await api.get<UserInfo>(this.config.userInfoUrl);
    this.userInfo.value = response.data;
  }

  public getAuthorizationHeader(): string {
    const token = this.getStoredToken();
    return token ? `${this.config.tokenPrefix} ${token}` : '';
  }
}

// Composition API hook
export function useAuth(config: AuthConfig = {}) {
  const authService = new AuthService(config);

  return {
    login: (credentials: LoginCredentials) => authService.login(credentials),
    logout: () => authService.logout(),
    refreshToken: () => authService.refreshToken(),
    isAuthenticated: authService.isAuthenticated,
    userInfo: authService.userInfo,
    isLoading: authService.isLoading,
    getAuthorizationHeader: () => authService.getAuthorizationHeader(),
  };
}
