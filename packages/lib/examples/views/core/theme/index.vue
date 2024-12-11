<template>
  <div class="core-theme">
    <h2>主题系统</h2>

    <el-row :gutter="20">
      <!-- 主题切换 -->
      <el-col :span="24">
        <el-card class="theme-switch-card">
          <template #header>
            <div class="card-header">
              <span>主题设置</span>
            </div>
          </template>

          <el-form :model="themeConfig" label-width="100px">
            <el-form-item label="主题模式">
              <el-radio-group v-model="themeConfig.mode" @change="handleModeChange">
                <el-radio-button value="light">
                  <el-icon><Sunny /></el-icon>
                  亮色模式
                </el-radio-button>
                <el-radio-button value="dark">
                  <el-icon><Moon /></el-icon>
                  暗色模式
                </el-radio-button>
                <el-radio-button value="system">
                  <el-icon><Monitor /></el-icon>
                  跟随系统
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="主题色">
              <el-color-picker
                v-model="themeConfig.primaryColor"
                :predefine="predefineColors"
                @change="handlePrimaryColorChange"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 颜色展示 -->
      <el-col :span="12">
        <el-card class="theme-colors-card">
          <template #header>
            <div class="card-header">
              <span>主题色板</span>
            </div>
          </template>

          <!-- 品牌色 -->
          <div class="color-section">
            <h4>品牌色</h4>
            <div class="color-list">
              <div v-for="color in brandColors" :key="color.name" class="color-item">
                <div
                  class="color-block"
                  :style="{ backgroundColor: `var(--el-color-${color.name})` }"
                />
                <div class="color-info">
                  <span class="color-name">{{ color.label }}</span>
                  <span class="color-value">{{ `var(--el-color-${color.name})` }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 文字颜色 -->
          <div class="color-section">
            <h4>文字颜色</h4>
            <div class="color-list">
              <div v-for="color in textColors" :key="color.name" class="color-item">
                <div
                  class="color-block"
                  :style="{ backgroundColor: `var(--el-text-color-${color.name})` }"
                />
                <div class="color-info">
                  <span class="color-name">{{ color.label }}</span>
                  <span class="color-value">{{ `var(--el-text-color-${color.name})` }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 背景颜色 -->
          <div class="color-section">
            <h4>背景颜色</h4>
            <div class="color-list">
              <div v-for="color in bgColors" :key="color.name" class="color-item">
                <div
                  class="color-block"
                  :style="{ backgroundColor: `var(--el-bg-color-${color.name})` }"
                />
                <div class="color-info">
                  <span class="color-name">{{ color.label }}</span>
                  <span class="color-value">{{ `var(--el-bg-color-${color.name})` }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 边框颜色 -->
          <div class="color-section">
            <h4>边框颜色</h4>
            <div class="color-list">
              <div v-for="color in borderColors" :key="color.name" class="color-item">
                <div
                  class="color-block"
                  :style="{ backgroundColor: `var(--el-border-color-${color.name})` }"
                />
                <div class="color-info">
                  <span class="color-name">{{ color.label }}</span>
                  <span class="color-value">{{ `var(--el-border-color-${color.name})` }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 组件预览 -->
      <el-col :span="12">
        <el-card class="theme-preview-card">
          <template #header>
            <div class="card-header">
              <span>组件预览</span>
            </div>
          </template>

          <div class="preview-section">
            <el-form :model="previewData" label-width="80px">
              <el-form-item label="输入框">
                <el-input v-model="previewData.input" placeholder="请输入内容">
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item label="选择器">
                <el-select v-model="previewData.select" placeholder="请选择">
                  <el-option label="选项1" value="1" />
                  <el-option label="选项2" value="2" />
                  <el-option label="选项3" value="3" />
                </el-select>
              </el-form-item>

              <el-form-item label="按钮">
                <div class="button-group">
                  <el-button>默认按钮</el-button>
                  <el-button type="primary">主要按钮</el-button>
                  <el-button type="success">成功按钮</el-button>
                  <el-button type="warning">警告按钮</el-button>
                  <el-button type="danger">危险按钮</el-button>
                </div>
              </el-form-item>

              <el-form-item label="标签">
                <div class="tag-group">
                  <el-tag>默认标签</el-tag>
                  <el-tag type="success">成功标签</el-tag>
                  <el-tag type="warning">警告标签</el-tag>
                  <el-tag type="danger">危险标签</el-tag>
                  <el-tag type="info">信息标签</el-tag>
                </div>
              </el-form-item>

              <el-form-item label="开关">
                <el-switch v-model="previewData.switch" />
              </el-form-item>

              <el-form-item label="滑块">
                <el-slider v-model="previewData.slider" />
              </el-form-item>

              <el-form-item label="进度条">
                <el-progress :percentage="previewData.progress" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { ThemeManager } from '@lib/core/theme';
import { useTheme } from '@lib/core/theme';
import { Sunny, Moon, Monitor, Search } from '@element-plus/icons-vue';

// 主题管理器实例
const themeManager = ThemeManager.getInstance();
const { isDark, toggleTheme } = useTheme();

// 预定义颜色
const predefineColors = [
  '#409EFF', // 默认蓝色
  '#67C23A', // 绿色
  '#E6A23C', // 黄色
  '#F56C6C', // 红色
  '#909399', // 灰色
  '#8E44AD', // 紫色
  '#2980B9', // 深蓝色
  '#16A085' // 青色
];

// 主题配置
const themeConfig = reactive({
  mode: isDark.value ? 'dark' : 'light',
  primaryColor:
    document.documentElement.style.getPropertyValue('--el-color-primary').trim() || '#409EFF'
});

// 主题色更新函数
const updateThemeColor = (color: string) => {
  const el = document.documentElement;

  // 获取主题色的 rgb 值
  const colorObj = new window.Color(color);
  const rgb = colorObj.toRgb();

  // 设置主题色
  el.style.setProperty('--el-color-primary', color);

  // 设置主题色的不同透明度变体
  for (let i = 1; i <= 9; i++) {
    const mixColor = i === 2 ? 'var(--el-color-white)' : 'var(--el-color-white)';
    const mixAmount = i / 10;
    el.style.setProperty(
      `--el-color-primary-light-${i}`,
      colorObj.mix(mixColor, mixAmount).toRgbString()
    );
  }

  // 设置主题色的暗色变体
  el.style.setProperty(
    '--el-color-primary-dark-2',
    colorObj.mix('var(--el-color-black)', 0.2).toRgbString()
  );
};

// 预览数据
const previewData = reactive({
  input: '',
  select: '',
  switch: true,
  slider: 50,
  progress: 80
});

// 品牌色
const brandColors = [
  { name: 'primary', label: '主要' },
  { name: 'success', label: '成功' },
  { name: 'warning', label: '警告' },
  { name: 'danger', label: '危险' },
  { name: 'info', label: '信息' }
];

// 文字颜色
const textColors = [
  { name: 'primary', label: '主要文本' },
  { name: 'regular', label: '常规文本' },
  { name: 'secondary', label: '次要文本' },
  { name: 'placeholder', label: '占位文本' }
];

// 背景颜色
const bgColors = [
  { name: '', label: '基础背景' },
  { name: 'page', label: '页面背景' },
  { name: 'overlay', label: '浮层背景' }
];

// 边框颜色
const borderColors = [
  { name: '', label: '基础边框' },
  { name: 'light', label: '浅色边框' },
  { name: 'lighter', label: '更浅边框' },
  { name: 'extra-light', label: '特浅边框' }
];

// 初始化
onMounted(() => {
  // 检查系统主题
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
    if (themeConfig.mode === 'system') {
      isDark.value = e.matches;
    }
  };

  // 监听系统主题变化
  prefersDark.addEventListener('change', handleSystemThemeChange);

  // 如果初始模式是系统，则应用系统主题
  if (themeConfig.mode === 'system') {
    handleSystemThemeChange(prefersDark);
  }

  // 初始化主题色
  updateThemeColor(themeConfig.primaryColor);
});

// 处理主题模式变化
const handleModeChange = (mode: string) => {
  if (mode === 'system') {
    // 跟随系统
    themeConfig.mode = mode;
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    // 手动切换
    themeConfig.mode = mode;
    isDark.value = mode === 'dark';
  }
};

// 处理主题色变化
const handlePrimaryColorChange = (color: string) => {
  if (!color) return;
  themeConfig.primaryColor = color;
  updateThemeColor(color);
};
</script>

<style lang="scss" scoped>
.core-theme {
  padding: 20px;

  h2 {
    margin: 0 0 20px;
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .el-card {
    margin-bottom: 20px;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: 16px;
      font-weight: 500;
    }
  }

  .theme-switch-card {
    :deep(.el-radio-button__inner) {
      display: flex;
      align-items: center;
      gap: 4px;

      .el-icon {
        font-size: 16px;
      }
    }
  }

  .color-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      margin: 0 0 12px;
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }

    .color-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      .color-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px;
        border-radius: 4px;
        background-color: var(--el-fill-color-blank);
        transition: background-color var(--bsf-transition-duration) var(--bsf-transition-timing);

        &:hover {
          background-color: var(--el-fill-color-light);
        }

        .color-block {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          border: 1px solid var(--el-border-color-light);
        }

        .color-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;

          .color-name {
            font-size: 14px;
            font-weight: 500;
            color: var(--el-text-color-primary);
          }

          .color-value {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            word-break: break-all;
          }
        }
      }
    }
  }

  .preview-section {
    .button-group,
    .tag-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    :deep(.el-form-item) {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .preview-section {
    .el-card {
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }
  }

  .color-item {
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
}
</style>
