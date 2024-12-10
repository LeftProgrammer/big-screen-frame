<template>
  <div class="theme-demo">
    <!-- 主题配置面板 -->
    <theme-config />

    <!-- 示例内容 -->
    <div class="demo-content">
      <el-card class="demo-card">
        <template #header>
          <div class="card-header">
            <span>主题效果预览</span>
          </div>
        </template>

        <!-- 文字展示 -->
        <div class="section">
          <h3>文字颜色</h3>
          <div class="text-demo">
            <p class="bsf-text-primary">主要文字 Primary Text</p>
            <p class="bsf-text-regular">常规文字 Regular Text</p>
            <p class="bsf-text-secondary">次要文字 Secondary Text</p>
            <p class="bsf-text-placeholder">占位文字 Placeholder Text</p>
          </div>
        </div>

        <!-- 按钮展示 -->
        <div class="section">
          <h3>按钮样式</h3>
          <div class="button-demo">
            <el-button type="primary">主要按钮</el-button>
            <el-button type="success">成功按钮</el-button>
            <el-button type="warning">警告按钮</el-button>
            <el-button type="danger">危险按钮</el-button>
            <el-button type="info">信息按钮</el-button>
          </div>
        </div>

        <!-- 边框展示 -->
        <div class="section">
          <h3>边框样式</h3>
          <div class="border-demo">
            <div class="border-box bsf-border">默认边框</div>
            <div class="border-box bsf-border-decoration">装饰边框</div>
          </div>
        </div>

        <!-- 背景展示 -->
        <div class="section">
          <h3>背景样式</h3>
          <div class="bg-demo">
            <div class="bg-box" style="background: var(--bsf-bg-color-base)">基础背景</div>
            <div class="bg-box" style="background: var(--bsf-bg-color-light)">浅色背景</div>
            <div class="bg-box" style="background: var(--bsf-bg-color-lighter)">更浅背景</div>
          </div>
        </div>

        <!-- 其他组件展示 -->
        <div class="section">
          <h3>组件展示</h3>
          <div class="component-demo">
            <el-input v-model="inputValue" placeholder="请输入内容" />
            <el-select v-model="selectValue" placeholder="请选择">
              <el-option label="选项1" value="1" />
              <el-option label="选项2" value="2" />
            </el-select>
            <el-switch v-model="switchValue" />
            <el-slider v-model="sliderValue" />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ThemeConfig from './components/ThemeConfig.vue';

// 示例数据
const inputValue = ref('');
const selectValue = ref('');
const switchValue = ref(false);
const sliderValue = ref(50);
</script>

<style lang="scss" scoped>
.theme-demo {
  padding: 20px;
  min-height: 100vh;
  background: var(--bsf-bg-color-lighter);

  .demo-content {
    margin-top: 20px;

    .demo-card {
      max-width: 800px;
      margin: 0 auto;

      .section {
        margin-bottom: 30px;

        &:last-child {
          margin-bottom: 0;
        }

        h3 {
          margin-bottom: 16px;
          color: var(--bsf-text-color-primary);
          font-size: var(--bsf-font-size-lg);
        }
      }

      .text-demo {
        p {
          margin-bottom: 8px;
          line-height: 1.5;
        }
      }

      .button-demo {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .border-demo {
        display: flex;
        gap: 20px;

        .border-box {
          padding: 20px;
          text-align: center;
          border-radius: var(--bsf-radius-base);
        }
      }

      .bg-demo {
        display: flex;
        gap: 20px;

        .bg-box {
          flex: 1;
          padding: 20px;
          text-align: center;
          border-radius: var(--bsf-radius-base);
          border: 1px solid var(--bsf-border-color-light);
        }
      }

      .component-demo {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;

        :deep(.el-input),
        :deep(.el-select) {
          width: 200px;
        }

        :deep(.el-slider) {
          width: 300px;
        }
      }
    }
  }
}
</style>
