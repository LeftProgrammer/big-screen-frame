# Router Module

路由模块提供了一个灵活且可扩展的路由管理解决方案，支持多种路由场景和自定义配置。

## 特性

- 🚦 默认页面导航
- 🔄 动态路由加载
- 🔐 权限路由控制
- 🎨 页面过渡动画
- 📦 路由缓存管理
- 🌐 多实例支持
- ⚡ 模块化路由
- 🎯 全局事件监听

## 快速开始

### 基础使用

```typescript
import { useRouter } from '@lib/application/router';

const router = useRouter();

// 基础导航
router.push('/dashboard');

// 带参数导航
router.push({
  path: '/user',
  query: { id: 1 }
});

// 命名路由
router.push({
  name: 'user-detail',
  params: { id: 1 }
});
```

### 自定义配置

```typescript
const router = useRouter({
  // 路由模式配置
  mode: 'history',
  base: '/',

  // 默认路由配置
  routes: {
    home: '/dashboard',
    login: '/login',
    error: '/404'
  },

  // 过渡动画配置
  transition: {
    name: 'fade',
    mode: 'out-in'
  },

  // 进度条配置
  progress: {
    color: '#1890ff',
    duration: 300
  },

  // 缓存配置
  cache: {
    max: 10,
    include: ['Dashboard', 'UserProfile']
  }
});
```

## 主要功能

### 1. 动态路由注册

```typescript
// 注册单个路由
router.addRoute({
  path: '/custom',
  name: 'CustomPage',
  component: () => import('./CustomPage.vue'),
  meta: {
    title: '自定义页面',
    requiresAuth: true
  }
});

// 注册模块路由
router.addRouteModule('admin', adminRoutes);
```

### 2. 权限控制

```typescript
// 配置权限守卫
router.beforeEach(async (to, from) => {
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: '/login' };
  }

  if (to.meta.permissions) {
    const hasPermission = await auth.checkPermissions(to.meta.permissions);
    if (!hasPermission) {
      return { path: '/403' };
    }
  }
});
```

### 3. 路由缓存

```typescript
// 组件内使用
<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="cachedViews">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

// 控制缓存
router.cache.add('UserList');
router.cache.remove('UserList');
```

### 4. 全局事件

```typescript
// 监听路由事件
router.on('beforeEnter', (to, from) => {
  // 路由进入前的处理
});

router.on('afterLeave', (to, from) => {
  // 路由离开后的处理
});
```

### 5. 多实例支持

```typescript
// 创建新的路由实例
const subRouter = router.createInstance('sub', {
  base: '/sub',
  routes: subRoutes
});

// 切换实例
router.switchInstance('sub');
```

## 进阶用法

### 模块化路由

```typescript
// 定义模块路由
const userModule = {
  name: 'user',
  routes: [
    {
      path: '/user',
      component: UserLayout,
      children: [
        {
          path: 'list',
          name: 'UserList',
          component: () => import('./views/UserList.vue')
        }
      ]
    }
  ],
  beforeEnter: to => {
    // 模块级路由守卫
  }
};

// 注册模块
router.registerModule(userModule);
```

### 动态权限路由

```typescript
// 根据用户角色动态生成路由
const routes = await router.generateRoutes(userRoles);

// 注册动态路由
router.addRoutes(routes);
```

### 自定义过渡动画

```typescript
router.setTransition({
  name: 'custom-transition',
  mode: 'out-in',
  onBeforeEnter: el => {
    // 自定义进入前动画
  },
  onAfterLeave: el => {
    // 自定义离开后动画
  }
});
```
