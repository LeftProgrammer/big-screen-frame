<template>
  <div class="core-theme">
    <h2>主题系统</h2>

    <el-card class="theme-demo">
      <template #header>
        <div class="card-header">
          <span>主题切换示例</span>
          <el-switch
            v-model="isDark"
            active-text="暗色"
            inactive-text="亮色"
            @change="handleThemeChange"
          />
        </div>
      </template>

      <div class="theme-colors">
        <h3>主题色板</h3>
        <div class="color-list">
          <div v-for="(color, name) in themeColors" :key="name" class="color-item">
            <div class="color-block" :style="{ backgroundColor: `var(--bsf-color-${name})` }"></div>
            <div class="color-info">
              <span class="color-name">{{ name }}</span>
              <span class="color-value">{{ color }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="theme-preview">
        <h3>组件预览</h3>
        <div class="preview-content">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-button type="primary">主要按钮</el-button>
              <el-button type="success">成功按钮</el-button>
              <el-button type="warning">警告按钮</el-button>
              <el-button type="danger">危险按钮</el-button>
            </el-col>
            <el-col :span="12">
              <el-input v-model="inputText" placeholder="请输入内容" />
              <el-select v-model="selectValue" placeholder="请选择">
                <el-option label="选项1" value="1" />
                <el-option label="选项2" value="2" />
              </el-select>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="theme-customize">
        <h3>主题定制</h3>
        <el-form :model="customColors" label-width="120px">
          <el-form-item label="主题色">
            <el-color-picker v-model="customColors.primary" @change="updateThemeColor('primary')" />
          </el-form-item>
          <el-form-item label="成功色">
            <el-color-picker v-model="customColors.success" @change="updateThemeColor('success')" />
          </el-form-item>
          <el-form-item label="警告色">
            <el-color-picker v-model="customColors.warning" @change="updateThemeColor('warning')" />
          </el-form-item>
          <el-form-item label="危险色">
            <el-color-picker v-model="customColors.danger" @change="updateThemeColor('danger')" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="theme-docs">
      <template #header>
        <div class="card-header">
          <span>使用说明</span>
        </div>
      </template>

      <div class="docs-content">
        <h3>1. 初始化主题</h3>
        <pre><code>
import { ThemeManager } from '@lib/core/theme';

const themeManager = new ThemeManager({
  enableTransition: true,
  enableElementPlus: true
});

// 设置默认主题
themeManager.setTheme('dark');
        </code></pre>

        <h3>2. 切换主题</h3>
        <pre><code>
// 使用 Composition API
import { useTheme } from '@lib/core/theme';

const { setTheme } = useTheme();
setTheme('light'); // 或 'dark'
        </code></pre>

        <h3>3. 自定义主题色</h3>
        <pre><code>
const { updateThemeColors } = useTheme();

updateThemeColors({
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  danger: '#ff4d4f'
});
        </code></pre>

        <h3>4. CSS变量使用</h3>
        <pre><code>
.my-component {
  color: var(--bsf-text-color-primary);
  background: var(--bsf-bg-color-base);
  border: 1px solid var(--bsf-border-color-base);
}
        </code></pre>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTheme } from '@lib/core/theme';
import { ThemeManager } from '@lib/core/theme';

const themeManager = ThemeManager.getInstance();
const { setTheme } = useTheme();

const isDark = ref(themeManager.getCurrentTheme().type === 'dark');
const inputText = ref('');
const selectValue = ref('');

// 主题色板
const themeColors = computed(() => {
  const colors: Record<string, string> = {};
  const vars = themeManager.getCSSVars;
  Object.entries(vars).forEach(([key, value]) => {
    if (key.startsWith('--bsf-color-') && !key.includes('-light') && !key.includes('-dark')) {
      colors[key.replace('--bsf-color-', '')] = value;
    }
  });
  return colors;
});

// 自定义主题色
const customColors = ref({
  primary: themeManager.getCssVar('color-primary'),
  success: themeManager.getCssVar('color-success'),
  warning: themeManager.getCssVar('color-warning'),
  danger: themeManager.getCssVar('color-danger')
});

// 切换主题
const handleThemeChange = (value: boolean) => {
  const theme = value ? 'dark' : 'light';
  setTheme(theme);
};

// 更新主题色
const updateThemeColor = (type: string) => {
  themeManager.updateThemeColors({
    [type]: customColors.value[type as keyof typeof customColors.value]
  });
};
</script>

<style scoped lang="scss">
.core-theme {
  padding: 20px;

  .theme-demo {
    margin-bottom: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .theme-colors {
    margin-bottom: 30px;

    .color-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .color-item {
      display: flex;
      align-items: center;
      padding: 10px;
      border: 1px solid var(--el-border-color);
      border-radius: var(--el-border-radius-base);

      .color-block {
        width: 40px;
        height: 40px;
        border-radius: var(--el-border-radius-base);
        margin-right: 10px;
      }

      .color-info {
        display: flex;
        flex-direction: column;

        .color-name {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .color-value {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }

  .theme-preview {
    margin-bottom: 30px;

    .preview-content {
      margin-top: 20px;

      .el-row {
        margin-bottom: 20px;
      }

      .el-button {
        margin-right: 10px;
        margin-bottom: 10px;
      }

      .el-input {
        margin-bottom: 10px;
      }
    }
  }

  .theme-customize {
    margin-bottom: 30px;

    .el-form {
      max-width: 500px;
      margin-top: 20px;
    }
  }

  .theme-docs {
    .docs-content {
      h3 {
        margin-top: 30px;
        margin-bottom: 15px;
        font-weight: 500;
      }

      pre {
        background-color: var(--el-bg-color-page);
        padding: 15px;
        border-radius: var(--el-border-radius-base);
        margin: 10px 0;
        overflow-x: auto;

        code {
          font-family: Monaco, Consolas, Courier, monospace;
          font-size: 14px;
          line-height: 1.5;
          color: var(--el-text-color-regular);
        }
      }
    }
  }
}
</style>
