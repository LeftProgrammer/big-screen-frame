import type { AxiosResponse } from 'axios';
import type { HttpInterceptor, RequestConfig } from './types';

/**
 * 默认请求拦截器
 */
export const defaultRequestInterceptor: HttpInterceptor = {
  request: async (config: RequestConfig) => {
    // 添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  }
};

/**
 * 默认响应拦截器
 */
export const defaultResponseInterceptor: HttpInterceptor = {
  response: async (response: AxiosResponse) => {
    const { data } = response;

    // 处理业务错误
    if (data.code !== 0) {
      throw new Error(data.message || 'Request failed');
    }

    return response;
  },
  error: async (error: any) => {
    // 处理网络错误
    if (!error.response) {
      console.error('Network error');
      throw new Error('Network error');
    }

    // 处理 HTTP 错误
    const { status } = error.response;
    switch (status) {
      case 401:
        // 处理未授权
        break;
      case 403:
        // 处理禁止访问
        break;
      case 404:
        // 处理未找到
        break;
      case 500:
        // 处理服务器错误
        break;
    }

    throw error;
  }
};
