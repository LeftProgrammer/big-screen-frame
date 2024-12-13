<!-- Template Usage Example -->
<template>
  <div class="template-example">
    <h2>Router Template Example</h2>
    <div class="example-section">
      <h3>Route Templates</h3>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="Basic Templates" name="basic">
          <el-table :data="basicRoutes" style="width: 100%">
            <el-table-column prop="path" label="Path" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="description" label="Description" />
            <el-table-column label="Actions" width="120" align="center">
              <template #default="{ row }">
                <el-button type="primary" link @click="navigateTo(row.path)"> Visit </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="Screen Templates" name="screen">
          <el-table :data="screenRoutes" style="width: 100%">
            <el-table-column prop="path" label="Path" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="description" label="Description" />
            <el-table-column label="Actions" width="120" align="center">
              <template #default="{ row }">
                <el-button type="primary" link @click="navigateTo(row.path)"> Visit </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="Custom Templates" name="custom">
          <div class="custom-template-form">
            <el-form :model="customTemplate" label-width="100px">
              <el-form-item label="Path">
                <el-input v-model="customTemplate.path" placeholder="/custom-path" />
              </el-form-item>
              <el-form-item label="Name">
                <el-input v-model="customTemplate.name" placeholder="CustomPage" />
              </el-form-item>
              <el-form-item label="Template">
                <el-select v-model="customTemplate.template" style="width: 100%">
                  <el-option label="Basic Page" value="basic" />
                  <el-option label="Screen Page" value="screen" />
                  <el-option label="Form Page" value="form" />
                  <el-option label="List Page" value="list" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="addCustomTemplate"> Create Template </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>

      <h3>Template Actions</h3>
      <div class="button-group">
        <el-button-group>
          <el-button type="primary" @click="useBasicTemplate"> Use Basic Template </el-button>
          <el-button type="success" @click="useScreenTemplate"> Use Screen Template </el-button>
        </el-button-group>
      </div>

      <h3>Template History</h3>
      <el-timeline>
        <el-timeline-item
          v-for="(action, index) in templateHistory"
          :key="index"
          :type="action.type"
          :timestamp="action.timestamp"
        >
          {{ action.message }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { RouterService, createRouterService } from '@lib/application/router';
import type { RouteRecordRaw } from 'vue-router';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';

interface TemplateAction {
  message: string;
  timestamp: string;
  type: 'primary' | 'success' | 'warning' | 'danger';
}

interface CustomTemplate {
  path: string;
  name: string;
  template: 'basic' | 'screen' | 'form' | 'list';
}

const router = createRouterService({
  mode: 'hash',
  base: '/',
  defaultRoutes: true
});
const activeTab = ref('basic');
const templateHistory = ref<TemplateAction[]>([]);
const customTemplate = ref<CustomTemplate>({
  path: '',
  name: '',
  template: 'basic'
});

// Example routes
const basicRoutes = ref([
  {
    path: '/login',
    name: 'Login',
    description: 'Basic login page template'
  },
  {
    path: '/404',
    name: 'Not Found',
    description: 'Error 404 page template'
  },
  {
    path: '/403',
    name: 'Forbidden',
    description: 'Error 403 page template'
  }
]);

const screenRoutes = ref([
  {
    path: '/dashboard',
    name: 'Dashboard',
    description: 'Full-screen dashboard template'
  },
  {
    path: '/analytics',
    name: 'Analytics',
    description: 'Data visualization screen template'
  },
  {
    path: '/monitor',
    name: 'Monitor',
    description: 'Real-time monitoring screen template'
  }
]);

// Helper functions
const addTemplateAction = (message: string, type: TemplateAction['type'] = 'primary') => {
  templateHistory.value.unshift({
    message,
    timestamp: dayjs().format('HH:mm:ss'),
    type
  });
};

const navigateTo = (path: string) => {
  router.push(path);
  addTemplateAction(`Navigated to template: ${path}`);
};

// Template actions
const addCustomTemplate = () => {
  const { path, name, template } = customTemplate.value;

  if (!path || !name) {
    ElMessage.warning('Please fill in all required fields');
    return;
  }

  try {
    const route: RouteRecordRaw = {
      path,
      name,
      component: () => import(`./templates/${template}.vue`)
    };

    router.addRoute(route);
    addTemplateAction(`Added custom template: ${name} (${path})`, 'success');

    // Reset form
    customTemplate.value = {
      path: '',
      name: '',
      template: 'basic'
    };
  } catch (error) {
    addTemplateAction(`Failed to add template: ${error}`, 'danger');
  }
};

const useBasicTemplate = () => {
  try {
    const template = {
      layout: 'default',
      header: true,
      footer: true,
      sidebar: true
    };

    router.setTemplate(template);
    addTemplateAction('Applied basic page template', 'success');
  } catch (error) {
    addTemplateAction(`Failed to apply template: ${error}`, 'danger');
  }
};

const useScreenTemplate = () => {
  try {
    const template = {
      layout: 'fullscreen',
      header: false,
      footer: false,
      sidebar: false,
      transition: 'fade'
    };

    router.setTemplate(template);
    addTemplateAction('Applied screen template', 'success');
  } catch (error) {
    addTemplateAction(`Failed to apply template: ${error}`, 'danger');
  }
};
</script>

<style scoped>
.template-example {
  padding: 20px;
}

.example-section {
  margin-top: 20px;
}

.button-group {
  margin: 15px 0;
  display: flex;
  gap: 10px;
}

h3 {
  margin-top: 30px;
  margin-bottom: 15px;
  color: var(--el-text-color-primary);
}

.custom-template-form {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.el-timeline {
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
