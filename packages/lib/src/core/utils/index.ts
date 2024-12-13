// 导出存储服务
export { storage } from './storage.ts';

// 导出URL工具
export { URLUtils } from './url.ts';

// 导出日期时间工具
export { DateTimeUtils } from './datetime.ts';

// 导出类型检查工具
export { TypeUtils } from './type-check.ts';

// Utils module initialization
export const setupUtils = () => {
  console.log('Utils module initialized');
};
