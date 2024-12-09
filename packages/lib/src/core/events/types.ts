// 定义事件类型
export interface Events {
    // 屏幕事件
    'screen:resize': { width: number; height: number }
    'screen:scale': { scale: number }
    
    // 主题事件
    'theme:change': { theme: string }
    
    // 自定义事件
    [key: string]: any
}

// 事件发射器接口
export interface EventEmitter {
    on<T = any>(event: string, callback: (payload: T) => void): void
    off<T = any>(event: string, callback: (payload: T) => void): void
    emit<T = any>(event: string, payload: T): void
}

// Vue 类型扩展
declare module 'vue' {
    interface ComponentCustomProperties {
        $events: EventEmitter
    }
}
