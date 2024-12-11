/**
 * 过渡动画管理器
 * 用于管理全局过渡动画配置
 */

// 过渡动画配置接口
export interface TransitionConfig {
  // 是否启用过渡动画
  enableTransition: boolean;
  // 过渡动画持续时间（毫秒）
  duration: number;
}

export class TransitionManager {
  private static instance: TransitionManager;
  private config: TransitionConfig = {
    enableTransition: true,
    duration: 300
  };

  private constructor() {
    this.init();
  }

  public static getInstance(): TransitionManager {
    if (!TransitionManager.instance) {
      TransitionManager.instance = new TransitionManager();
    }
    return TransitionManager.instance;
  }

  private init() {
    this.applyConfig();
  }

  private applyConfig() {
    const html = document.documentElement;
    const { enableTransition, duration } = this.config;

    if (enableTransition) {
      html.style.setProperty('--bsf-transition-duration', `${duration}ms`);
      html.classList.remove('no-transitions');
    } else {
      html.style.removeProperty('--bsf-transition-duration');
      html.classList.add('no-transitions');
    }
  }

  /**
   * 获取当前过渡动画配置
   */
  public getConfig(): TransitionConfig {
    return { ...this.config };
  }

  /**
   * 更新过渡动画配置
   * @param config 新的配置
   */
  public updateConfig(config: Partial<TransitionConfig>) {
    this.config = {
      ...this.config,
      ...config
    };
    this.applyConfig();
  }

  /**
   * 启用或禁用过渡动画
   * @param enable 是否启用
   */
  public setEnable(enable: boolean) {
    this.updateConfig({ enableTransition: enable });
  }

  /**
   * 设置过渡动画持续时间
   * @param duration 持续时间（毫秒）
   */
  public setDuration(duration: number) {
    this.updateConfig({ duration });
  }

  /**
   * 重置为默认配置
   */
  public reset() {
    this.config = {
      enableTransition: true,
      duration: 300
    };
    this.applyConfig();
  }
}
