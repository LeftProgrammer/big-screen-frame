<template>
  <div class="core-transition">
    <h2>过渡动画</h2>

    <el-row :gutter="20">
      <!-- 过渡动画设置 -->
      <el-col :span="24">
        <el-card class="transition-card">
          <template #header>
            <div class="card-header">
              <span>全局动画配置</span>
            </div>
          </template>

          <el-form :model="transitionConfig" label-width="100px">
            <el-form-item label="启用动画">
              <el-switch
                v-model="transitionConfig.enableTransition"
                @change="handleTransitionChange"
              />
            </el-form-item>
            <el-form-item v-if="transitionConfig.enableTransition" label="动画时长">
              <el-slider
                v-model="transitionConfig.duration"
                :min="100"
                :max="1000"
                :step="50"
                :format-tooltip="val => `${val}ms`"
                @change="handleTransitionChange"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 内置动画效果 -->
      <el-col :span="12">
        <el-card class="animation-card">
          <template #header>
            <div class="card-header">
              <span>内置动画效果</span>
            </div>
          </template>

          <div class="animation-list">
            <div v-for="animation in animations" :key="animation.name" class="animation-item">
              <div class="animation-header">
                <h4>{{ animation.label }}</h4>
                <el-button @click="playAnimation(animation.name)">播放</el-button>
              </div>
              <div class="animation-preview">
                <div
                  class="preview-box"
                  :class="[animation.name, { active: activeAnimations.includes(animation.name) }]"
                >
                  <el-icon :size="32"><Monitor /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 自定义动画 -->
      <el-col :span="12">
        <el-card class="custom-animation-card">
          <template #header>
            <div class="card-header">
              <span>自定义动画</span>
            </div>
          </template>

          <div class="custom-animation">
            <el-form :model="customAnimation" label-width="100px">
              <el-form-item label="变换属性">
                <el-select v-model="customAnimation.property" placeholder="选择变换属性">
                  <el-option label="缩放" value="scale" />
                  <el-option label="旋转" value="rotate" />
                  <el-option label="位移" value="translate" />
                  <el-option label="透明度" value="opacity" />
                </el-select>
              </el-form-item>

              <el-form-item label="变换值">
                <el-input-number
                  v-model="customAnimation.value"
                  :min="0"
                  :max="360"
                  :step="customAnimation.property === 'rotate' ? 45 : 0.1"
                  :precision="customAnimation.property === 'rotate' ? 0 : 2"
                />
              </el-form-item>

              <el-form-item label="持续时间">
                <el-slider
                  v-model="customAnimation.duration"
                  :min="100"
                  :max="2000"
                  :step="100"
                  :format-tooltip="val => `${val}ms`"
                />
              </el-form-item>

              <el-form-item label="缓动函数">
                <el-select v-model="customAnimation.easing" placeholder="选择缓动函数">
                  <el-option label="线性" value="linear" />
                  <el-option label="缓入" value="ease-in" />
                  <el-option label="缓出" value="ease-out" />
                  <el-option label="缓入缓出" value="ease-in-out" />
                </el-select>
              </el-form-item>
            </el-form>

            <div class="preview-section">
              <el-button type="primary" @click="playCustomAnimation">播放动画</el-button>
              <div
                class="custom-preview-box"
                :style="customAnimationStyle"
                :class="{ active: isCustomAnimationPlaying }"
              >
                <el-icon :size="32"><Monitor /></el-icon>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { Monitor } from '@element-plus/icons-vue';
import { TransitionManager } from '@lib/core/transition';

// 过渡动画管理器实例
const transitionManager = TransitionManager.getInstance();

// 过渡动画配置
const transitionConfig = reactive(transitionManager.getConfig());

// 处理过渡动画配置变化
const handleTransitionChange = () => {
  transitionManager.updateConfig(transitionConfig);
};

// 内置动画列表
const animations = [
  { name: 'fade', label: '淡入淡出' },
  { name: 'slide-up', label: '上滑入' },
  { name: 'slide-down', label: '下滑入' },
  { name: 'slide-left', label: '左滑入' },
  { name: 'slide-right', label: '右滑入' },
  { name: 'scale', label: '缩放' },
  { name: 'rotate', label: '旋转' },
  { name: 'flip', label: '翻转' }
];

// 当前激活的动画
const activeAnimations = ref<string[]>([]);

// 播放内置动画
const playAnimation = (name: string) => {
  activeAnimations.value = activeAnimations.value.filter(n => n !== name);
  setTimeout(() => {
    activeAnimations.value.push(name);
    setTimeout(() => {
      activeAnimations.value = activeAnimations.value.filter(n => n !== name);
    }, transitionConfig.duration);
  }, 0);
};

// 自定义动画配置
const customAnimation = reactive({
  property: 'scale',
  value: 1.5,
  duration: 500,
  easing: 'ease-in-out'
});

// 自定义动画状态
const isCustomAnimationPlaying = ref(false);

// 自定义动画样式
const customAnimationStyle = computed(() => {
  if (!isCustomAnimationPlaying.value) {
    return {
      transition: 'none'
    };
  }

  const transform = (() => {
    switch (customAnimation.property) {
      case 'scale':
        return `scale(${customAnimation.value})`;
      case 'rotate':
        return `rotate(${customAnimation.value}deg)`;
      case 'translate':
        return `translateY(${customAnimation.value * 100}%)`;
      default:
        return 'none';
    }
  })();

  return {
    transition: `all ${customAnimation.duration}ms ${customAnimation.easing}`,
    transform,
    opacity: customAnimation.property === 'opacity' ? customAnimation.value : 1
  };
});

// 播放自定义动画
const playCustomAnimation = () => {
  isCustomAnimationPlaying.value = false;
  setTimeout(() => {
    isCustomAnimationPlaying.value = true;
    setTimeout(() => {
      isCustomAnimationPlaying.value = false;
    }, customAnimation.duration);
  }, 0);
};
</script>

<style lang="scss" scoped>
.core-transition {
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    color: var(--bsf-text-color-primary);
  }

  .el-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .animation-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;

    .animation-item {
      .animation-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;

        h4 {
          margin: 0;
          color: var(--bsf-text-color-primary);
        }
      }

      .animation-preview {
        display: flex;
        justify-content: center;
        padding: 20px;
        background-color: var(--bsf-bg-color-overlay);
        border-radius: 8px;

        .preview-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background-color: var(--bsf-bg-color-base);
          border-radius: 8px;
          color: var(--bsf-text-color-primary);

          // 内置动画效果
          &.fade {
            opacity: 1;
            transition: opacity var(--bsf-transition-duration) ease-in-out;

            &.active {
              opacity: 0;
            }
          }

          &.slide-up {
            transform: translateY(0);
            transition: transform var(--bsf-transition-duration) ease-in-out;

            &.active {
              transform: translateY(-100%);
            }
          }

          &.slide-down {
            transform: translateY(0);
            transition: transform var(--bsf-transition-duration) ease-in-out;

            &.active {
              transform: translateY(100%);
            }
          }

          &.slide-left {
            transform: translateX(0);
            transition: transform var(--bsf-transition-duration) ease-in-out;

            &.active {
              transform: translateX(-100%);
            }
          }

          &.slide-right {
            transform: translateX(0);
            transition: transform var(--bsf-transition-duration) ease-in-out;

            &.active {
              transform: translateX(100%);
            }
          }

          &.scale {
            transform: scale(1);
            transition: transform var(--bsf-transition-duration) ease-in-out;

            &.active {
              transform: scale(1.5);
            }
          }

          &.rotate {
            transform: rotate(0);
            transition: transform var(--bsf-transition-duration) ease-in-out;

            &.active {
              transform: rotate(360deg);
            }
          }

          &.flip {
            transform: perspective(400px) rotateY(0);
            transition: transform var(--bsf-transition-duration) ease-in-out;

            &.active {
              transform: perspective(400px) rotateY(180deg);
            }
          }
        }
      }
    }
  }

  .custom-animation {
    .preview-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--bsf-border-color-base);

      .custom-preview-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        background-color: var(--bsf-bg-color-overlay);
        border-radius: 8px;
        color: var(--bsf-text-color-primary);
      }
    }
  }
}
</style>
