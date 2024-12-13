import type { WebSocketMiddleware } from '../types';

/**
 * 日志中间件
 */
export const createLoggerMiddleware = (
  options: {
    logConnect?: boolean;
    logMessage?: boolean;
    logError?: boolean;
  } = {}
): WebSocketMiddleware => {
  const { logConnect = true, logMessage = true, logError = true } = options;

  return {
    name: 'logger',
    beforeConnect: async config => {
      if (logConnect) {
        console.log(`[WebSocket] Connecting to ${config.url}`);
      }
      return config;
    },
    afterConnect: async () => {
      if (logConnect) {
        console.log('[WebSocket] Connected');
      }
    },
    beforeMessage: async data => {
      if (logMessage) {
        console.log('[WebSocket] Received:', data);
      }
      return data;
    },
    onError: async error => {
      if (logError) {
        console.error('[WebSocket] Error:', error);
      }
    },
    onClose: async event => {
      if (logConnect) {
        console.log('[WebSocket] Closed:', event.code, event.reason);
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
): WebSocketMiddleware => {
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
        console.log(`[WebSocket] Retrying... Attempt ${attempts} of ${maxAttempts}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('[WebSocket] Max retry attempts reached');
      }
    }
  };
};

/**
 * 认证中间件
 */
export const createAuthMiddleware = (options: {
  getToken: () => string | Promise<string>;
  headerName?: string;
}): WebSocketMiddleware => {
  const { getToken, headerName = 'Authorization' } = options;

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
export const createTransformMiddleware = (options: {
  transform: (data: any) => any;
}): WebSocketMiddleware => {
  const { transform } = options;

  return {
    name: 'transform',
    beforeMessage: async data => {
      return transform(data);
    }
  };
};
