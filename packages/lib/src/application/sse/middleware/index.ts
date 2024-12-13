import type { SSEMiddleware, SSEConfig } from '../types';

/**
 * 日志中间件
 */
export const createLoggerMiddleware = (
  options: {
    logConnect?: boolean;
    logMessage?: boolean;
    logError?: boolean;
  } = {}
): SSEMiddleware => {
  const { logConnect = true, logMessage = true, logError = true } = options;

  return {
    name: 'logger',
    beforeConnect: async config => {
      if (logConnect) {
        console.log(`[SSE] Connecting to ${config.url}`);
      }
      return config;
    },
    afterConnect: async () => {
      if (logConnect) {
        console.log('[SSE] Connected');
      }
    },
    beforeMessage: async data => {
      if (logMessage) {
        console.log('[SSE] Received:', data);
      }
      return data;
    },
    onError: async error => {
      if (logError) {
        console.error('[SSE] Error:', error);
      }
    },
    onClose: async () => {
      if (logConnect) {
        console.log('[SSE] Closed');
      }
    }
  };
};

/**
 * 重试中间件
 */
export const createRetryMiddleware = (
  options: {
    maxAttempts?: number;
    delay?: number;
  } = {}
): SSEMiddleware => {
  const { maxAttempts = 3, delay = 1000 } = options;

  let attempts = 0;

  return {
    name: 'retry',
    beforeConnect: async config => {
      attempts = 0;
      return config;
    },
    onError: async error => {
      attempts++;
      if (attempts < maxAttempts) {
        console.log(`[SSE] Retrying... Attempt ${attempts} of ${maxAttempts}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };
};

/**
 * 认证中间件
 */
export const createAuthMiddleware = (
  getToken: () => Promise<string>,
  headerName = 'Authorization'
): SSEMiddleware => {
  return {
    name: 'auth',
    beforeConnect: async config => {
      const token = await getToken();
      const url = new URL(config.url);
      url.searchParams.set(headerName, token);
      return { ...config, url: url.toString() };
    }
  };
};

/**
 * 消息转换中间件
 */
export const createTransformMiddleware = (transform: (data: any) => any): SSEMiddleware => {
  return {
    name: 'transform',
    beforeMessage: async data => {
      return transform(data);
    }
  };
};
