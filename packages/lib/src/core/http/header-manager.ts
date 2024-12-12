import { reactive } from 'vue';

export interface HeadersMap {
  [key: string]: string | (() => string | Promise<string>);
}

export class HeaderManager {
  private static instance: HeaderManager;
  private headers: HeadersMap = reactive({});

  private constructor() {}

  public static getInstance(): HeaderManager {
    if (!HeaderManager.instance) {
      HeaderManager.instance = new HeaderManager();
    }
    return HeaderManager.instance;
  }

  /**
   * 设置请求头
   */
  public setHeader(key: string, value: string | (() => string | Promise<string>)): void {
    this.headers[key] = value;
  }

  /**
   * 批量设置请求头
   */
  public setHeaders(headers: HeadersMap): void {
    Object.assign(this.headers, headers);
  }

  /**
   * 删除请求头
   */
  public removeHeader(key: string): void {
    delete this.headers[key];
  }

  /**
   * 清空所有请求头
   */
  public clearHeaders(): void {
    Object.keys(this.headers).forEach(key => {
      delete this.headers[key];
    });
  }

  /**
   * 获取所有请求头
   */
  public async getHeaders(): Promise<Record<string, string>> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(this.headers)) {
      if (typeof value === 'function') {
        result[key] = await value();
      } else {
        result[key] = value;
      }
    }

    return result;
  }
}
