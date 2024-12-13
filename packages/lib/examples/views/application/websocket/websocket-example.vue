<template>
  <div class="websocket-example">
    <el-card>
      <template #header>
        <h2>WebSocket Example</h2>
      </template>

      <!-- Connection Status -->
      <div class="connection-status">
        <el-tag :type="isConnected ? 'success' : 'danger'">
          {{ isConnected ? 'Connected' : 'Disconnected' }}
        </el-tag>
        <el-button-group class="ml-4">
          <el-button type="primary" :disabled="isConnected" :loading="connecting" @click="connect">
            Connect
          </el-button>
          <el-button type="danger" :disabled="!isConnected" @click="disconnect">
            Disconnect
          </el-button>
        </el-button-group>
      </div>

      <!-- Message Sending -->
      <div class="message-sender mt-4">
        <el-input
          v-model="messageText"
          placeholder="Enter message to send"
          :disabled="!isConnected"
        >
          <template #append>
            <el-button type="primary" :disabled="!isConnected || !messageText" @click="sendMessage">
              Send
            </el-button>
          </template>
        </el-input>
      </div>

      <!-- Message History -->
      <div class="message-history mt-4">
        <h3>Message History</h3>
        <el-scrollbar height="300px">
          <div class="message-list">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              class="message-item"
              :class="msg.type"
            >
              <span class="message-time">{{ msg.time }}</span>
              <span class="message-content">{{ msg.content }}</span>
            </div>
          </div>
        </el-scrollbar>
      </div>

      <!-- WebSocket Settings -->
      <div class="websocket-settings mt-4">
        <h3>Settings</h3>
        <el-form :model="settings" label-width="120px">
          <el-form-item label="Auto Reconnect">
            <el-switch v-model="settings.autoReconnect" />
          </el-form-item>
          <el-form-item label="Heartbeat">
            <el-switch v-model="settings.heartbeat" />
          </el-form-item>
          <el-form-item label="Logger">
            <el-switch v-model="settings.logger" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useWebSocket } from '../../../../src/application/websocket/composables/useWebSocket';
import {
  createLoggerMiddleware,
  createRetryMiddleware
} from '../../../../src/application/websocket/middleware';
import type { WebSocketConfig } from '../../../../src/application/websocket/types';
import { WebSocketServiceImpl } from '../../../../src/application/websocket/services/websocket.service';

// WebSocket Configuration
const wsConfig: WebSocketConfig = {
  url: 'ws://echo.websocket.org', // Echo server for testing
  reconnect: {
    enabled: true,
    maxAttempts: 3,
    delay: 1000
  },
  heartbeat: {
    enabled: true,
    message: 'ping',
    interval: 30000
  }
};

// State
const messageText = ref('');
const messages = ref<
  Array<{
    content: string;
    type: 'sent' | 'received' | 'system';
    time: string;
  }>
>([]);
const settings = reactive({
  autoReconnect: true,
  heartbeat: true,
  logger: true
});
const connecting = ref(false);

// Initialize WebSocket
const {
  ws,
  isConnected,
  connect: wsConnect,
  disconnect: wsDisconnect,
  send: wsSend
} = useWebSocket(wsConfig);

// Methods
const addMessage = (content: string, type: 'sent' | 'received' | 'system') => {
  const time = new Date().toLocaleTimeString();
  messages.value.push({ content, type, time });
};

const connect = async () => {
  try {
    connecting.value = true;

    // Add middleware before connecting
    if (settings.logger) {
      (ws.value as WebSocketServiceImpl).addMiddleware(createLoggerMiddleware());
    }
    (ws.value as WebSocketServiceImpl).addMiddleware(
      createRetryMiddleware({
        maxAttempts: 3,
        delay: 1000
      })
    );

    await wsConnect();
    addMessage('Connected to WebSocket server', 'system');
  } catch (error) {
    ElMessage.error('Failed to connect to WebSocket server');
    addMessage('Connection failed', 'system');
  } finally {
    connecting.value = false;
  }
};

const disconnect = () => {
  wsDisconnect();
  addMessage('Disconnected from WebSocket server', 'system');
};

const sendMessage = () => {
  if (!messageText.value) return;

  wsSend(messageText.value);
  addMessage(messageText.value, 'sent');
  messageText.value = '';
};

// Event Handlers
ws.value?.on('message', (data: any) => {
  addMessage(data, 'received');
});

ws.value?.on('error', (error: any) => {
  ElMessage.error('WebSocket error occurred');
  addMessage('Error: ' + error.message, 'system');
});

// Cleanup
onUnmounted(() => {
  if (isConnected.value) {
    wsDisconnect();
  }
});
</script>

<style scoped>
.websocket-example {
  padding: 20px;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 16px;
}

.message-history {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 16px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-item {
  padding: 8px;
  border-radius: 4px;
  display: flex;
  gap: 8px;
}

.message-time {
  color: #909399;
  font-size: 12px;
}

.message-content {
  flex: 1;
}

.sent {
  background-color: #f0f9eb;
  margin-left: 20%;
}

.received {
  background-color: #f4f4f5;
  margin-right: 20%;
}

.system {
  background-color: #fdf6ec;
  font-style: italic;
  text-align: center;
}

.mt-4 {
  margin-top: 16px;
}

.ml-4 {
  margin-left: 16px;
}
</style>
