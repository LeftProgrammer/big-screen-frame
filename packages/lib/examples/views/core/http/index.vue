<template>
  <div class="http-demo">
    <div class="control-panel">
      <h2>HTTP 模块示例</h2>

      <!-- 基础请求 -->
      <div class="panel-section">
        <h3>基础请求</h3>
        <el-form>
          <el-form-item label="请求URL">
            <el-input v-model="config.url" placeholder="请输入请求URL" />
          </el-form-item>

          <el-form-item label="请求方法">
            <el-radio-group v-model="config.method">
              <el-radio-button value="GET">GET</el-radio-button>
              <el-radio-button value="POST">POST</el-radio-button>
              <el-radio-button value="PUT">PUT</el-radio-button>
              <el-radio-button value="DELETE">DELETE</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="config.method !== 'GET'" label="请求数据">
            <el-input
              v-model="config.data"
              type="textarea"
              :rows="4"
              placeholder="请输入JSON格式的请求数据"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleRequest">发送请求</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 高级功能 -->
      <div class="panel-section">
        <h3>高级功能</h3>
        <el-form>
          <el-form-item label="请求重试">
            <el-switch v-model="config.retry.enabled" />
            <template v-if="config.retry.enabled">
              <div class="retry-config">
                <el-input-number v-model="config.retry.count" :min="1" :max="10" label="重试次数" />
                <el-input-number
                  v-model="config.retry.baseDelay"
                  :min="100"
                  :step="100"
                  label="基础延迟(ms)"
                />
              </div>
            </template>
          </el-form-item>

          <el-form-item label="请求轮询">
            <el-switch v-model="config.polling.enabled" />
            <template v-if="config.polling.enabled">
              <div class="polling-config">
                <el-input-number
                  v-model="config.polling.interval"
                  :min="1000"
                  :step="1000"
                  label="轮询间隔(ms)"
                />
                <el-switch v-model="config.polling.immediate" label="立即执行" />
              </div>
            </template>
          </el-form-item>

          <el-form-item label="文件上传">
            <el-upload
              class="upload-demo"
              action="#"
              :auto-upload="false"
              :on-change="handleFileChange"
              :file-list="fileList"
            >
              <template #trigger>
                <el-button type="primary">选择文件</el-button>
              </template>
              <el-button
                style="margin-left: 10px"
                type="success"
                :disabled="!selectedFile"
                @click="handleUpload"
              >
                上传文件
              </el-button>
            </el-upload>
          </el-form-item>

          <el-form-item label="文件下载">
            <el-input v-model="config.downloadUrl" placeholder="请输入下载文件URL">
              <template #append>
                <el-button @click="handleDownload">下载</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <!-- 响应结果 -->
      <div class="panel-section">
        <h3>响应结果</h3>
        <div class="response-panel">
          <div class="response-header">
            <span>状态: {{ response.status }}</span>
            <span>耗时: {{ response.time }}ms</span>
          </div>
          <div class="response-body">
            <pre>{{ formatResponse(response.data) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <el-dialog
      v-model="progress.visible"
      title="上传进度"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-progress :percentage="progress.percent" />
      <div class="progress-info">
        <p>已上传: {{ formatBytes(progress.loaded) }}</p>
        <p>总大小: {{ formatBytes(progress.total) }}</p>
        <p>速率: {{ formatBytes(progress.rate) }}/s</p>
        <p>预计剩余时间: {{ formatTime(progress.estimated) }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { http } from '@lib/core/http';
import { ElMessage } from 'element-plus';

// 配置
const config = reactive({
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  method: 'GET',
  data: '',
  downloadUrl: 'https://example.com/file.pdf',
  retry: {
    enabled: false,
    count: 3,
    baseDelay: 1000
  },
  polling: {
    enabled: false,
    interval: 5000,
    immediate: true
  }
});

// 响应数据
const response = reactive({
  status: '',
  time: 0,
  data: null
});

// 文件上传
const fileList = ref([]);
const selectedFile = ref(null);
const progress = reactive({
  visible: false,
  percent: 0,
  loaded: 0,
  total: 0,
  rate: 0,
  estimated: 0
});

// 基础请求处理
const handleRequest = async () => {
  try {
    const startTime = Date.now();
    const requestConfig = {
      retry: config.retry.enabled
        ? {
            count: config.retry.count,
            baseDelay: config.retry.baseDelay
          }
        : undefined,
      polling: config.polling.enabled
        ? {
            enabled: true,
            interval: config.polling.interval,
            immediate: config.polling.immediate,
            onSuccess: data => {
              response.data = data;
              response.time = Date.now() - startTime;
            },
            onError: error => {
              ElMessage.error(error.message);
            }
          }
        : undefined
    };

    const res = await http.request({
      url: config.url,
      method: config.method,
      data: config.method !== 'GET' ? JSON.parse(config.data || '{}') : undefined,
      ...requestConfig
    });

    response.status = 'success';
    response.data = res;
    response.time = Date.now() - startTime;
  } catch (error) {
    response.status = 'error';
    response.data = error;
    ElMessage.error(error.message);
  }
};

// 文件上传处理
const handleFileChange = file => {
  selectedFile.value = file;
};

const handleUpload = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请先选择文件');
    return;
  }

  progress.visible = true;
  progress.percent = 0;

  try {
    await http.upload('/api/upload', selectedFile.value.raw, {
      upload: {
        fieldName: 'file',
        maxSize: 10 * 1024 * 1024, // 10MB
        onProgress: event => {
          progress.percent = Math.round(event.progress * 100);
          progress.loaded = event.loaded;
          progress.total = event.total;
          progress.rate = event.rate;
          progress.estimated = event.estimated;
        }
      }
    });

    ElMessage.success('上传成功');
  } catch (error) {
    ElMessage.error(error.message);
  } finally {
    progress.visible = false;
  }
};

// 文件下载处理
const handleDownload = async () => {
  try {
    await http.download(config.downloadUrl, {
      download: {
        filename: 'downloaded-file',
        onProgress: event => {
          console.log('下载进度:', event.progress);
        }
      }
    });
  } catch (error) {
    ElMessage.error(error.message);
  }
};

// 工具函数
const formatResponse = data => {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return data;
  }
};

const formatBytes = bytes => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatTime = ms => {
  if (ms < 1000) return ms + 'ms';
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return seconds + 's';
  const minutes = Math.floor(seconds / 60);
  return minutes + 'm ' + (seconds % 60) + 's';
};
</script>

<style lang="scss" scoped>
.http-demo {
  padding: 20px;

  .control-panel {
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 20px;

    h2 {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 1.5em;
    }

    .panel-section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid var(--el-border-color);
      border-radius: 4px;
      background-color: var(--el-bg-color);

      h3 {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 1.2em;
      }
    }
  }

  .retry-config,
  .polling-config {
    margin-top: 10px;
    display: flex;
    gap: 20px;
  }

  .response-panel {
    border: 1px solid var(--el-border-color);
    border-radius: 4px;

    .response-header {
      padding: 10px;
      background: var(--el-bg-color-page);
      border-bottom: 1px solid var(--el-border-color);
      display: flex;
      justify-content: space-between;
    }

    .response-body {
      padding: 10px;
      max-height: 300px;
      overflow: auto;

      pre {
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }
  }

  .progress-info {
    margin-top: 20px;
    p {
      margin: 5px 0;
    }
  }
}
</style>
