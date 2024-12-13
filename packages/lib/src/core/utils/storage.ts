/**
 * 本地存储服务
 */
class StorageService {
  private prefix: string;

  constructor(prefix: string = 'bsf_') {
    this.prefix = prefix;
  }

  /**
   * 获取完整的键名
   * @param key 键名
   * @returns 完整的键名
   */
  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * 设置本地存储
   * @param key 键名
   * @param value 值
   */
  set<T>(key: string, value: T): void {
    const fullKey = this.getFullKey(key);
    localStorage.setItem(fullKey, JSON.stringify(value));
  }

  /**
   * 获取本地存储
   * @param key 键名
   * @returns 存储的值
   */
  get<T>(key: string): T | null {
    const fullKey = this.getFullKey(key);
    const value = localStorage.getItem(fullKey);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * 移除本地存储
   * @param key 键名
   */
  remove(key: string): void {
    const fullKey = this.getFullKey(key);
    localStorage.removeItem(fullKey);
  }

  /**
   * 清空本地存储
   */
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// 导出存储服务实例
export const storage = new StorageService();
