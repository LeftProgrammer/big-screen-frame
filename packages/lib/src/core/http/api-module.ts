import type { HttpClientConfig } from './types';
import { HttpClient } from './http-client';

export interface ApiModuleConfig extends HttpClientConfig {
  name: string;
}

export class ApiModule {
  private static modules: Map<string, ApiModule> = new Map();
  private http: HttpClient;
  private config: ApiModuleConfig;

  private constructor(config: ApiModuleConfig) {
    this.config = config;
    this.http = HttpClient.getInstance(config);
  }

  /**
   * 获取或创建 API 模块
   */
  public static getModule(config: ApiModuleConfig): ApiModule {
    let module = ApiModule.modules.get(config.name);

    if (!module) {
      module = new ApiModule(config);
      ApiModule.modules.set(config.name, module);
    }

    return module;
  }

  /**
   * 获取模块的 HTTP 客户端
   */
  public getClient(): HttpClient {
    return this.http;
  }

  /**
   * 更新模块配置
   */
  public updateConfig(config: Partial<ApiModuleConfig>): void {
    Object.assign(this.config, config);
    // 重新创建 HTTP 客户端以应用新配置
    this.http = HttpClient.getInstance({
      ...this.config,
      ...config
    });
  }

  /**
   * 获取所有模块
   */
  public static getAllModules(): Map<string, ApiModule> {
    return ApiModule.modules;
  }

  /**
   * 删除模块
   */
  public static removeModule(name: string): void {
    ApiModule.modules.delete(name);
  }
}
