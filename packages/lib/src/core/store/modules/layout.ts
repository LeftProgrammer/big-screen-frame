import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useLayoutStore = defineStore('bsf-layout', () => {
  // 状态
  const scale = ref(1);
  const width = ref(1920);
  const height = ref(1080);
  const autoScale = ref(true);

  // 计算属性
  const aspectRatio = computed(() => width.value / height.value);

  // Actions
  function setScale(value: number) {
    scale.value = value;
  }

  function setSize(w: number, h: number) {
    width.value = w;
    height.value = h;
  }

  function toggleAutoScale() {
    autoScale.value = !autoScale.value;
  }

  return {
    // 状态
    scale,
    width,
    height,
    autoScale,
    // 计算属性
    aspectRatio,
    // 方法
    setScale,
    setSize,
    toggleAutoScale
  };
});
