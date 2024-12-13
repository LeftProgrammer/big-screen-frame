# Authentication Module

认证模块提供了一个灵活且可扩展的身份认证解决方案，支持多种认证场景和自定义配置。

## 特性

- 🔐 完整的登录流程支持
- 🔄 Token自动续期
- 🔑 权限验证
- 🌐 第三方登录支持
- 📱 多端Token同步
- ⚡ 可扩展的认证服务
- 🎨 可自定义的登录界面

## 快速开始

### 基础使用

```typescript
import { useAuth } from '@lib/application/auth';

const auth = useAuth();

// 登录
await auth.login({
  username: 'admin',
  password: '123456'
});

// 检查认证状态
if (auth.isAuthenticated) {
  // 已登录
}

// 登出
await auth.logout();
```

### 自定义配置

```typescript
const auth = useAuth({
  // API路径配置
  apiPaths: {
    login: '/api/login',
    logout: '/api/logout',
    refresh: '/api/refresh',
    user: '/api/user'
  },

  // 路由配置
  router: {
    loginPath: '/login',
    homePath: '/dashboard',
    whiteList: ['/about', '/help']
  },

  // Token配置
  tokenSync: {
    enabled: true,
    method: 'broadcastChannel'
  },

  // 请求配置
  request: {
    publicPaths: ['/api/public', /^\/open\//],
    retryCount: 3
  }
});
```

## 主要功能

### 1. 用户认证

- 支持用户名密码登录
- JWT Token管理
- 自动Token续期
- 登录状态持久化

### 2. 权限管理

```typescript
// 检查权限
if (auth.checkPermission('admin:view')) {
  // 有权限的逻辑
}

// 检查角色
if (auth.checkRole(['admin', 'manager'])) {
  // 有角色权限的逻辑
}
```

### 3. 第三方登录

```typescript
const auth = useAuth({
  thirdParty: {
    providers: ['sso', 'oauth'],
    async handleCallback(provider, params) {
      // 处理第三方登录
    }
  }
});

// 使用第三方登录
await auth.thirdPartyLogin('sso', { code: 'xxx' });
```

### 4. Token同步

```typescript
const auth = useAuth({
  tokenSync: {
    enabled: true,
    method: 'broadcastChannel', // 或 'localStorage'
    eventName: 'auth:token:sync'
  }
});
```

### 5. 自定义登录界面

```vue
<template>
  <LoginPage
    :title="'系统登录'"
    :subtitle="'欢迎使用'"
    :logo="'/logo.png'"
    :footer="'© 2024 Company'"
  />
</template>
```

## 扩展和自定义

### 自定义认证服务

```typescript
class CustomAuthService implements IAuthService {
  constructor(private config: AuthConfig) {}

  async login(params: LoginParams) {
    // 自定义登录逻辑
  }

  // 实现其他必要方法...
}

const auth = useAuth({
  customServices: {
    authService: CustomAuthService
  }
});
```

### 认证钩子

```typescript
const auth = useAuth({
  hooks: {
    async beforeLogin(params) {
      // 登录前处理
      return params;
    },
    async afterLogin(user) {
      // 登录后处理
    },
    async beforeLogout() {
      // 登出前处理
      return true;
    },
    async afterLogout() {
      // 登出后处理
    }
  }
});
```

## API参考

### useAuth配置

| 配置项         | 类型   | 说明           |
| -------------- | ------ | -------------- |
| apiPaths       | Object | API路径配置    |
| router         | Object | 路由相关配置   |
| permission     | Object | 权限检查配置   |
| thirdParty     | Object | 第三方登录配置 |
| request        | Object | 请求相关配置   |
| tokenSync      | Object | Token同步配置  |
| hooks          | Object | 生命周期钩子   |
| customServices | Object | 自定义服务配置 |

### 组件

| 组件名    | 说明             |
| --------- | ---------------- |
| LoginPage | 默认登录页面组件 |
| LoginForm | 登录表单组件     |

## 类型定义

完整的类型定义请参考 `types/auth.types.ts` 文件。

## 注意事项

1. Token同步功能需要浏览器支持BroadcastChannel API
2. 自定义服务需要实现相应的接口
3. 第三方登录需要配置对应的回调处理函数
4. 权限验证需要后端返回正确的用户权限信息
