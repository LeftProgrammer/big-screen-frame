declare global {
  interface Window {
    // 全局类型声明
    __JINGHE_LANHAI_VERSION__: string;
  }

  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
  };
}
