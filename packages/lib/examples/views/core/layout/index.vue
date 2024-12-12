<template>
  <div class="layout-demo">
    <div class="control-panel">
      <h2>ScaleScreen 组件示例</h2>

      <!-- 基础配置 -->
      <div class="panel-section">
        <h3>基础配置</h3>
        <el-form label-position="top">
          <el-form-item label="缩放模式">
            <el-radio-group v-model="config.mode">
              <el-radio-button value="fit">适应</el-radio-button>
              <el-radio-button value="stretch">拉伸</el-radio-button>
              <el-radio-button value="uniform">统一</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="水平对齐">
            <el-radio-group v-model="config.alignX">
              <el-radio-button value="left">左对齐</el-radio-button>
              <el-radio-button value="center">居中</el-radio-button>
              <el-radio-button value="right">右对齐</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="垂直对齐">
            <el-radio-group v-model="config.alignY">
              <el-radio-button value="top">顶部</el-radio-button>
              <el-radio-button value="center">居中</el-radio-button>
              <el-radio-button value="bottom">底部</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <!-- 高级配置 -->
      <div class="panel-section">
        <h3>高级配置</h3>
        <el-form label-position="top">
          <el-form-item label="网格">
            <el-switch v-model="config.options.grid.enabled" />
            <template v-if="config.options.grid.enabled">
              <div class="sub-options">
                <el-slider
                  v-model="config.options.grid.opacity"
                  :min="0.1"
                  :max="1"
                  :step="0.1"
                  :marks="{
                    0.1: '0.1',
                    0.5: '0.5',
                    1: '1'
                  }"
                />
              </div>
            </template>
          </el-form-item>

          <el-form-item label="手势控制">
            <el-switch v-model="config.options.gestures.enabled" />
          </el-form-item>

          <el-form-item label="快捷键">
            <el-switch v-model="config.options.shortcuts.enabled" />
            <div v-if="config.options.shortcuts.enabled" class="shortcuts-info">
              <p>Ctrl + +: 放大</p>
              <p>Ctrl + -: 缩小</p>
              <p>Ctrl + 0: 重置</p>
              <p>F11: 全屏</p>
            </div>
          </el-form-item>

          <el-form-item label="缩略导航">
            <el-switch v-model="config.options.navigator.enabled" />
            <template v-if="config.options.navigator.enabled">
              <div class="sub-options">
                <el-select v-model="config.options.navigator.position">
                  <el-option label="左上" value="top-left" />
                  <el-option label="右上" value="top-right" />
                  <el-option label="左下" value="bottom-left" />
                  <el-option label="右下" value="bottom-right" />
                </el-select>
              </div>
            </template>
          </el-form-item>
        </el-form>
      </div>

      <!-- 状态信息 -->
      <div class="panel-section">
        <h3>状态信息</h3>
        <div class="info-list">
          <div class="info-item">
            <label>当前缩放：</label>
            <span>{{ (scale * 100).toFixed(0) }}%</span>
          </div>
          <div class="info-item">
            <label>容器尺寸：</label>
            <span>{{ containerSize.width }} x {{ containerSize.height }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="preview-area">
      <ScaleScreen
        ref="screenRef"
        v-bind="config"
        @scale="handleScale"
        @resize="handleResize"
        @fullscreen-change="handleFullscreenChange"
      >
        <!-- 自定义工具栏 -->
        <template #toolbar>
          <div class="custom-toolbar">
            <el-button-group>
              <el-button @click="screenRef?.zoomOut()">
                <el-icon><Remove /></el-icon>
              </el-button>
              <el-button>{{ (scale * 100).toFixed(0) }}%</el-button>
              <el-button @click="screenRef?.zoomIn()">
                <el-icon><Plus /></el-icon>
              </el-button>
            </el-button-group>
            <el-button @click="screenRef?.reset()">
              <el-icon><Refresh /></el-icon>
            </el-button>
            <el-button @click="screenRef?.toggleFullscreen()">
              <el-icon><FullScreen /></el-icon>
            </el-button>
          </div>
        </template>

        <!-- 大屏内容 -->
        <div class="screen-content">
          <div class="screen-header">
            <h1>数据可视化大屏</h1>
            <div class="time">{{ currentTime }}</div>
          </div>

          <div class="screen-body">
            <div class="chart-row">
              <div v-for="i in 3" :key="i" class="chart-item">
                <div class="chart-header">
                  <h3>图表 {{ i }}</h3>
                  <el-tag size="small">实时</el-tag>
                </div>
                <div class="chart-content">Chart {{ i }}</div>
              </div>
            </div>

            <div class="data-row">
              <div v-for="i in 4" :key="i" class="data-item">
                <div class="data-value">{{ randomValue() }}</div>
                <div class="data-label">指标 {{ i }}</div>
                <div class="data-trend" :class="randomTrend()">{{ randomPercent() }}%</div>
              </div>
            </div>
          </div>
        </div>
      </ScaleScreen>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ScaleScreen } from '@lib/core/layout';
import type { ScaleScreenInstance } from '@lib/core/layout';
import { Remove, Plus, Refresh, FullScreen } from '@element-plus/icons-vue';

const screenRef = ref<ScaleScreenInstance>();
const scale = ref(1);
const currentTime = ref(new Date().toLocaleTimeString());
const containerSize = reactive({
  width: 0,
  height: 0
});

// 配置
const config = reactive({
  width: 1920,
  height: 1080,
  mode: 'fit',
  alignX: 'center',
  alignY: 'center',
  autoResize: true,
  options: {
    smoothScaling: true,
    grid: {
      enabled: true,
      size: 50,
      opacity: 0.2,
      showGuides: true
    },
    gestures: {
      enabled: true,
      dragEnabled: true
    },
    shortcuts: {
      enabled: true
    },
    navigator: {
      enabled: false,
      position: 'bottom-right'
    }
  }
});

// 事件处理
const handleScale = (newScale: number) => {
  scale.value = newScale;
};

const handleResize = (width: number, height: number) => {
  containerSize.width = width;
  containerSize.height = height;
};

const handleFullscreenChange = (isFullscreen: boolean) => {
  console.log('Fullscreen:', isFullscreen);
};

// 辅助函数
const randomValue = () => {
  return Math.floor(Math.random() * 10000);
};

const randomPercent = () => {
  return (Math.random() * 100).toFixed(2);
};

const randomTrend = () => {
  return Math.random() > 0.5 ? 'up' : 'down';
};

// 更新时间
setInterval(() => {
  currentTime.value = new Date().toLocaleTimeString();
}, 1000);
</script>

<style lang="scss" scoped>
.layout-demo {
  height: 100vh;
  display: flex;
  background-color: var(--bsf-screen-background);

  .control-panel {
    width: 320px;
    padding: 20px;
    background-color: var(--bsf-chart-background);
    border-right: 1px solid var(--bsf-chart-border);
    overflow-y: auto;
    flex-shrink: 0;

    h2 {
      margin: 0 0 20px;
      color: var(--bsf-screen-text);
    }

    .panel-section {
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--bsf-chart-border);

      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      h3 {
        margin: 0 0 16px;
        color: var(--bsf-screen-text);
      }

      .sub-options {
        margin-top: 12px;
        padding: 12px;
        background: var(--bsf-screen-background);
        border-radius: 4px;
      }

      .shortcuts-info {
        margin-top: 12px;
        padding: 12px;
        background: var(--bsf-screen-background);
        border-radius: 4px;
        font-size: 14px;
        color: var(--bsf-screen-text);

        p {
          margin: 4px 0;
        }
      }

      .info-list {
        .info-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding: 8px;
          background: var(--bsf-screen-background);
          border-radius: 4px;

          &:last-child {
            margin-bottom: 0;
          }

          label {
            color: var(--bsf-screen-text);
          }

          span {
            color: var(--bsf-screen-text);
            font-family: monospace;
          }
        }
      }
    }
  }

  .preview-area {
    flex: 1;
    min-width: 0;
    background-color: var(--bsf-screen-background);
    overflow: hidden;
    position: relative;
  }
}

.custom-toolbar {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: var(--bsf-chart-background);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 100;

  .el-button-group {
    .el-button {
      padding: 8px 12px;

      &:not(:first-child):not(:last-child) {
        padding: 8px 16px;
        min-width: 80px;
      }
    }
  }

  .el-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
}

.screen-content {
  width: 100%;
  height: 100%;
  padding: 24px;
  color: var(--bsf-screen-text);

  .screen-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h1 {
      margin: 0;
      font-size: 32px;
      background: linear-gradient(
        to right,
        var(--el-color-primary),
        var(--el-color-primary-light-3)
      );
      -webkit-background-clip: text;
      color: transparent;
    }

    .time {
      font-size: 24px;
      color: var(--el-color-primary);
    }
  }

  .screen-body {
    display: flex;
    flex-direction: column;
    gap: 24px;

    .chart-row {
      display: flex;
      gap: 24px;
      height: 300px;

      .chart-item {
        flex: 1;
        background: var(--bsf-chart-background);
        border-radius: 8px;
        padding: 16px;
        border: 1px solid var(--bsf-chart-border);

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          h3 {
            margin: 0;
            color: var(--bsf-screen-text);
          }
        }

        .chart-content {
          height: calc(100% - 40px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bsf-screen-background);
          border-radius: 4px;
          color: var(--bsf-screen-text);
        }
      }
    }

    .data-row {
      display: flex;
      gap: 24px;

      .data-item {
        flex: 1;
        padding: 20px;
        background: var(--bsf-chart-background);
        border-radius: 8px;
        text-align: center;
        border: 1px solid var(--bsf-chart-border);

        .data-value {
          font-size: 32px;
          font-weight: bold;
          color: var(--el-color-primary);
          margin-bottom: 8px;
        }

        .data-label {
          color: var(--bsf-screen-text);
          margin-bottom: 8px;
        }

        .data-trend {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;

          &.up {
            color: var(--el-color-success);
            background: var(--el-color-success-light-9);
          }

          &.down {
            color: var(--el-color-danger);
            background: var(--el-color-danger-light-9);
          }
        }
      }
    }
  }
}
</style>
