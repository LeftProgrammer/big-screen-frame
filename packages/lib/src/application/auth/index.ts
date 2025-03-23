// 导出类型定义
export * from './types/auth.types';

// 导出配置
export * from './config/auth.config';

// 导出服务
export { AuthService } from './services/auth.service';
export { TokenService } from './services/token.service';

// 导出组件
export { LoginPage, LoginForm } from './components';

// 创建一个真正延迟执行的useAuth函数，避免在模块加载时执行
export function useAuth(config?: any) {
  // 这里不立即执行useAuth，而是返回一个新函数，只在调用时才会导入useAuth
  // 这样可以确保只有在组件中真正需要时才会触发Pinia的初始化
  const authModule = import('./composables/useAuth');
  return authModule.then(module => module.useAuth(config));
}

// 导出一个真正延迟初始化的login方法
export const login = async (username: string, password: string) => {
  try {
    // 动态导入，只在函数被调用时才执行
    const authModule = await import('./composables/useAuth');
    return await authModule.useAuth().login(username, password);
  } catch (error) {
    console.error('Failed to login:', error);
    throw error;
  }
};

// 导出其他延迟初始化的方法
export const logout = async () => {
  try {
    const authModule = await import('./composables/useAuth');
    return await authModule.useAuth().logout();
  } catch (error) {
    console.error('Failed to logout:', error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const authModule = await import('./composables/useAuth');
    return authModule.useAuth().userInfo;
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
};

export const getToken = async () => {
  try {
    const authModule = await import('./composables/useAuth');
    return authModule.useAuth().getToken();
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

export const setToken = async (token: string) => {
  try {
    const authModule = await import('./composables/useAuth');
    return await authModule.useAuth().setToken(token);
  } catch (error) {
    console.error('Failed to set token:', error);
    throw error;
  }
};

export const setUser = async (user: any) => {
  try {
    const authModule = await import('./composables/useAuth');
    return await authModule.useAuth().setUser(user);
  } catch (error) {
    console.error('Failed to set user:', error);
    throw error;
  }
};
