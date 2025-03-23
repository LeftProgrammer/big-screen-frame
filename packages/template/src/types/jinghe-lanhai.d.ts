// 声明@jinghe/jinghe-lanhai模块的类型定义
declare module '@jinghe/jinghe-lanhai' {
  // HTTP模块
  export namespace $http {
    // HTTP方法枚举
    enum HttpMethod {
      GET = 'GET',
      POST = 'POST',
      PUT = 'PUT',
      DELETE = 'DELETE',
      PATCH = 'PATCH'
    }

    // 进度事件接口
    interface ProgressEvent {
      loaded: number;
      total: number;
      progress: number;
      bytes: number;
      rate: number;
      estimated: number;
    }

    // 上传配置
    interface UploadConfig {
      fieldName?: string;
      accept?: string[];
      maxSize?: number;
      chunked?: boolean;
      chunkSize?: number;
      onProgress?: (event: ProgressEvent) => void;
      onSuccess?: (response: any) => void;
      onError?: (error: any) => void;
    }

    // 下载配置
    interface DownloadConfig {
      filename?: string;
      resumable?: boolean;
      onProgress?: (event: ProgressEvent) => void;
      onSuccess?: (blob: Blob) => void;
      onError?: (error: any) => void;
    }

    // 轮询配置
    interface PollingConfig {
      enabled: boolean;
      interval: number;
      immediate?: boolean;
      pollingId?: string;
      onSuccess?: (data: any) => void;
      onError?: (error: any) => void;
    }

    // 重试选项
    interface RetryOptions {
      count: number;
      baseDelay: number;
      maxDelay?: number;
      useExponentialBackoff?: boolean;
      shouldRetry?: (error: any) => boolean | Promise<boolean>;
      onRetry?: (retryCount: number, error: any) => void | Promise<void>;
    }

    // 请求配置接口
    interface RequestConfig {
      url?: string;
      method?: string;
      baseURL?: string;
      headers?: Record<string, string>;
      params?: any;
      data?: any;
      timeout?: number;
      withCredentials?: boolean;
      responseType?: string;
      retry?: Partial<RetryOptions>;
      polling?: PollingConfig;
      upload?: UploadConfig;
      download?: DownloadConfig;
      showLoading?: boolean;
      showError?: boolean;
      handleError?: (error: any) => void;
      // Axios特有的进度回调
      onUploadProgress?: (progressEvent: any) => void;
      onDownloadProgress?: (progressEvent: any) => void;
      // 其他可能的配置选项
      [key: string]: any;
    }

    // 响应数据接口
    interface ResponseData<T = any> {
      code: number;
      data: T;
      message: string;
      [key: string]: any;
    }

    // HTTP拦截器接口
    interface HttpInterceptor {
      request?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
      response?: (response: any) => any | Promise<any>;
      error?: (error: any) => any | Promise<any>;
    }

    // HTTP客户端配置
    interface HttpClientConfig {
      baseURL?: string;
      timeout?: number;
      headers?: Record<string, string>;
      interceptors?: HttpInterceptor[];
      retry?: Partial<RetryOptions>;
      autoCancel?: boolean;
      [key: string]: any;
    }

    // 基础HTTP方法
    function get<T = any>(url: string, params?: any, config?: RequestConfig): Promise<ResponseData<T>>;
    function post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>>;
    function put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>>;
    function request<T = any>(config: RequestConfig): Promise<ResponseData<T>>;
    
    // 提供request方法作为替代方案
    function request<T = any>(config: { method: 'delete', url: string, data?: any } & Omit<RequestConfig, 'method' | 'url'>): Promise<ResponseData<T>>;
    
    // 文件处理
    function upload<T = any>(url: string, file: File, config?: any): Promise<ResponseData<T>>;
    function download(url: string, config?: any): Promise<void>;
    
    // 高级功能配置
    function setBaseURL(url: string): void;
    function setTimeout(timeout: number): void;
    function setWithCredentials(value: boolean): void;
    function addRequestInterceptor(onFulfilled: (config: any) => any, onRejected?: (error: any) => any): void;
    function addResponseInterceptor(onFulfilled: (response: any) => any, onRejected?: (error: any) => any): void;
    function getCancelToken(executor: (cancel: any) => void): any;
    function cancelAll(): void;
    function stopAllPolling(): void;
    function setHeader(key: string, value: string): void;
    function removeHeader(key: string): void;
  }

  // 认证模块
  export namespace $auth {
    interface UserInfo {
      id: string;
      username: string;
      name: string;
      avatar?: string;
      roles?: string[];
      permissions?: string[];
      [key: string]: any;
    }

    function login(username: string, password: string): Promise<any>;
    function logout(): Promise<void>;
    function getToken(): string | null;
    function setToken(token: string): void;
    function getUser(): UserInfo | null;
    function setUser(user: UserInfo | null): void; 
    function isAuthenticated(): boolean;
    function hasRole(role: string): boolean;
    function hasPermission(permission: string): boolean;
  }

  // 布局模块
  export namespace $layout {
    const ScaleScreen: any;
  }

  // 主题模块
  export namespace $theme {
    function setTheme(theme: string | boolean): void;
    function getTheme(): string;
    function toggleTheme(): void;
    function useTheme(): any;
  }

  // 工具模块
  export namespace $utils {
    const storage: {
      get(key: string): any;
      set(key: string, value: any): void;
      remove(key: string): void;
      clear(): void;
    };
    const date: {
      format(date: Date | string | number, format?: string): string;
      parse(dateString: string, format?: string): Date;
    };
  }

  // 组件模块
  export namespace $components {
    const Button: any;
    const Card: any;
    const Table: any;
    const Form: any;
    // 其他组件...
  }
}
