import axios, { Canceler } from 'axios';

/**
 * 请求取消管理器
 */
export class CancelManager {
  private static instance: CancelManager;
  private pendingMap: Map<string, Canceler>;

  private constructor() {
    this.pendingMap = new Map();
  }

  public static getInstance(): CancelManager {
    if (!CancelManager.instance) {
      CancelManager.instance = new CancelManager();
    }
    return CancelManager.instance;
  }

  /**
   * 生成请求的唯一键
   */
  private generateKey(config: any): string {
    const { url, method, params, data } = config;
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
  }

  /**
   * 添加请求
   */
  public addPending(config: any): void {
    const key = this.generateKey(config);
    config.cancelToken = new axios.CancelToken(cancel => {
      if (!this.pendingMap.has(key)) {
        this.pendingMap.set(key, cancel);
      }
    });
  }

  /**
   * 移除请求
   */
  public removePending(config: any): void {
    const key = this.generateKey(config);
    if (this.pendingMap.has(key)) {
      const cancel = this.pendingMap.get(key);
      cancel && cancel('Request canceled');
      this.pendingMap.delete(key);
    }
  }

  /**
   * 清除所有请求
   */
  public removeAll(): void {
    this.pendingMap.forEach(cancel => {
      cancel && cancel('Request canceled');
    });
    this.pendingMap.clear();
  }

  /**
   * 重置
   */
  public reset(): void {
    this.removeAll();
  }
}
