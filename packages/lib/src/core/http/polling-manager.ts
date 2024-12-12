import { ref, onUnmounted } from 'vue';
import type { RequestConfig } from './types';
import type { Ref } from 'vue';

export interface PollingTask {
  id: string;
  interval: number;
  timer: ReturnType<typeof setInterval> | null;
  immediate: boolean;
  enabled: Ref<boolean>;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  config: RequestConfig;
}

/**
 * 轮询管理器
 * 负责管理和执行轮询任务
 */
export class PollingManager {
  private static instance: PollingManager;
  private tasks: Map<string, PollingTask>;
  private request: (config: RequestConfig) => Promise<any>;

  private constructor() {
    this.tasks = new Map();
  }

  public static getInstance(): PollingManager {
    if (!PollingManager.instance) {
      PollingManager.instance = new PollingManager();
    }
    return PollingManager.instance;
  }

  /**
   * 设置请求函数
   */
  public setRequestFunction(fn: (config: RequestConfig) => Promise<any>): void {
    this.request = fn;
  }

  /**
   * 创建轮询任务
   */
  public createPolling(
    config: RequestConfig & {
      pollingId: string;
      interval: number;
      immediate?: boolean;
      onSuccess?: (data: any) => void;
      onError?: (error: any) => void;
    }
  ): { enabled: Ref<boolean>; stop: () => void } {
    const { pollingId, interval, immediate = true } = config;

    // 如果已存在相同ID的任务，先停止它
    this.stopPolling(pollingId);

    // 创建响应式的启用状态
    const enabled = ref(true);

    // 创建轮询任务
    const task: PollingTask = {
      id: pollingId,
      interval,
      timer: null,
      immediate,
      enabled,
      onSuccess: config.onSuccess,
      onError: config.onError,
      config
    };

    // 执行轮询任务的函数
    const execute = async () => {
      if (!task.enabled.value) return;

      try {
        const response = await this.request(config);
        task.onSuccess?.(response);
      } catch (error) {
        task.onError?.(error);
      }
    };

    // 开始轮询
    if (immediate) {
      execute();
    }
    task.timer = setInterval(execute, interval);

    // 保存任务
    this.tasks.set(pollingId, task);

    // 返回控制接口
    return {
      enabled,
      stop: () => this.stopPolling(pollingId)
    };
  }

  /**
   * 停止轮询任务
   */
  public stopPolling(pollingId: string): void {
    const task = this.tasks.get(pollingId);
    if (task) {
      if (task.timer) {
        clearInterval(task.timer);
        task.timer = null;
      }
      this.tasks.delete(pollingId);
    }
  }

  /**
   * 暂停轮询任务
   */
  public pausePolling(pollingId: string): void {
    const task = this.tasks.get(pollingId);
    if (task) {
      task.enabled.value = false;
    }
  }

  /**
   * 恢复轮询任务
   */
  public resumePolling(pollingId: string): void {
    const task = this.tasks.get(pollingId);
    if (task) {
      task.enabled.value = true;
    }
  }

  /**
   * 停止所有轮询任务
   */
  public stopAll(): void {
    this.tasks.forEach(task => {
      if (task.timer) {
        clearInterval(task.timer);
        task.timer = null;
      }
    });
    this.tasks.clear();
  }
}
