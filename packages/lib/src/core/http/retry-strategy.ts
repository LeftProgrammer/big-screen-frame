import type { AxiosError } from 'axios';

export interface RetryOptions {
  // 重试次数
  count: number;
  // 基础延迟时间（毫秒）
  baseDelay: number;
  // 最大延迟时间（毫秒）
  maxDelay?: number;
  // 是否使用指数退避策略
  useExponentialBackoff?: boolean;
  // 自定义重试条件
  shouldRetry?: (error: AxiosError) => boolean | Promise<boolean>;
  // 重试前回调
  onRetry?: (retryCount: number, error: AxiosError) => void | Promise<void>;
}

/**
 * 重试策略管理器
 */
export class RetryStrategy {
  /**
   * 默认重试选项
   */
  private static defaultOptions: RetryOptions = {
    count: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    useExponentialBackoff: true,
    shouldRetry: (error: AxiosError) => {
      // 默认对这些状态码进行重试
      const retryStatusCodes = [408, 429, 500, 502, 503, 504];
      return !error.response || retryStatusCodes.includes(error.response.status);
    }
  };

  /**
   * 计算延迟时间
   */
  private static calculateDelay(retryCount: number, options: RetryOptions): number {
    let delay = options.baseDelay;

    if (options.useExponentialBackoff) {
      // 使用指数退避策略，每次重试延迟时间翻倍
      delay = delay * Math.pow(2, retryCount);

      // 添加随机抖动，避免多个请求同时重试
      delay = delay * (0.5 + Math.random());
    }

    // 确保不超过最大延迟时间
    if (options.maxDelay) {
      delay = Math.min(delay, options.maxDelay);
    }

    return delay;
  }

  /**
   * 执行重试策略
   */
  public static async execute<T>(
    request: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<T> {
    // 合并选项
    const finalOptions: RetryOptions = {
      ...RetryStrategy.defaultOptions,
      ...options
    };

    let lastError: AxiosError;

    for (let retryCount = 0; retryCount < finalOptions.count; retryCount++) {
      try {
        return await request();
      } catch (error) {
        lastError = error as AxiosError;

        // 检查是否应该重试
        const shouldRetry = await finalOptions.shouldRetry(lastError);
        if (!shouldRetry) {
          throw lastError;
        }

        // 如果不是最后一次重试，则等待后重试
        if (retryCount < finalOptions.count - 1) {
          // 触发重试回调
          if (finalOptions.onRetry) {
            await finalOptions.onRetry(retryCount + 1, lastError);
          }

          // 计算延迟时间并等待
          const delay = RetryStrategy.calculateDelay(retryCount, finalOptions);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // 如果所有重试都失败，抛出最后一个错误
    throw lastError;
  }
}
