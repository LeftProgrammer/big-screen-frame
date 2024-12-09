// 主题类型定义
export type ThemeType = 'dark' | 'light' | string

// 主题配置选项
export interface ThemeOptions {
    type: ThemeType
    // 可以添加更多主题相关的配置
}
