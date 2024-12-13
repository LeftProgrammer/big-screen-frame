<!-- Plugin Usage Example -->
<template>
  <div class="plugin-example">
    <h2>Router Plugin Example</h2>
    <div class="example-section">
      <h3>Available Plugins</h3>
      <el-table :data="plugins" style="width: 100%">
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="description" label="Description" />
        <el-table-column label="Status" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="activePlugins.includes(row.name) ? 'success' : 'info'">
              {{ activePlugins.includes(row.name) ? 'Enabled' : 'Disabled' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.enabled"
              :active-text="row.enabled ? 'On' : 'Off'"
              @change="val => togglePlugin(row, val)"
            />
          </template>
        </el-table-column>
      </el-table>

      <h3>Plugin Actions</h3>
      <div class="button-group">
        <el-button
          type="primary"
          :disabled="!isPluginActive('transition')"
          @click="triggerTransition"
        >
          Test Page Transition
        </el-button>
        <el-button
          type="success"
          :disabled="!isPluginActive('analytics')"
          @click="simulateAnalytics"
        >
          Test Analytics
        </el-button>
      </div>

      <h3>Plugin Events</h3>
      <el-timeline>
        <el-timeline-item
          v-for="(log, index) in logs"
          :key="index"
          :type="log.type"
          :timestamp="log.timestamp"
          :hollow="log.type === 'primary'"
        >
          {{ log.message }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { RouterService, createRouterService } from '@lib/application/router';
import type { RouterConfig } from '@lib/application/router';
import dayjs from 'dayjs';

interface Plugin {
  name: string;
  description: string;
  enabled: boolean;
  install: (router: RouterService) => void;
}

interface LogEntry {
  message: string;
  timestamp: string;
  type: 'success' | 'warning' | 'danger' | 'primary';
}

const router = createRouterService({
  mode: 'hash',
  base: '/',
  defaultRoutes: true
});
const logs = ref<LogEntry[]>([]);
const activePlugins = ref<string[]>([]);

// Example plugins
const plugins = ref<Plugin[]>([
  {
    name: 'transition',
    description: 'Adds page transition effects',
    enabled: false,
    install: (router: RouterService) => {
      const config: RouterConfig['transition'] = {
        name: 'fade',
        mode: 'out-in',
        onBeforeEnter: () => addLog('Page transition started', 'primary'),
        onAfterLeave: () => addLog('Page transition completed', 'success')
      };
      router.setTransition(config);
      addLog('Transition plugin installed', 'success');
    }
  },
  {
    name: 'analytics',
    description: 'Tracks page views and navigation events',
    enabled: false,
    install: (router: RouterService) => {
      router.afterEach(to => {
        // Simulate analytics tracking
        addLog(`Page view tracked: ${to.path}`, 'primary');
      });
      addLog('Analytics plugin installed', 'success');
    }
  }
]);

// Helper functions
const addLog = (message: string, type: LogEntry['type'] = 'primary') => {
  logs.value.unshift({
    message,
    timestamp: dayjs().format('HH:mm:ss'),
    type
  });
};

const isPluginActive = (name: string) => {
  return activePlugins.value.includes(name);
};

// Plugin management
const togglePlugin = async (plugin: Plugin, enabled: boolean) => {
  try {
    if (enabled) {
      plugin.install(router);
      activePlugins.value.push(plugin.name);
      addLog(`Plugin "${plugin.name}" enabled`, 'success');
    } else {
      const index = activePlugins.value.indexOf(plugin.name);
      if (index > -1) {
        activePlugins.value.splice(index, 1);
        addLog(`Plugin "${plugin.name}" disabled`, 'warning');
      }
    }
  } catch (error) {
    addLog(`Failed to ${enabled ? 'enable' : 'disable'} plugin: ${error}`, 'danger');
  }
};

// Test functions
const triggerTransition = async () => {
  if (!isPluginActive('transition')) {
    addLog('Transition plugin is not active', 'warning');
    return;
  }
  await router.push('/about');
};

const simulateAnalytics = () => {
  if (!isPluginActive('analytics')) {
    addLog('Analytics plugin is not active', 'warning');
    return;
  }
  addLog('Custom event tracked: "button_click"', 'success');
};
</script>

<style scoped>
.plugin-example {
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

:deep(.el-switch) {
  --el-switch-on-color: var(--el-color-primary);
}
</style>
