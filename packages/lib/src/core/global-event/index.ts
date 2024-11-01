// global-events.ts

type EventCallback = (event: Event) => void;

interface EventOptions {
  passive?: boolean;
  capture?: boolean;
  once?: boolean;
}

class GlobalEventManager {
  private events: Map<string, Map<EventCallback, EventOptions>>;

  constructor() {
    this.events = new Map();
  }

  /**
   * 注册全局事件监听
   * @param eventType - 事件类型，如 'resize', 'click', 'online' 等
   * @param callback - 回调函数
   * @param options - 可选项，用于配置事件监听器
   */
  public addEventListener(
    eventType: string,
    callback: EventCallback,
    options: EventOptions = {}
  ): void {
    if (!this.events.has(eventType)) {
      this.events.set(eventType, new Map());
    }

    // 检查事件是否已绑定，避免重复绑定
    const eventCallbacks = this.events.get(eventType);
    if (eventCallbacks && !eventCallbacks.has(callback)) {
      eventCallbacks.set(callback, options);
      window.addEventListener(eventType, callback, options);
    }
  }

  /**
   * 移除全局事件监听
   * @param eventType - 事件类型
   * @param callback - 回调函数
   */
  public removeEventListener(eventType: string, callback: EventCallback): void {
    const eventCallbacks = this.events.get(eventType);
    if (eventCallbacks && eventCallbacks.has(callback)) {
      const options = eventCallbacks.get(callback);
      window.removeEventListener(eventType, callback, options);
      eventCallbacks.delete(callback);

      // 如果该事件类型没有剩余回调，删除该事件类型
      if (eventCallbacks.size === 0) {
        this.events.delete(eventType);
      }
    }
  }

  /**
   * 清除所有注册的事件监听
   */
  public clearAllEvents(): void {
    this.events.forEach((eventCallbacks, eventType) => {
      eventCallbacks.forEach((options, callback) => {
        window.removeEventListener(eventType, callback, options);
      });
    });
    this.events.clear();
  }

  /**
   * 注册自定义事件监听
   * @param eventType - 自定义事件类型
   * @param target - 事件目标
   * @param callback - 回调函数
   * @param options - 可选项，用于配置事件监听器
   */
  public addCustomEvent(
    eventType: string,
    target: EventTarget,
    callback: EventCallback,
    options: EventOptions = {}
  ): void {
    if (!this.events.has(eventType)) {
      this.events.set(eventType, new Map());
    }

    const eventCallbacks = this.events.get(eventType);
    if (eventCallbacks && !eventCallbacks.has(callback)) {
      eventCallbacks.set(callback, options);
      target.addEventListener(eventType, callback, options);
    }
  }

  /**
   * 移除自定义事件监听
   * @param eventType - 自定义事件类型
   * @param target - 事件目标
   * @param callback - 回调函数
   */
  public removeCustomEvent(eventType: string, target: EventTarget, callback: EventCallback): void {
    const eventCallbacks = this.events.get(eventType);
    if (eventCallbacks && eventCallbacks.has(callback)) {
      const options = eventCallbacks.get(callback);
      target.removeEventListener(eventType, callback, options);
      eventCallbacks.delete(callback);

      if (eventCallbacks.size === 0) {
        this.events.delete(eventType);
      }
    }
  }
}

export const globalEvents = new GlobalEventManager();
export default globalEvents;
