<!-- Middleware Usage Example -->
<template>
  <div class="middleware-example">
    <h2>Router Middleware Example</h2>
    <div class="example-section">
      <h3>Middleware Configuration</h3>
      <el-table :data="middlewares" style="width: 100%">
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="order" label="Order" />
        <el-table-column prop="description" label="Description" />
      </el-table>

      <h3>Test Routes</h3>
      <div class="button-group">
        <el-button type="primary" @click="navigateToPublic">Access Public Route</el-button>
        <el-button type="warning" @click="navigateToProtected">Access Protected Route</el-button>
        <el-button type="danger" @click="navigateToAdmin">Access Admin Route</el-button>
      </div>

      <h3>Navigation History</h3>
      <el-timeline>
        <el-timeline-item
          v-for="(record, index) in navigationHistory"
          :key="index"
          :type="record.type"
          :timestamp="record.timestamp"
        >
          {{ record.message }}
        </el-timeline-item>
      </el-timeline>

      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
        style="margin-top: 20px"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { RouterService, createRouterService } from '@lib/application/router';
import type { NavigationGuard, RouteLocationNormalized } from 'vue-router';
import dayjs from 'dayjs';

interface NavigationRecord {
  message: string;
  timestamp: string;
  type: 'primary' | 'success' | 'warning' | 'danger';
}

// 创建路由服务实例
const router = createRouterService({
  mode: 'hash',
  base: '/',
  defaultRoutes: true
});

const error = ref('');
const navigationHistory = ref<NavigationRecord[]>([]);

// Example middlewares
const middlewares = [
  {
    name: 'Logger',
    order: 1,
    description: 'Logs all navigation attempts',
    handler: async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuard
    ) => {
      addNavigationRecord({
        message: `Navigating from ${from.path} to ${to.path}`,
        type: 'primary'
      });
      next();
    }
  },
  {
    name: 'Authentication',
    order: 2,
    description: 'Checks if user is authenticated for protected routes',
    handler: async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuard
    ) => {
      if (to.meta.requiresAuth) {
        // Simulate auth check
        const isAuthenticated = false;
        if (!isAuthenticated) {
          error.value = 'Authentication required!';
          addNavigationRecord({
            message: 'Access denied: Authentication required',
            type: 'warning'
          });
          return next({ path: '/login' });
        }
      }
      next();
    }
  },
  {
    name: 'Authorization',
    order: 3,
    description: 'Checks user permissions for admin routes',
    handler: async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuard
    ) => {
      if (to.meta.requiresAdmin) {
        // Simulate admin check
        const isAdmin = false;
        if (!isAdmin) {
          error.value = 'Admin access required!';
          addNavigationRecord({
            message: 'Access denied: Admin privileges required',
            type: 'danger'
          });
          return next({ path: '/forbidden' });
        }
      }
      next();
    }
  }
];

// Register middlewares
middlewares.forEach(middleware => {
  router.beforeEach(middleware.handler);
});

// Navigation methods
const navigateToPublic = () => {
  error.value = '';
  router.push('/public');
  addNavigationRecord({
    message: 'Successfully accessed public route',
    type: 'success'
  });
};

const navigateToProtected = () => {
  error.value = '';
  router.push({
    path: '/protected',
    meta: { requiresAuth: true }
  });
};

const navigateToAdmin = () => {
  error.value = '';
  router.push({
    path: '/admin',
    meta: { requiresAuth: true, requiresAdmin: true }
  });
};

// Helper function to add navigation records
const addNavigationRecord = (record: Omit<NavigationRecord, 'timestamp'>) => {
  navigationHistory.value.unshift({
    ...record,
    timestamp: dayjs().format('HH:mm:ss')
  });
};
</script>

<style scoped>
.middleware-example {
  padding: 20px;
}

.example-section {
  margin-top: 20px;
}

.button-group {
  margin: 15px 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

h3 {
  margin-top: 30px;
  margin-bottom: 15px;
  color: var(--el-text-color-primary);
}

.el-timeline {
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
