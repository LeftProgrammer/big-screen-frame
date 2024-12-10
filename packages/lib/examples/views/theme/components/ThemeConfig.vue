<template>
  <div class="theme-config">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>主题配置</span>
        </div>
      </template>

      <!-- 主题模式切换 -->
      <div class="config-item">
        <span class="label">主题模式：</span>
        <el-radio-group v-model="themeMode" @change="handleModeChange">
          <el-radio-button label="light">亮色</el-radio-button>
          <el-radio-button label="dark">暗色</el-radio-button>
          <el-radio-button label="system">跟随系统</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 主题色配置 -->
      <div class="config-item">
        <span class="label">主题色：</span>
        <el-color-picker
          v-model="primaryColor"
          :predefine="predefineColors"
          @change="handleColorChange"
        />
      </div>

      <!-- 其他颜色配置 -->
      <div class="config-item">
        <span class="label">功能色：</span>
        <div class="color-list">
          <el-tooltip
            v-for="(color, key) in functionalColors"
            :key="key"
            :content="colorLabels[key]"
            placement="top"
          >
            <div class="color-item">
              <el-color-picker
                v-model="functionalColors[key]"
                :predefine="predefineColors"
                @change="value => handleFunctionalColorChange(key, value)"
              />
            </div>
          </el-tooltip>
        </div>
      </div>

      <!-- 过渡动画开关 -->
      <div class="config-item">
        <span class="label">过渡动画：</span>
        <el-switch v-model="enableTransition" @change="handleTransitionChange" />
      </div>

      <!-- Element Plus 集成开关 -->
      <div class="config-item">
        <span class="label">Element Plus：</span>
        <el-switch v-model="enableElementPlus" @change="handleElementPlusChange" />
      </div>

      <!-- 重置按钮 -->
      <div class="config-item">
        <el-button type="primary" @click="resetTheme">重置主题</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ThemeManager } from '../../../core/theme';
import type { ThemeType } from '../../../core/theme/types';

const themeManager = ThemeManager.getInstance();

// 主题模式
const themeMode = ref<ThemeType>('light');
// 主题色
const primaryColor = ref('#409EFF');
// 功能色
const functionalColors = ref({
  success: '#67C23A',
  warning: '#E6A23C',
  danger: '#F56C6C',
  info: '#909399'
});
// 预定义颜色
const predefineColors = [
  '#409EFF',
  '#67C23A',
  '#E6A23C',
  '#F56C6C',
  '#909399',
  '#1890ff',
  '#52c41a',
  '#faad14',
  '#ff4d4f'
];
// 颜色标签
const colorLabels = {
  success: '成功色',
  warning: '警告色',
  danger: '危险色',
  info: '信息色'
};
// 配置项
const enableTransition = ref(true);
const enableElementPlus = ref(true);

// 初始化
onMounted(() => {
  const { type, vars } = themeManager.getCurrentTheme();
  themeMode.value = type;
  primaryColor.value = vars.bsf.colors.primary;
  functionalColors.value = {
    success: vars.bsf.colors.success,
    warning: vars.bsf.colors.warning,
    danger: vars.bsf.colors.danger,
    info: vars.bsf.colors.info
  };
});

// 切换主题模式
const handleModeChange = (value: ThemeType) => {
  themeManager.setTheme(value);
};

// 更新主题色
const handleColorChange = (value: string) => {
  themeManager.updateThemeColors({
    primaryColor: value
  });
};

// 更新功能色
const handleFunctionalColorChange = (key: string, value: string) => {
  themeManager.updateThemeColors({
    [`${key}Color`]: value
  });
};

// 切换过渡动画
const handleTransitionChange = (value: boolean) => {
  themeManager.configure({
    enableTransition: value
  });
};

// 切换 Element Plus 集成
const handleElementPlusChange = (value: boolean) => {
  themeManager.configure({
    enableElementPlus: value
  });
};

// 重置主题
const resetTheme = () => {
  themeManager.configure({
    type: 'light',
    enableTransition: true,
    enableElementPlus: true
  });
  themeMode.value = 'light';
  primaryColor.value = '#409EFF';
  functionalColors.value = {
    success: '#67C23A',
    warning: '#E6A23C',
    danger: '#F56C6C',
    info: '#909399'
  };
};
</script>

<style lang="scss" scoped>
.theme-config {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;

  .config-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .config-item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        width: 100px;
        margin-right: 16px;
        color: var(--bsf-text-color-regular);
      }

      .color-list {
        display: flex;
        gap: 12px;

        .color-item {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
