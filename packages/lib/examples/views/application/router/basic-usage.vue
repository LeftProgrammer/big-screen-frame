<!-- Basic Router Usage Example -->
<template>
  <div class="router-example">
    <h2>Basic Router Usage</h2>
    <div class="example-section">
      <h3>Current Route Information</h3>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="Path">{{ currentRoute?.path }}</el-descriptions-item>
        <el-descriptions-item label="Name">{{ currentRoute?.name }}</el-descriptions-item>
        <el-descriptions-item label="Params">{{
          JSON.stringify(currentRoute?.params)
        }}</el-descriptions-item>
        <el-descriptions-item label="Query">{{
          JSON.stringify(currentRoute?.query)
        }}</el-descriptions-item>
      </el-descriptions>

      <h3>Navigation</h3>
      <div class="button-group">
        <el-button type="primary" @click="navigateToHome">Go to Home</el-button>
        <el-button @click="navigateToAbout">Go to About</el-button>
        <el-button @click="navigateWithParams">Navigate with Params</el-button>
        <el-button @click="navigateWithQuery">Navigate with Query</el-button>
        <el-button @click="goBack">Go Back</el-button>
        <el-button @click="goForward">Go Forward</el-button>
      </div>

      <h3>Route Management</h3>
      <div class="button-group">
        <el-button type="success" @click="addDynamicRoute">Add Dynamic Route</el-button>
        <el-button type="danger" @click="removeDynamicRoute">Remove Dynamic Route</el-button>
      </div>

      <h3>Available Routes</h3>
      <el-table :data="routes" style="width: 100%">
        <el-table-column prop="path" label="Path" />
        <el-table-column prop="name" label="Name" />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterService, createRouterService } from '@lib/application/router';
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

const router = createRouterService({
  mode: 'hash',
  base: '/',
  defaultRoutes: {
    home: '/home',
    error: '/error'
  }
});

const currentRoute = ref<RouteLocationNormalized | null>(null);
const routes = ref<RouteRecordRaw[]>([]);

// Basic navigation methods
const navigateToHome = () => {
  router.push('/home');
};

const navigateToAbout = () => {
  router.push('/about');
};

const navigateWithParams = () => {
  router.push({
    path: '/user/:id',
    params: { id: '123' }
  });
};

const navigateWithQuery = () => {
  router.push({
    path: '/search',
    query: { keyword: 'test', page: '1' }
  });
};

const goBack = () => {
  router.back();
};

const goForward = () => {
  router.forward();
};

// Route management
const addDynamicRoute = () => {
  const newRoute: RouteRecordRaw = {
    path: '/dynamic',
    name: 'dynamic',
    component: () => import('./template-example.vue')
  };
  router.addRoute(newRoute);
  updateRoutes();
};

const removeDynamicRoute = () => {
  router.removeRoute('dynamic');
  updateRoutes();
};

// Update current route information
const updateRouteInfo = () => {
  currentRoute.value = router.getCurrentRoute();
};

const updateRoutes = () => {
  routes.value = router.getRoutes();
};

// Lifecycle hooks
onMounted(() => {
  // Set up route change listener
  router.on('afterEach', updateRouteInfo);
  updateRouteInfo();
  updateRoutes();
});

onUnmounted(() => {
  // Clean up route change listener
  router.off('afterEach', updateRouteInfo);
});
</script>

<style scoped>
.router-example {
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

.el-descriptions {
  margin: 15px 0;
}
</style>
