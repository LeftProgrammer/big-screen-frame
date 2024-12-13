/**
 * 类型检查工具类
 */
export class TypeUtils {
  /**
   * 检查值是否为空
   * @param value 要检查的值
   */
  static isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  /**
   * 获取值的具体类型
   * @param value 要检查的值
   */
  static getType(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  /**
   * 检查是否是数字
   * @param value 要检查的值
   */
  static isNumber(value: any): boolean {
    if (typeof value === 'number') return !isNaN(value);
    if (typeof value === 'string') return !isNaN(Number(value));
    return false;
  }

  /**
   * 检查是否是整数
   * @param value 要检查的值
   */
  static isInteger(value: any): boolean {
    return this.isNumber(value) && Number.isInteger(Number(value));
  }

  /**
   * 检查是否是布尔值
   * @param value 要检查的值
   */
  static isBoolean(value: any): boolean {
    return typeof value === 'boolean' || value === 'true' || value === 'false';
  }

  /**
   * 检查是否是对象
   * @param value 要检查的值
   */
  static isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  /**
   * 检查是否是函数
   * @param value 要检查的值
   */
  static isFunction(value: any): boolean {
    return typeof value === 'function';
  }

  /**
   * 检查是否是Promise
   * @param value 要检查的值
   */
  static isPromise(value: any): boolean {
    return value instanceof Promise || (value && typeof value.then === 'function');
  }

  /**
   * 检查是否是有效的JSON字符串
   * @param value 要检查的值
   */
  static isValidJSON(value: string): boolean {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }
}
