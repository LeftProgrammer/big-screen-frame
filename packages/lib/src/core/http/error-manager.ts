import type { AxiosError } from 'axios';

export type ErrorHandler = (error: AxiosError) => void | Promise<void>;

export interface ErrorHandlerConfig {
  handler: ErrorHandler;
  priority?: number; // 优先级，数字越大优先级越高
}

export class ErrorManager {
  private static instance: ErrorManager;
  private handlers: ErrorHandlerConfig[] = [];

  private constructor() {}

  public static getInstance(): ErrorManager {
    if (!ErrorManager.instance) {
      ErrorManager.instance = new ErrorManager();
    }
    return ErrorManager.instance;
  }

  /**
   * 添加错误处理器
   */
  public addHandler(handler: ErrorHandler, priority = 0): void {
    this.handlers.push({ handler, priority });
    // 按优先级排序
    this.handlers.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  /**
   * 移除错误处理器
   */
  public removeHandler(handler: ErrorHandler): void {
    this.handlers = this.handlers.filter(h => h.handler !== handler);
  }

  /**
   * 清空所有错误处理器
   */
  public clearHandlers(): void {
    this.handlers = [];
  }

  /**
   * 处理错误
   */
  public async handleError(error: AxiosError): Promise<void> {
    for (const { handler } of this.handlers) {
      try {
        await handler(error);
      } catch (e) {
        console.error('Error handler failed:', e);
      }
    }
  }
}
