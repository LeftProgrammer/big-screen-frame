<template>
  <div 
    ref="screenRef"
    class="v-screen-box"
    :style="{ 
      width: `${width}px`,
      height: `${height}px`,
      transform: `scale(${scale}) translate(-50%, -50%)`,
      left: '50%',
      top: '50%'
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  width: number
  height: number
  delay?: number
}>(), {
  width: 1920,
  height: 1080,
  delay: 100
})

// 定义事件
const emit = defineEmits<{
  scale: [scale: number]
  resize: [width: number, height: number]
  fullscreen: [isFullscreen: boolean]
}>()

// 屏幕容器引用
const screenRef = ref<HTMLElement>()

// 缩放比例
const scale = ref(1)

// 计算缩放比例
const calculateScale = () => {
  if (!screenRef.value) return

  const parentElement = screenRef.value.parentElement
  if (!parentElement) return

  const { clientWidth, clientHeight } = parentElement
  const widthRatio = clientWidth / props.width
  const heightRatio = clientHeight / props.height
  
  // 取最小的缩放比例
  scale.value = Math.min(widthRatio, heightRatio)
  
  // 触发事件
  emit('scale', scale.value)
  emit('resize', clientWidth, clientHeight)
}

// 防抖函数
let resizeTimer: number | null = null
const handleResize = () => {
  if (resizeTimer) {
    window.clearTimeout(resizeTimer)
  }
  resizeTimer = window.setTimeout(calculateScale, props.delay)
}

// 全屏变化处理
const handleFullscreenChange = () => {
  const isFullscreen = document.fullscreenElement !== null
  emit('fullscreen', isFullscreen)
  calculateScale()
}

// 生命周期钩子
onMounted(() => {
  calculateScale()
  window.addEventListener('resize', handleResize)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  if (resizeTimer) {
    window.clearTimeout(resizeTimer)
  }
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style lang="scss" scoped>
@use '@/styles/base/variables' as *;

.v-screen-box {
  position: absolute;
  transform-origin: 0 0;
  transition: transform 0.3s;
  background-color: var(--screen-background, $screen-background);
  overflow: hidden;
}
</style>
