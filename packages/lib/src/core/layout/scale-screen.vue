<template>
  <div
    ref="screenRef"
    :class="[
      'v-screen-box',
      `v-screen-theme-${theme}`,
      options?.className,
      {
        'v-screen-smooth': options?.smoothScaling,
        'v-screen-draggable': options?.gestures?.dragEnabled
      }
    ]"
    :style="containerStyle"
    @wheel="handleWheel"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- 网格 -->
    <div v-if="options?.grid?.enabled" class="v-screen-grid" :style="gridStyle">
      <div v-if="options?.grid?.showGuides" class="v-screen-guides"></div>
    </div>

    <!-- 导航器 -->
    <div
      v-if="options?.navigator?.enabled"
      class="v-screen-navigator"
      :class="[`v-screen-navigator-${options.navigator.position || 'bottom-right'}`]"
      :style="navigatorStyle"
    >
      <slot name="navigator">
        <div class="v-screen-navigator-content">
          <div class="v-screen-navigator-viewport"></div>
        </div>
      </slot>
    </div>

    <!-- 工具栏 -->
    <div class="v-screen-toolbar">
      <slot name="toolbar">
        <div class="v-screen-toolbar-content">
          <button @click="zoomIn">+</button>
          <span>{{ (currentScale * 100).toFixed(0) }}%</span>
          <button @click="zoomOut">-</button>
          <button @click="reset">重置</button>
          <button @click="toggleFullscreen">
            {{ isFullscreen ? '退出全屏' : '全屏' }}
          </button>
        </div>
      </slot>
    </div>

    <!-- 主要内容 -->
    <div
      class="v-screen-content"
      :style="contentStyle"
      :class="[`v-screen-align-x-${alignX}`, `v-screen-align-y-${alignY}`]"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue';
import { useElementSize, useThrottleFn, useEventListener } from '@vueuse/core';
import type { ScaleMode, ScaleScreenProps, ScaleScreenMethods, ScaleScreenEvents } from './types';

// Props 定义
const props = withDefaults(defineProps<ScaleScreenProps>(), {
  width: 1920,
  height: 1080,
  mode: 'fit',
  alignX: 'center',
  alignY: 'center',
  autoResize: true,
  theme: 'light',
  minScale: 0.1,
  maxScale: 2,
  options: () => ({
    smoothScaling: true,
    scaleStep: 0.1,
    transitionDuration: 300,
    debounceDelay: 100,
    grid: {
      enabled: false,
      size: 50,
      opacity: 0.1
    },
    gestures: {
      enabled: true,
      scaleSensitivity: 1,
      dragEnabled: true
    },
    shortcuts: {
      enabled: true,
      zoomIn: 'ctrl+plus',
      zoomOut: 'ctrl+minus',
      reset: 'ctrl+0',
      toggleFullscreen: 'f11'
    },
    navigator: {
      enabled: false,
      position: 'bottom-right',
      width: 200,
      height: 150,
      opacity: 0.7
    }
  })
});

// Emits 定义
const emit = defineEmits<{
  (e: 'scale', scale: number): void;
  (e: 'mode-change', mode: ScaleMode): void;
  (e: 'align-change', horizontal: string, vertical: string): void;
  (e: 'fullscreen-change', isFullscreen: boolean): void;
  (e: 'resize', width: number, height: number): void;
}>();

// Refs
const screenRef = ref<HTMLElement>();
const currentScale = ref(1);
const isFullscreen = ref(false);
const touchStartDistance = ref(0);
const touchStartScale = ref(1);

// 计算属性
const containerStyle = computed(() => ({
  '--screen-transition-duration': `${props.options?.transitionDuration || 300}ms`,
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden'
}));

const contentStyle = computed(() => ({
  transform: `scale(${currentScale.value})`,
  transformOrigin: '0 0',
  width: `${props.width}px`,
  height: `${props.height}px`
}));

const gridStyle = computed(() => ({
  opacity: props.options?.grid?.opacity,
  '--grid-size': `${props.options?.grid?.size}px`,
  '--grid-color': props.options?.grid?.color || 'currentColor'
}));

const navigatorStyle = computed(() => ({
  width: `${props.options?.navigator?.width}px`,
  height: `${props.options?.navigator?.height}px`,
  opacity: props.options?.navigator?.opacity
}));

// 方法
const calculateScale = (mode: ScaleMode = props.mode) => {
  const container = screenRef.value;
  if (!container) return;

  const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
  const { width: targetWidth, height: targetHeight } = props;
  let scale = 1;

  switch (mode) {
    case 'fit':
      scale = Math.min(containerWidth / targetWidth, containerHeight / targetHeight);
      break;
    case 'stretch':
      scale = Math.min(containerWidth / targetWidth, containerHeight / targetHeight);
      break;
    case 'uniform':
      scale = containerWidth / targetWidth;
      break;
  }

  scale = Math.min(Math.max(scale, props.minScale), props.maxScale);
  currentScale.value = scale;
  emit('scale', scale);
};

// 手势处理
const handleWheel = (e: WheelEvent) => {
  if (!props.options?.gestures?.enabled) return;

  if (e.ctrlKey) {
    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * (props.options?.scaleStep || 0.1);
    const newScale = currentScale.value + delta;
    setScale(newScale);
  }
};

const handleTouchStart = (e: TouchEvent) => {
  if (!props.options?.gestures?.enabled || e.touches.length !== 2) return;

  const distance = Math.hypot(
    e.touches[0].clientX - e.touches[1].clientX,
    e.touches[0].clientY - e.touches[1].clientY
  );
  touchStartDistance.value = distance;
  touchStartScale.value = currentScale.value;
};

const handleTouchMove = (e: TouchEvent) => {
  if (!props.options?.gestures?.enabled || e.touches.length !== 2) return;

  const distance = Math.hypot(
    e.touches[0].clientX - e.touches[1].clientX,
    e.touches[0].clientY - e.touches[1].clientY
  );
  const scale = (distance / touchStartDistance.value) * touchStartScale.value;
  setScale(scale);
};

const handleTouchEnd = () => {
  touchStartDistance.value = 0;
  touchStartScale.value = 1;
};

// 实例方法
const reset = () => {
  calculateScale(props.mode);
};

const zoomIn = () => {
  setScale(currentScale.value + (props.options?.scaleStep || 0.1));
};

const zoomOut = () => {
  setScale(currentScale.value - (props.options?.scaleStep || 0.1));
};

const setScale = (scale: number) => {
  const newScale = Math.min(Math.max(scale, props.minScale), props.maxScale);
  currentScale.value = newScale;
  emit('scale', newScale);
};

const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    await screenRef.value?.requestFullscreen();
    isFullscreen.value = true;
  } else {
    await document.exitFullscreen();
    isFullscreen.value = false;
  }
  emit('fullscreen-change', isFullscreen.value);
};

const getSnapshot = async (): Promise<string> => {
  // 实现截图功能
  return '';
};

// 快捷键处理
const setupShortcuts = () => {
  if (!props.options?.shortcuts?.enabled) return;

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.ctrlKey) {
      switch (e.key) {
        case '+':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          reset();
          break;
      }
    } else if (e.key === 'F11') {
      e.preventDefault();
      toggleFullscreen();
    }
  };

  useEventListener(window, 'keydown', handleKeydown);
};

// ResizeObserver
const setupResizeObserver = () => {
  if (!props.autoResize) return;

  const observer = new ResizeObserver(
    useThrottleFn(() => {
      calculateScale(props.mode);
    }, props.options?.debounceDelay || 100)
  );

  if (screenRef.value) {
    observer.observe(screenRef.value);
  }

  onUnmounted(() => {
    observer.disconnect();
  });
};

// 生命周期
onMounted(() => {
  calculateScale(props.mode);
  setupShortcuts();
  setupResizeObserver();
});

// 暴露实例方法
defineExpose<ScaleScreenMethods>({
  reset,
  zoomIn,
  zoomOut,
  setScale,
  toggleFullscreen,
  getSnapshot
});
</script>

<style lang="scss" scoped>
.v-screen-box {
  --screen-transition-duration: 300ms;
  --screen-bg-color: var(--bsf-color-background-base);
  --screen-grid-color: var(--bsf-color-border-light);
  --screen-toolbar-bg: var(--bsf-color-background-light);
  --screen-toolbar-color: var(--bsf-color-text-primary);

  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--screen-bg-color);
  overflow: hidden;

  &.v-screen-smooth {
    .v-screen-content {
      transition: transform var(--screen-transition-duration);
    }
  }

  &.v-screen-draggable {
    .v-screen-content {
      cursor: move;
    }
  }
}

.v-screen-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(var(--screen-grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--screen-grid-color) 1px, transparent 1px);
  background-size: var(--grid-size) var(--grid-size);
}

.v-screen-navigator {
  position: absolute;
  background: var(--screen-toolbar-bg);
  border: 1px solid var(--bsf-color-border-light);
  border-radius: 4px;
  overflow: hidden;
  z-index: 100;

  &-bottom-right {
    bottom: 16px;
    right: 16px;
  }

  &-bottom-left {
    bottom: 16px;
    left: 16px;
  }

  &-top-right {
    top: 16px;
    right: 16px;
  }

  &-top-left {
    top: 16px;
    left: 16px;
  }
}

.v-screen-toolbar {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;

  &-content {
    display: flex;
    gap: 8px;
    padding: 8px;
    background: var(--screen-toolbar-bg);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    button {
      padding: 4px 8px;
      border: 1px solid var(--bsf-color-border-light);
      border-radius: 4px;
      background: var(--bsf-color-background-base);
      color: var(--screen-toolbar-color);
      cursor: pointer;

      &:hover {
        background: var(--bsf-color-primary-light);
      }
    }

    span {
      padding: 4px 8px;
      color: var(--screen-toolbar-color);
    }
  }
}

.v-screen-content {
  position: absolute;
  transform-origin: 0 0;
  will-change: transform;

  &.v-screen-align-x-left {
    left: 0;
  }
  &.v-screen-align-x-center {
    left: 50%;
    transform: translateX(-50%);
  }
  &.v-screen-align-x-right {
    right: 0;
  }

  &.v-screen-align-y-top {
    top: 0;
  }
  &.v-screen-align-y-center {
    top: 50%;
    transform: translateY(-50%);
  }
  &.v-screen-align-y-bottom {
    bottom: 0;
  }

  &.v-screen-align-x-center.v-screen-align-y-center {
    transform: translate(-50%, -50%);
  }
}

// 主题变体
.v-screen-theme-dark {
  --screen-bg-color: var(--bsf-color-background-dark);
  --screen-grid-color: rgba(255, 255, 255, 0.1);
  --screen-toolbar-bg: var(--bsf-color-background-light);
  --screen-toolbar-color: var(--bsf-color-text-primary);
}

.v-screen-theme-light {
  --screen-bg-color: var(--bsf-color-background-light);
  --screen-grid-color: rgba(0, 0, 0, 0.1);
  --screen-toolbar-bg: var(--bsf-color-background-base);
  --screen-toolbar-color: var(--bsf-color-text-primary);
}
</style>
