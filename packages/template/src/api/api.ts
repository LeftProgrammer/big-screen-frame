import { $http } from "@jinghe/jinghe-lanhai";
import type { AxiosRequestConfig } from "axios";
import UtilVar from "../config/UtilVar";

// 导出基础URL，保持与原代码兼容
let baseUrl = UtilVar.baseUrl;
export { baseUrl };

// 参数和文件配置类型定义，保持与原代码一致
export type Params = { [key: string]: string | number };
export type FileConfig = {
  setCancel?: Function;
  onProgress?: Function;
  [key: string]: any;
};

/**
 * @description: get 请求方法
 * @param {string} url 请求地址
 * @param {Params} params 请求参数
 * @return {*}
 */
export const GET = async (url: string, params: Params): Promise<any> => {
  try {
    const data = await $http.get(`${baseUrl}${url}`, params);
    return data;
  } catch (error: any) {
    return Promise.reject(error.message || error);
  }
};

/**
 * @description: post请求方法
 * @param {any} url
 * @param {any} params
 * @return {any}
 */
export const POST = async (url: string, params: Params): Promise<any> => {
  try {
    const data = await $http.post(`${baseUrl}${url}`, params);
    return data;
  } catch (error: any) {
    return Promise.reject(error.message || error);
  }
};

/**
 * @description: 没有基地址 访问根目录下文件
 * @param {string} url
 * @param {Params} params
 * @return {*}
 */
export const GETNOBASE = async (url: string, params?: Params): Promise<any> => {
  try {
    // 注意: 这里使用完整URL，不添加baseUrl
    const data = await $http.get(url, params, { baseURL: '' });
    return data;
  } catch (error: any) {
    return Promise.reject(error.message || error);
  }
};

/**
 * @description: @文件类型提交方法
 * @param {string} url
 * @param {Params} params
 * @param {FileConfig} config
 * @return {*}
 */
export const FILEPOST = async (url: string, params: Params, config: FileConfig = {}): Promise<any> => {
  try {
    // 准备cancelToken的处理函数
    let cancelToken;
    if (config.setCancel) {
      cancelToken = $http.getCancelToken((c: any) => {
        if (typeof config.setCancel === 'function') {
          config.setCancel(c);
        }
      });
    }

    const data = await $http.post(`${baseUrl}${url}`, params, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e: any) => {
        if (e.total > 0) {
          e.percent = (e.loaded / e.total) * 100;
        }
        config.onProgress && config.onProgress(e);
      },
      cancelToken
    });
    return data;
  } catch (error: any) {
    return Promise.reject(error.message || error);
  }
};

/**
 * 下载文档流
 * @param {config.responseType} 下载文件流根据后端 配置   arraybuffer || blob
 */
export const FILE = async (config: FileConfig = {}) => {
  try {
    const data = await $http.request({
      method: config.method || "get",
      url: `${baseUrl}${config.url}`,
      data: config.body || {},
      params: config.param || {},
      responseType: config.responseType || "blob",
      onDownloadProgress: (e: any) => {
        config.onProgress && config.onProgress(e);
      }
    });
    return data;
  } catch (error: any) {
    return Promise.reject(error.message || error);
  }
};

export const PUT = async (url: string, params: Params) => {
  try {
    const data = await $http.put(`${baseUrl}${url}`, params);
    return data;
  } catch (error: any) {
    return Promise.reject(error.message || error);
  }
};

// 因为delete是关键字，使用替代方式处理
export const DELETE = async (url: string, params: Params) => {
  try {
    // 使用request方法代替直接调用delete
    const data = await $http.request({
      method: 'delete',
      url: `${baseUrl}${url}`,
      data: params
    });
    return data;
  } catch (error: any) {
    return Promise.reject(error.message || error);
  }
};
