import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ThemeType } from '../theme/types'

// 定义基础状态存储
export const useScreenStore = defineStore('screen', () => {
    // 基础状态
    const scale = ref(1)
    const width = ref(0)
    const height = ref(0)
    const theme = ref<ThemeType>('dark')

    return {
        scale,
        width,
        height,
        theme
    }
})
