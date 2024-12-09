// 网格配置
export interface GridOptions {
    enabled: boolean
    size: number
    color?: string
    opacity?: number
}

// 布局配置
export interface LayoutOptions {
    // 自动调整大小
    autoResize: boolean
    // 网格配置
    grid: GridOptions
}
