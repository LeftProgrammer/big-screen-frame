import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RetryOptions } from './retry-strategy';

// HTTP 方法枚举
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

// 进度事件
export interface ProgressEvent {
  loaded: number;
  total: number;
  progress: number;
  bytes: number;
  rate: number; // 速率（bytes/s）
  estimated: number; // 预估剩余时间（ms）
}

// 上传配置
export interface UploadConfig {
  // 文件字段名
  fieldName?: string;
  // 文件类型限制
  accept?: string[];
  // 文件大小限制（bytes）
  maxSize?: number;
  // 是否分片上传
  chunked?: boolean;
  // 分片大小（bytes）
  chunkSize?: number;
  // 进度回调
  onProgress?: (event: ProgressEvent) => void;
  // 成功回调
  onSuccess?: (response: any) => void;
  // 错误回调
  onError?: (error: any) => void;
}

// 下载配置
export interface DownloadConfig {
  // 文件名
  filename?: string;
  // 是否支持断点续传
  resumable?: boolean;
  // 进度回调
  onProgress?: (event: ProgressEvent) => void;
  // 成功回调
  onSuccess?: (blob: Blob) => void;
  // 错误回调
  onError?: (error: any) => void;
}

// 轮询配置
export interface PollingConfig {
  // 是否启用轮询
  enabled: boolean;
  // 轮询间隔（毫秒）
  interval: number;
  // 是否立即执行第一次请求
  immediate?: boolean;
  // 轮询任务唯一标识
  pollingId?: string;
  // 成功回调
  onSuccess?: (data: any) => void;
  // 错误回调
  onError?: (error: any) => void;
}

// 请求配置接口
export interface RequestConfig extends AxiosRequestConfig {
  // 重试配置
  retry?: Partial<RetryOptions>;
  // 轮询配置
  polling?: PollingConfig;
  // 上传配置
  upload?: UploadConfig;
  // 下载配置
  download?: DownloadConfig;
  // 是否显示加载状态
  showLoading?: boolean;
  // 是否显示错误信息
  showError?: boolean;
  // 自定义错误处理
  handleError?: (error: any) => void;
}

// 响应数据接口
export interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

// 拦截器接口
export interface HttpInterceptor {
  request?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  response?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  error?: (error: any) => any;
}

// HTTP 客户端配置
export interface HttpClientConfig {
  // 基础 URL
  baseURL?: string;
  // 超时时间
  timeout?: number;
  // 请求头
  headers?: Record<string, string>;
  // 拦截器
  interceptors?: HttpInterceptor[];
  // 重试配置
  retry?: Partial<RetryOptions>;
  // 是否自动处理取消请求
  autoCancel?: boolean;
}
