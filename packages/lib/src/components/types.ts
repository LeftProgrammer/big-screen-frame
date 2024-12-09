import type { Component } from 'vue'

// 组件配置
export interface ComponentOptions {
    [key: string]: any
}

// 组件注册信息
export interface ComponentRegisterInfo {
    name: string
    component: Component
    defaultConfig?: Record<string, any>
}

// 插件注册信息
export interface PluginRegisterInfo {
    name: string
    setup: (options: any) => void
    defaultConfig?: Record<string, any>
}
