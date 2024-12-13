<template>
  <div class="sse-example">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>SSE 连接示例</span>
          <div class="button-group">
            <el-button
              type="primary"
              :disabled="connected"
              :loading="connecting"
              @click="handleConnect"
            >
              连接
            </el-button>
            <el-button type="danger" :disabled="!connected" @click="handleDisconnect">
              断开
            </el-button>
          </div>
        </div>
      </template>

      <!-- 连接状态 -->
      <div class="status-section">
        <el-tag :type="connected ? 'success' : 'info'">
          {{ connected ? '已连接' : '未连接' }}
        </el-tag>
        <el-tag v-if="error" type="danger">
          {{ error }}
        </el-tag>
      </div>

      <!-- 消息列表 -->
      <div class="message-section">
        <div class="message-list">
          <div v-for="(msg, index) in messages" :key="index" class="message-item" :class="msg.type">
            <span class="time">{{ msg.time }}</span>
            <span class="type">[{{ msg.type }}]</span>
            <span class="content">{{ msg.content }}</span>
          </div>
        </div>
      </div>

      <!-- 配置面板 -->
      <el-collapse v-model="activeCollapse">
        <el-collapse-item title="连接配置" name="config">
          <el-form :model="config" label-width="120px">
            <el-form-item label="SSE 服务地址">
              <el-input v-model="config.url" placeholder="输入 SSE 服务地址" />
            </el-form-item>
            <el-form-item label="事件名称">
              <el-select v-model="config.events.names" multiple placeholder="选择要监听的事件">
                <el-option label="message" value="message" />
                <el-option label="update" value="update" />
                <el-option label="notification" value="notification" />
              </el-select>
            </el-form-item>
            <el-form-item label="默认消息处理">
              <el-switch v-model="config.events.enableDefaultHandler" />
            </el-form-item>
            <el-form-item label="中间件">
              <el-checkbox-group v-model="selectedMiddleware">
                <el-checkbox value="logger">日志</el-checkbox>
                <el-checkbox value="retry">重试</el-checkbox>
                <el-checkbox value="transform">消息转换</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import {
  useSSE,
  createLoggerMiddleware,
  createRetryMiddleware,
  createTransformMiddleware,
  type SSEConfig
} from '@lib/application/sse';

// 消息列表
interface Message {
  type: string;
  content: any;
  time: string;
}

const messages = ref<Message[]>([]);
const activeCollapse = ref(['config']);
const selectedMiddleware = ref(['logger']);

// SSE 配置
const config = reactive<SSEConfig>({
  url: 'http://localhost:3000/sse',
  events: {
    names: ['message', 'update'],
    enableDefaultHandler: true
  },
  request: {
    withCredentials: false
  },
  heartbeat: {
    enabled: true,
    interval: 30000
  }
});

// 添加消息到列表
const addMessage = (type: string, content: any) => {
  messages.value.unshift({
    type,
    content: typeof content === 'object' ? JSON.stringify(content) : content,
    time: new Date().toLocaleTimeString()
  });
};

// 创建中间件
const middleware = computed(() => {
  const list = [];

  if (selectedMiddleware.value.includes('logger')) {
    list.push(
      createLoggerMiddleware({
        logConnect: true,
        logMessage: true,
        logError: true
      })
    );
  }

  if (selectedMiddleware.value.includes('retry')) {
    list.push(
      createRetryMiddleware({
        maxAttempts: 3,
        delay: 1000
      })
    );
  }

  if (selectedMiddleware.value.includes('transform')) {
    list.push(
      createTransformMiddleware(data => {
        if (typeof data === 'string') {
          try {
            return JSON.parse(data);
          } catch {
            return data;
          }
        }
        return data;
      })
    );
  }

  return list;
});

// 使用 SSE hook
const { connect, disconnect, connected, connecting, error } = useSSE({
  onConnect: () => {
    ElMessage.success('SSE 连接成功');
    addMessage('system', '连接成功');
  },
  onDisconnect: () => {
    addMessage('system', '连接断开');
  },
  onError: err => {
    const errorMessage = err?.message || 'SSE 连接错误';
    ElMessage.error(errorMessage);
    addMessage('error', errorMessage);
  },
  onMessage: data => {
    addMessage('message', data);
  }
});

// 连接处理
const handleConnect = async () => {
  try {
    if (!config.url) {
      ElMessage.warning('请输入SSE服务地址');
      return;
    }
    await connect({
      ...config,
      middleware: middleware.value
    });
  } catch (err: any) {
    ElMessage.error(err?.message || '连接失败');
  }
};

// 断开连接
const handleDisconnect = () => {
  disconnect();
  ElMessage.info('已断开连接');
};
</script>

<style lang="scss" scoped>
.sse-example {
  padding: 20px;

  .box-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .button-group {
      display: flex;
      gap: 10px;
    }
  }

  .status-section {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
  }

  .message-section {
    margin-bottom: 20px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 10px;
    height: 300px;
    overflow-y: auto;

    .message-list {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .message-item {
        font-size: 14px;
        line-height: 1.4;
        padding: 8px;
        border-radius: 4px;
        background-color: #f5f7fa;

        &.system {
          background-color: #e6f7ff;
        }

        &.error {
          background-color: #fff2f0;
        }

        .time {
          color: #909399;
          margin-right: 8px;
        }

        .type {
          color: #606266;
          margin-right: 8px;
        }

        .content {
          color: #303133;
        }
      }
    }
  }
}
</style>
