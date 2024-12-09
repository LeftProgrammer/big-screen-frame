import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScreenStore = defineStore('screen', () => {
  // 状态
  const scale = ref(1)
  const width = ref(0)
  const height = ref(0)
  const isFullscreen = ref(false)
  const theme = ref('dark')

  // 方法
  function updateScale(newScale: number) {
    scale.value = newScale
  }

  function updateSize(newWidth: number, newHeight: number) {
    width.value = newWidth
    height.value = newHeight
  }

  function updateFullscreen(value: boolean) {
    isFullscreen.value = value
  }

  function updateTheme(newTheme: string) {
    theme.value = newTheme
  }

  return {
    // 状态
    scale,
    width,
    height,
    isFullscreen,
    theme,
    // 方法
    updateScale,
    updateSize,
    updateFullscreen,
    updateTheme
  }
})
