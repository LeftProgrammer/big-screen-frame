# HTTP 请求模块

一个功能强大、易于扩展的 HTTP 请求模块，基于 Axios 封装，提供了丰富的功能特性。

## 特性

- 🚀 支持请求重试和轮询
- 🔄 动态请求头管理
- 🎯 统一的错误处理机制
- 📦 API 模块化管理
- 📤 文件上传（支持分片）
- 📥 文件下载（支持进度监控）
- ⚡ 请求取消支持
- 🔧 高度可配置

## 安装

```bash
# 项目内置模块，无需单独安装
```

## 基础使用

### 创建实例

```typescript
import { http, createHttp } from '@/core/http';

// 使用默认实例
await http.get('/api/data');

// 创建自定义实例
const customHttp = createHttp({
  baseURL: 'https://api.example.com',
  timeout: 5000
});
```

### 基础请求方法

```typescript
// GET 请求
const response = await http.get('/api/users');

// POST 请求
const response = await http.post('/api/users', {
  name: 'John',
  age: 30
});

// PUT 请求
const response = await http.put('/api/users/1', {
  name: 'John Updated'
});

// DELETE 请求
const response = await http.delete('/api/users/1');
```

## 高级特性

### 请求重试

```typescript
// 配置重试选项
const response = await http.get('/api/data', {
  retry: {
    count: 3, // 重试次数
    baseDelay: 1000, // 基础延迟（毫秒）
    maxDelay: 5000, // 最大延迟（毫秒）
    useExponentialBackoff: true // 使用指数退避策略
  }
});
```

### 请求轮询

```typescript
// 启用轮询
const response = await http.get('/api/status', {
  polling: {
    enabled: true, // 启用轮询
    interval: 5000, // 轮询间隔（毫秒）
    immediate: true, // 立即执行第一次请求
    onSuccess: data => {
      console.log('轮询成功:', data);
    },
    onError: error => {
      console.error('轮询失败:', error);
    }
  }
});

// 停止所有轮询
http.stopAllPolling();
```

### 动态请求头

```typescript
// 设置静态请求头
http.setHeader('X-Custom-Header', 'value');

// 设置动态请求头
http.setHeader('Authorization', async () => {
  const token = await getToken();
  return `Bearer ${token}`;
});

// 移除请求头
http.removeHeader('X-Custom-Header');
```

### 错误处理

```typescript
// 添加全局错误处理器
http.addErrorHandler(error => {
  if (error.response?.status === 401) {
    router.push('/login');
  }
}, 10); // 高优先级

// 添加业务错误处理器
http.addErrorHandler(error => {
  ElMessage.error(error.message);
}, 0); // 低优先级

// 请求级别的错误处理
await http.get('/api/data', {
  handleError: error => {
    console.error('请求失败:', error);
  }
});
```

### API 模块化

```typescript
import { ApiModule } from '@/core/http';

// 创建用户模块
const userApi = ApiModule.getModule({
  name: 'user',
  baseURL: '/api/user',
  timeout: 3000,
  headers: {
    'X-Module': 'user'
  }
});

// 使用模块
await userApi.getClient().get('/profile');

// 更新模块配置
userApi.updateConfig({
  timeout: 5000
});
```

### 文件上传

```typescript
// 普通上传
await http.upload('/api/upload', file, {
  upload: {
    fieldName: 'file', // 文件字段名
    maxSize: 5 * 1024 * 1024, // 最大文件大小（5MB）
    accept: ['image/jpeg', 'image/png'], // 允许的文件类型
    onProgress: event => {
      console.log(`上传进度: ${event.progress}%`);
    }
  }
});

// 分片上传
await http.upload('/api/upload', file, {
  upload: {
    chunked: true, // 启用分片上传
    chunkSize: 1024 * 1024, // 分片大小（1MB）
    onProgress: event => {
      console.log(`上传进度: ${event.progress}%`);
    }
  }
});
```

### 文件下载

```typescript
// 自定义文件名下载
await http.download('/api/download', {
  download: {
    filename: 'custom-name.pdf',
    onProgress: event => {
      console.log(`下载进度: ${event.progress}%`);
    }
  }
});

// 自定义处理下载内容
await http.download('/api/download', {
  download: {
    onSuccess: blob => {
      // 自定义处理下载的文件
      const url = URL.createObjectURL(blob);
      // ... 其他处理
    }
  }
});
```

## 类型定义

### 请求配置

```typescript
interface RequestConfig extends AxiosRequestConfig {
  retry?: Partial<RetryOptions>; // 重试配置
  polling?: PollingConfig; // 轮询配置
  upload?: UploadConfig; // 上传配置
  download?: DownloadConfig; // 下载配置
  showLoading?: boolean; // 是否显示加载状态
  showError?: boolean; // 是否显示错误信息
  handleError?: (error: any) => void; // 错误处理函数
}
```

### 响应数据

```typescript
interface ResponseData<T = any> {
  code: number; // 状态码
  data: T; // 响应数据
  message: string; // 响应消息
}
```

## 最佳实践

### 1. API 模块化管理

推荐按业务模块创建不同的 API 实例：

```typescript
// apis/user.ts
const userApi = ApiModule.getModule({
  name: 'user',
  baseURL: '/api/user'
});

export const getUserProfile = () => userApi.getClient().get('/profile');
export const updateUser = data => userApi.getClient().put('/update', data);

// apis/order.ts
const orderApi = ApiModule.getModule({
  name: 'order',
  baseURL: '/api/order'
});

export const getOrders = () => orderApi.getClient().get('/list');
export const createOrder = data => orderApi.getClient().post('/create', data);
```

### 2. 统一错误处理

```typescript
// 创建错误处理器
const errorHandlers = {
  // 处理认证错误
  authErrorHandler: error => {
    if (error.response?.status === 401) {
      router.push('/login');
    }
  },

  // 处理业务错误
  businessErrorHandler: error => {
    const message = error.response?.data?.message || '操作失败';
    ElMessage.error(message);
  },

  // 处理网络错误
  networkErrorHandler: error => {
    if (!navigator.onLine) {
      ElMessage.error('网络连接已断开');
    }
  }
};

// 注册错误处理器
Object.entries(errorHandlers).forEach(([name, handler], index) => {
  http.addErrorHandler(handler, index * 10);
});
```

### 3. 请求重试策略

```typescript
// 创建针对特定场景的重试配置
const retryConfigs = {
  // 关键请求：多次重试，较短延迟
  critical: {
    count: 5,
    baseDelay: 500,
    maxDelay: 3000,
    useExponentialBackoff: true
  },

  // 普通请求：少次重试，较长延迟
  normal: {
    count: 3,
    baseDelay: 1000,
    maxDelay: 5000,
    useExponentialBackoff: true
  }
};

// 使用重试配置
await http.get('/api/important-data', {
  retry: retryConfigs.critical
});
```

## 注意事项

1. **内存管理**

   - 及时取消不需要的请求
   - 停止不需要的轮询
   - 清理文件上传/下载的临时资源

2. **错误处理**

   - 合理设置错误处理器的优先级
   - 避免在错误处理器中执行耗时操作
   - 确保错误信息对用户友好

3. **性能优化**

   - 合理使用请求取消功能
   - 适当设置请求超时时间
   - 大文件上传时使用分片上传

4. **安全性**
   - 敏感信息不要直接存储在请求头中
   - 文件上传前进行类型和大小验证
   - 使用 HTTPS 进行安全传输

## 常见问题

1. **Q: 如何处理登录失效？**
   A: 使用错误拦截器统一处理 401 错误：

   ```typescript
   http.addErrorHandler(error => {
     if (error.response?.status === 401) {
       store.dispatch('user/logout');
       router.push('/login');
     }
   }, 100);
   ```

2. **Q: 如何避免重复请求？**
   A: 启用自动取消功能：

   ```typescript
   const http = createHttp({
     autoCancel: true
   });
   ```

3. **Q: 如何实现并发请求限制？**
   A: 使用请求队列和 Promise.all：

   ```typescript
   const queue = [];
   const limit = 3;

   for (let i = 0; i < requests.length; i += limit) {
     const batch = requests.slice(i, i + limit);
     const results = await Promise.all(batch.map(req => http.request(req)));
     queue.push(...results);
   }
   ```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支
3. 提交变更
4. 发起 Pull Request

## 许可证

MIT License
