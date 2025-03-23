/**
 * 获取图片资源的URL
 * @param path 图片相对路径 (相对于assets目录)
 * @returns 图片的完整URL
 * @example getImageUrl('img/icon/1.png')
 */
export const getImageUrl = (path: string): string => {
  return new URL(`../assets/${path}`, import.meta.url).href;
}; 