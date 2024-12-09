// 错误处理模块
import type { ErrorHandler } from './types'
export * from './types'

export class ErrorHandlerImpl implements ErrorHandler {
    constructor() {}
}

export interface ErrorConfig {
    // 待定义
}
