import axios, { AxiosInstance } from 'axios';
import { CancelManager } from './cancel-manager';
import { PollingManager } from './polling-manager';
import { RetryStrategy } from './retry-strategy';
import { HeaderManager } from './header-manager';
import { ErrorManager } from './error-manager';
import { FileManager } from './file-manager';
import type {
  HttpClientConfig,
  HttpInterceptor,
  RequestConfig,
  ResponseData,
  PollingConfig,
  UploadConfig,
  DownloadConfig
} from './types';

/**
 * HTTP 客户端
 */
export class HttpClient {
  private static instance: HttpClient;
  private axios: AxiosInstance;
  private cancelManager: CancelManager;
  private pollingManager: PollingManager;
  private headerManager: HeaderManager;
  private errorManager: ErrorManager;
  private fileManager: FileManager;
  private config: HttpClientConfig;

  private constructor(config: HttpClientConfig) {
    this.config = config;
    this.cancelManager = CancelManager.getInstance();
    this.pollingManager = PollingManager.getInstance();
    this.headerManager = HeaderManager.getInstance();
    this.errorManager = ErrorManager.getInstance();
    this.fileManager = FileManager.getInstance();
    this.axios = this.createAxiosInstance(config);
    this.setupInterceptors(config.interceptors || []);

    // 设置轮询管理器的请求函数
    this.pollingManager.setRequestFunction(this.request.bind(this));
  }

  public static getInstance(config?: HttpClientConfig): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient(config || {});
    }
    return HttpClient.instance;
  }

  /**
   * 创建 Axios 实例
   */
  private createAxiosInstance(config: HttpClientConfig): AxiosInstance {
    return axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: config.headers || {}
    });
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors(interceptors: HttpInterceptor[]): void {
    // 请求拦截器
    this.axios.interceptors.request.use(
      async (config: RequestConfig) => {
        // 合并动态请求头
        const dynamicHeaders = await this.headerManager.getHeaders();
        config.headers = {
          ...config.headers,
          ...dynamicHeaders
        };

        // 自动取消重复请求
        if (this.config.autoCancel) {
          this.cancelManager.removePending(config);
          this.cancelManager.addPending(config);
        }

        // 应用自定义拦截器
        for (const interceptor of interceptors) {
          if (interceptor.request) {
            config = await interceptor.request(config);
          }
        }

        return config;
      },
      error => Promise.reject(error)
    );

    // 响应拦截器
    this.axios.interceptors.response.use(
      async response => {
        // 移除已完成的请求
        if (this.config.autoCancel) {
          this.cancelManager.removePending(response.config);
        }

        // 处理文件下载
        if (response.config.responseType === 'blob') {
          const downloadConfig = (response.config as RequestConfig).download;
          if (downloadConfig) {
            this.fileManager.handleDownloadResponse(response, downloadConfig);
          }
        }

        // 应用自定义拦截器
        for (const interceptor of interceptors) {
          if (interceptor.response) {
            response = await interceptor.response(response);
          }
        }

        return response;
      },
      async error => {
        // 处理请求取消
        if (axios.isCancel(error)) {
          return Promise.reject(new Error('Request canceled'));
        }

        // 统一错误处理
        await this.errorManager.handleError(error);

        // 应用自定义错误处理
        for (const interceptor of interceptors) {
          if (interceptor.error) {
            error = await interceptor.error(error);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * 发送请求
   */
  public async request<T = any>(config: RequestConfig): Promise<ResponseData<T>> {
    try {
      // 处理文件上传
      if (config.upload) {
        return this.handleUpload<T>(config);
      }

      // 处理轮询
      if (config.polling?.enabled) {
        return this.handlePolling<T>(config);
      }

      // 使用重试策略
      const response = await RetryStrategy.execute(
        () => this.axios.request<ResponseData<T>>(config),
        {
          ...this.config.retry,
          ...config.retry
        }
      );

      return response.data;
    } catch (error) {
      if (config.handleError) {
        config.handleError(error);
      }
      throw error;
    }
  }

  /**
   * 处理文件上传
   */
  private async handleUpload<T>(config: RequestConfig): Promise<ResponseData<T>> {
    const uploadConfig = config.upload as UploadConfig;
    const file = config.data as File;

    // 验证文件
    if (uploadConfig.maxSize && file.size > uploadConfig.maxSize) {
      throw new Error('File size exceeds limit');
    }
    if (uploadConfig.accept && !uploadConfig.accept.includes(file.type)) {
      throw new Error('File type not accepted');
    }

    // 分片上传
    if (uploadConfig.chunked) {
      await this.fileManager.uploadInChunks(file, uploadConfig);
      return {} as ResponseData<T>; // TODO: 返回合并后的响应
    }

    // 普通上传
    const uploadRequestConfig = this.fileManager.createUploadConfig(file, uploadConfig);
    const response = await this.axios.request({
      ...config,
      ...uploadRequestConfig
    });
    return response.data;
  }

  /**
   * 处理轮询请求
   */
  private handlePolling<T>(config: RequestConfig): Promise<ResponseData<T>> {
    const pollingConfig = config.polling as PollingConfig;
    const pollingId = pollingConfig.pollingId || `${config.method}-${config.url}`;

    const { enabled } = this.pollingManager.createPolling({
      ...config,
      pollingId,
      interval: pollingConfig.interval,
      immediate: pollingConfig.immediate,
      onSuccess: pollingConfig.onSuccess,
      onError: pollingConfig.onError
    });

    // 返回第一次请求的结果
    return this.axios.request<ResponseData<T>>(config).then(response => response.data);
  }

  // 基础 HTTP 方法
  public get<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  public post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  public put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  public delete<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  /**
   * 文件上传
   */
  public upload<T = any>(
    url: string,
    file: File,
    config?: Omit<RequestConfig, 'data'> & { upload?: UploadConfig }
  ): Promise<ResponseData<T>> {
    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data: file
    });
  }

  /**
   * 文件下载
   */
  public download(
    url: string,
    config?: Omit<RequestConfig, 'responseType'> & { download?: DownloadConfig }
  ): Promise<void> {
    return this.request({
      ...config,
      method: 'GET',
      url,
      responseType: 'blob'
    });
  }

  // 管理方法
  public cancelAll(): void {
    this.cancelManager.removeAll();
  }

  public stopAllPolling(): void {
    this.pollingManager.stopAll();
  }

  public setHeader(key: string, value: string): void {
    this.headerManager.setHeader(key, value);
  }

  public removeHeader(key: string): void {
    this.headerManager.removeHeader(key);
  }

  public addErrorHandler(handler: (error: any) => void, priority?: number): void {
    this.errorManager.addHandler(handler, priority);
  }
}
