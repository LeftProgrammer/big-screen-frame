import type { App } from 'vue'
import type { EventEmitter, Events } from './types'

// 全局事件管理器
class GlobalEvents implements EventEmitter {
    private static instance: GlobalEvents
    private events = new Map<string, Set<Function>>()
    
    private constructor() {}
    
    static getInstance() {
        if (!GlobalEvents.instance) {
            GlobalEvents.instance = new GlobalEvents()
        }
        return GlobalEvents.instance
    }
    
    on<K extends keyof Events>(event: K, callback: (payload: Events[K]) => void) {
        if (!this.events.has(event as string)) {
            this.events.set(event as string, new Set())
        }
        this.events.get(event as string)!.add(callback)
    }
    
    off<K extends keyof Events>(event: K, callback: (payload: Events[K]) => void) {
        const handlers = this.events.get(event as string)
        if (handlers) {
            handlers.delete(callback)
        }
    }
    
    emit<K extends keyof Events>(event: K, payload: Events[K]) {
        const handlers = this.events.get(event as string)
        if (handlers) {
            handlers.forEach(handler => handler(payload))
        }
    }
}

// 导出全局事件实例
export const globalEvents = GlobalEvents.getInstance()

// 在组件中使用的钩子
export function useEvents() {
    return globalEvents
}

// 安装插件
export function setupEvents(app: App) {
    app.config.globalProperties.$events = globalEvents
}
