import { ref, onMounted, onUnmounted } from 'vue';

export interface ScaleScreenOptions {
  width?: number;
  height?: number;
  fullScreen?: boolean;
  delay?: number;
  immediate?: boolean;
  target?: HTMLElement | null;
}

export function useScaleScreen(options: ScaleScreenOptions = {}) {
  const {
    width = 1920,
    height = 1080,
    fullScreen = false,
    delay = 100,
    immediate = true,
    target = null,
  } = options;

  const scale = ref(1);
  const scaleX = ref(1);
  const scaleY = ref(1);
  const transformOrigin = ref('left top');

  let timer: number | null = null;
  
  const getTarget = () => {
    return target || document.documentElement;
  };

  const calculate = () => {
    const el = getTarget();
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;

    if (fullScreen) {
      scaleX.value = clientWidth / width;
      scaleY.value = clientHeight / height;
      scale.value = Math.min(scaleX.value, scaleY.value);
    } else {
      scale.value = Math.min(clientWidth / width, clientHeight / height);
      scaleX.value = scale.value;
      scaleY.value = scale.value;
    }
  };

  const resize = () => {
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      calculate();
    }, delay);
  };

  onMounted(() => {
    if (immediate) {
      calculate();
    }
    window.addEventListener('resize', resize);
  });

  onUnmounted(() => {
    if (timer) {
      window.clearTimeout(timer);
    }
    window.removeEventListener('resize', resize);
  });

  return {
    scale,
    scaleX,
    scaleY,
    transformOrigin,
    update: calculate,
  };
}
