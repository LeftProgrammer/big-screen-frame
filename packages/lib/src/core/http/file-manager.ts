import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { UploadConfig, DownloadConfig, ProgressEvent } from './types';

export class FileManager {
  private static instance: FileManager;

  private constructor() {}

  public static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }

  /**
   * 创建文件上传请求配置
   */
  public createUploadConfig(file: File | Blob, config: UploadConfig): AxiosRequestConfig {
    const formData = new FormData();
    formData.append(config.fieldName || 'file', file);

    return {
      headers: { 'Content-Type': 'multipart/form-data' },
      data: formData,
      onUploadProgress: (progressEvent: any) => {
        if (config.onProgress) {
          const progress = this.calculateProgress(progressEvent);
          config.onProgress(progress);
        }
      }
    };
  }

  /**
   * 创建文件下载请求配置
   */
  public createDownloadConfig(config: DownloadConfig): AxiosRequestConfig {
    return {
      responseType: 'blob',
      onDownloadProgress: (progressEvent: any) => {
        if (config.onProgress) {
          const progress = this.calculateProgress(progressEvent);
          config.onProgress(progress);
        }
      }
    };
  }

  /**
   * 处理文件下载响应
   */
  public handleDownloadResponse(response: AxiosResponse, config: DownloadConfig): void {
    const blob = new Blob([response.data]);

    if (config.onSuccess) {
      config.onSuccess(blob);
    } else {
      // 默认行为：触发浏览器下载
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = config.filename || this.getFilenameFromResponse(response);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }

  /**
   * 分片上传
   */
  public async uploadInChunks(file: File, config: UploadConfig): Promise<void> {
    const chunkSize = config.chunkSize || 1024 * 1024; // 默认 1MB
    const chunks = Math.ceil(file.size / chunkSize);
    let uploadedChunks = 0;
    let uploadedBytes = 0;
    const startTime = Date.now();

    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      // TODO: 实现分片上传逻辑
      uploadedChunks++;
      uploadedBytes += chunk.size;

      if (config.onProgress) {
        config.onProgress({
          loaded: uploadedBytes,
          total: file.size,
          progress: uploadedBytes / file.size,
          bytes: uploadedBytes,
          rate: uploadedBytes / ((Date.now() - startTime) / 1000),
          estimated: ((file.size - uploadedBytes) * (Date.now() - startTime)) / uploadedBytes
        });
      }
    }
  }

  /**
   * 从响应头中获取文件名
   */
  private getFilenameFromResponse(response: AxiosResponse): string {
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.indexOf('filename') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        return matches[1].replace(/['"]/g, '');
      }
    }
    return 'download';
  }

  /**
   * 计算进度事件
   */
  private calculateProgress(event: any): ProgressEvent {
    const progress = event.total ? event.loaded / event.total : 0;

    return {
      loaded: event.loaded,
      total: event.total,
      progress,
      bytes: event.loaded,
      rate: 0, // TODO: 实现速率计算
      estimated: 0 // TODO: 实现预估时间计算
    };
  }
}
