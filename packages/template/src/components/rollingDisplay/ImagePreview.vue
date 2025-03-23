<template>
  <Teleport to="body">
    <div 
      v-if="visible" 
      class="image-preview-mask"
      @click="handleClose"
      tabindex="-1"
      @keydown="handleKeydown"
    >
      <div class="image-preview-toolbar">
        <div class="toolbar-item" @click.stop="handleZoomIn" title="放大">
          <i class="iconfont icon-zoom-in">+</i>
        </div>
        <div class="toolbar-item" @click.stop="handleZoomOut" title="缩小">
          <i class="iconfont icon-zoom-out">-</i>
        </div>
        <div class="toolbar-item" @click.stop="() => handleRotate('counterclockwise')" title="逆时针旋转">
          <i class="iconfont icon-rotate-left">↺</i>
        </div>
        <div class="toolbar-item" @click.stop="() => handleRotate('clockwise')" title="顺时针旋转">
          <i class="iconfont icon-rotate-right">↻</i>
        </div>
        <div class="toolbar-item" @click.stop="toggleFullscreen" title="全屏">
          <i class="iconfont" :class="isFullscreen ? 'icon-fullscreen-exit' : 'icon-fullscreen'">⤢</i>
        </div>
        <div class="toolbar-item" @click.stop="handleReset" title="重置">
          <i class="iconfont icon-reset">⟲</i>
        </div>
        <div class="toolbar-item" @click.stop="handleClose" title="关闭">
          <i class="iconfont icon-close">×</i>
        </div>
      </div>
      <div 
        class="image-preview-content" 
        @wheel.prevent="handleWheel"
      >
        <img 
          :src="imageUrl" 
          alt="preview" 
          @click.stop
          :style="imageStyle"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp"
        >
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{
  visible: boolean
  imageUrl: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

// 状态管理
const scale = ref(1)
const rotation = ref(0)
const isFullscreen = ref(false)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const position = ref({ x: 0, y: 0 })

// 计算样式
const imageStyle = computed(() => ({
  transform: [
    `translate(${position.value.x}px, ${position.value.y}px)`,
    `rotate(${rotation.value}deg)`,
    `scale(${scale.value})`
  ].join(' '),
  cursor: isDragging.value ? 'grabbing' : 'grab',
  transformOrigin: 'center center'
}))

// 缩放处理
const handleZoomIn = () => {
  scale.value = Math.min(scale.value + 0.25, 5)
}

const handleZoomOut = () => {
  scale.value = Math.max(scale.value - 0.25, 0.25)
}

const handleWheel = (e: WheelEvent) => {
  if (e.deltaY < 0) {
    handleZoomIn()
  } else {
    handleZoomOut()
  }
}

// 旋转处理
const handleRotate = (direction: 'clockwise' | 'counterclockwise' = 'clockwise') => {
  const rotateAmount = direction === 'clockwise' ? 90 : -90
  rotation.value += rotateAmount
}

// 全屏处理
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  const elem = document.querySelector('.image-preview-mask') as HTMLElement
  if (isFullscreen.value) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

// 重置处理
const handleReset = () => {
  scale.value = 1
  rotation.value = 0
  position.value = { x: 0, y: 0 }
  isFullscreen.value = false
}

// 拖动处理
const handleMouseDown = (e: MouseEvent) => {
  isDragging.value = true
  dragStart.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  position.value = {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y
  }
}

const handleMouseUp = () => {
  isDragging.value = false
}

// 键盘事件处理
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Escape':
      handleClose()
      break
    case '+':
      handleZoomIn()
      break
    case '-':
      handleZoomOut()
      break
    case 'ArrowLeft':
      handleRotate('counterclockwise')
      break
    case 'ArrowRight':
      handleRotate('clockwise')
      break
    case 'f':
      toggleFullscreen()
      break
  }
}

const handleClose = () => {
  handleReset()
  emit('update:visible', false)
}
</script>

<style scoped>
.image-preview-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  cursor: default;
  animation: fadeIn 0.3s ease;
  user-select: none;
}

.image-preview-toolbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  border-radius: 8px;
  z-index: 100000;
}

.toolbar-item {
  color: white;
  font-size: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.toolbar-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.image-preview-content {
  max-width: 100%;
  max-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-preview-content img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  transition: transform 0.3s ease;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  will-change: transform;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 全屏样式 */
.image-preview-mask:fullscreen {
  background-color: rgba(0, 0, 0, 1);
}

.image-preview-mask:fullscreen .image-preview-content img {
  max-width: 100vw;
  max-height: 100vh;
}
</style> 