// api/request.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 默认的 Axios 实例创建
const instance = axios.create({
  baseURL: process.env.API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
});

// 请求重试配置
const MAX_RETRY_COUNT = 3;
const RETRY_DELAY = 1000;
const cancelTokenMap = new Map<string, () => void>();

// 默认错误处理
const defaultErrorHandler = (error: AxiosError) => {
  const { response } = error;
  if (response) {
    switch (response.status) {
      case 401:
        console.error("Unauthorized access.");
        // redirect or token refresh logic can be added here
        break;
      case 403:
        console.error("Forbidden access.");
        break;
      case 500:
        console.error("Server error.");
        break;
      default:
        console.error("Request failed:", response.data?.message || "Unknown error");
    }
  } else {
    console.error("Network error:", error.message);
  }
  return Promise.reject(error);
};

// 创建 axios 实例并传入自定义错误处理（可选）
function createApiInstance(customErrorHandler?: (error: AxiosError) => void) {
  const apiInstance = axios.create({
    baseURL: process.env.API_BASE_URL,
    timeout: 10000,
  });

  apiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (config.url) {
      const cancel = cancelTokenMap.get(config.url);
      if (cancel) cancel();
      config.cancelToken = new axios.CancelToken((c) => cancelTokenMap.set(config.url!, c));
    }
    return config;
  });

  apiInstance.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    async (error: AxiosError) => {
      const { config } = error;
      if (config && config.retryCount && config.retryCount < MAX_RETRY_COUNT) {
        config.retryCount += 1;
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return apiInstance(config);
      }
      (customErrorHandler || defaultErrorHandler)(error);
      return Promise.reject(error);
    }
  );

  return apiInstance;
}

// 导出常用请求方法封装
const apiMethods = (instance: any) => ({
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, config);
  },
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.post(url, data, config);
  },
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.put(url, data, config);
  },
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, config);
  },
});

// 默认实例及其方法封装
const defaultApiInstance = createApiInstance();
export const api = apiMethods(defaultApiInstance);

// 工厂函数，用于创建自定义实例及其封装方法
export function createCustomApi(customErrorHandler?: (error: AxiosError) => void) {
  const customInstance = createApiInstance(customErrorHandler);
  return apiMethods(customInstance);
}

// 用于取消请求
export function cancelRequest(url: string) {
  const cancel = cancelTokenMap.get(url);
  if (cancel) {
    cancel();
    cancelTokenMap.delete(url);
  }
}
