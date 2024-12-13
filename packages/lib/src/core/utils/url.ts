/**
 * URL工具类
 */
export class URLUtils {
  /**
   * 解析URL参数为对象
   * @param url URL字符串
   * @returns 参数对象
   */
  static parseParams(url: string): Record<string, string> {
    try {
      const params: Record<string, string> = {};
      if (!url.includes('?')) return params;

      const searchParams = new URLSearchParams(url.split('?')[1]);
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
      return params;
    } catch (error) {
      console.error('Error parsing URL parameters:', error);
      return {};
    }
  }

  /**
   * 将对象转换为URL参数字符串
   * @param params 参数对象
   * @returns URL参数字符串
   */
  static buildQueryString(params: Record<string, any>): string {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      return queryString ? `?${queryString}` : '';
    } catch (error) {
      console.error('Error building query string:', error);
      return '';
    }
  }

  /**
   * 合并基础URL和参数对象
   * @param baseUrl 基础URL
   * @param params 参数对象
   * @returns 完整的URL
   */
  static buildURL(baseUrl: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) return baseUrl;
    const queryString = this.buildQueryString(params);
    return `${baseUrl}${queryString}`;
  }

  /**
   * 从URL中提取域名
   * @param url URL字符串
   * @returns 域名
   */
  static extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      console.error('Error extracting domain:', error);
      return '';
    }
  }

  /**
   * 判断是否是有效的URL
   * @param url URL字符串
   * @returns 是否有效
   */
  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
