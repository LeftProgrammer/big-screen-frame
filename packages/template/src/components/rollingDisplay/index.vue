<template>
  <div
    class="rolling-display"
    ref="containerRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mouseover="handleMouseOver"
    @mouseout="handleMouseOut"
    @wheel.passive="handleWheel"
  >
    <div class="rolling-content" ref="contentRef">
      <div class="rolling-list" :style="scrollStyle">
        <div
          v-for="(item, index) in displayData"
          :key="index"
          class="rolling-item"
          :style="itemStyle"
          @click="handleItemClick($event, item)"
        >
          <slot :item="item" :index="index" name="item">
            <template v-if="typeof item === 'string'">{{ item }}</template>
            <template v-else>
              <div class="item-content">
                <img
                  v-if="getItemImage(item)"
                  :src="getItemImage(item)"
                  :alt="getItemText(item)"
                  class="item-image"
                  @click.stop="handleImageClick(getItemImage(item) || '')"
                />
                <div
                  v-if="isHTML(getItemText(item))"
                  class="item-html"
                  v-html="getItemText(item)"
                ></div>
                <span v-else class="item-text">{{ getItemText(item) }}</span>
              </div>
            </template>
          </slot>
        </div>
      </div>
    </div>

    <ImagePreview
      v-model:visible="previewVisible"
      :image-url="previewImage"
      @update:visible="handlePreviewClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
import ImagePreview from "./ImagePreview.vue";

interface RollingItem {
  text?: string;
  image?: string;
  html?: string;
}

interface Props {
  data: (string | RollingItem)[];
  direction?: "vertical" | "horizontal";
  speed?: number;
  hoverPause?: boolean;
  clickable?: boolean;
  visibleItems?: number;
  width?: string | number;
  height?: string | number;
  singleScroll?: boolean;
  wheelable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  direction: "vertical",
  speed: 50,
  hoverPause: true,
  clickable: true,
  visibleItems: 3,
  width: "300px",
  // height: '65px',
  singleScroll: false,
  wheelable: true,
});

const emit = defineEmits<{
  (
    e: "change",
    payload: { currentIndex: number; currentItem: string | RollingItem }
  ): void;
  (e: "pause"): void;
  (e: "resume"): void;
  (e: "mouseenter", event: MouseEvent): void;
  (e: "mouseleave", event: MouseEvent): void;
  (e: "mouseover", event: MouseEvent): void;
  (e: "mouseout", event: MouseEvent): void;
  (
    e: "itemClick",
    payload: { item: string | RollingItem; index: number }
  ): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const scrollPosition = ref(0);
let animationFrame: number | null = null;

// 创建一个用于显示的数据副本
const displayData = ref([
  ...props.data,
  ...props.data,
  ...props.data,
  ...props.data,
  ...props.data,
]); // 复制两份用于无缝衔接

// 获取第一个最后一个元素用于无缝衔接
const firstItem = computed(() => props.data[0]);
const lastItem = computed(() => props.data[props.data.length - 1]);

// 计算容器样式
const containerStyle = computed(() => {
  const width =
    typeof props.width === "number" ? `${props.width}px` : props.width;
  const height =
    typeof props.height === "number" ? `${props.height}px` : props.height;

  return {
    width,
    height,
  };
});

// 修改滚动样式
const scrollStyle = computed(() => {
  const transform =
    props.direction === "vertical"
      ? `translateY(${-scrollPosition.value}px)`
      : `translateX(${-scrollPosition.value}px)`;

  return {
    transform,
    transition: "transform linear",
    display: "flex",
    flexDirection: props.direction === "vertical" ? "column" as const : "row" as const,
    width: props.direction === "horizontal" ? "max-content" : "100%",
    height: "100%",
  };
});

// 修改项目样式
const itemStyle = computed(() => {
  if (props.direction === "horizontal") {
    return {
      flex: "0 0 auto",
      padding: "0 16px",
      display: "flex",
      alignItems: "center",
    };
  }
  return {
    width: "100%",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
  };
});

// 获取单个项目的尺寸（动态计算）
const getItemSize = () => {
  if (!containerRef.value) return 0;
  const items = containerRef.value.querySelectorAll(".rolling-item");
  if (!items.length) return 0;

  const firstItem = items[0] as HTMLElement;
  const style = window.getComputedStyle(firstItem);

  if (props.direction === "horizontal") {
    // 获取项目的实际宽度（包括内边距和外边距）
    return (
      firstItem.offsetWidth +
      parseFloat(style.marginLeft) +
      parseFloat(style.marginRight) +
      parseFloat(style.paddingLeft) +
      parseFloat(style.paddingRight)
    );
  } else {
    // 获取项目的实际高度
    return (
      firstItem.offsetHeight +
      parseFloat(style.marginTop) +
      parseFloat(style.marginBottom)
    );
  }
};

const scrolling = ref(true);

// 修改判断是否需要滚动的逻辑
const shouldScroll = computed(() => {
  if (!containerRef.value) return false;

  // 如果只有一个项目且不允许单个滚动，则不滚动
  if (props.data.length === 1 && !props.singleScroll) return false;

  const container = containerRef.value;
  const list = container.querySelector(".rolling-list") as HTMLElement;
  if (!list) return false;

  // 如果设置了强制滚动，则始终返回 true
  if (props.singleScroll) return true;

  // 否则根据内容是否超出容器来决定是否滚动
  if (props.direction === "vertical") {
    const containerHeight = container.clientHeight - 24;
    return list.scrollHeight > containerHeight;
  } else {
    const containerWidth = container.clientWidth - 24;
    return list.scrollWidth > containerWidth;
  }
});

// 修改滚动动画
const animate = () => {
  if (!scrolling.value || !shouldScroll.value) {
    animationFrame = requestAnimationFrame(animate);
    return;
  }

  const itemSize = getItemSize();
  const singleSetSize = itemSize * props.data.length;

  scrollPosition.value += props.speed / 60;

  // 当滚动到一组数据的末尾时重置位置
  if (scrollPosition.value >= singleSetSize) {
    scrollPosition.value = 0;
  }

  const currentIndex =
    Math.floor(scrollPosition.value / itemSize) % props.data.length;
  emit("change", {
    currentIndex,
    currentItem: props.data[currentIndex],
  });

  animationFrame = requestAnimationFrame(animate);
};

// 开始滚动
const startScroll = () => {
  if (animationFrame) return;
  scrolling.value = true;
  animate();
};

// 停止滚动
const stopScroll = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  scrolling.value = false;
};

// 暂停滚动
const pause = () => {
  scrolling.value = false;
};

// 恢复滚动
const resume = () => {
  scrolling.value = true;
};

// 滚动到指引
const scrollTo = (index: number) => {
  if (index >= 0 && index < props.data.length) {
    scrollPosition.value = index * getItemSize();
  }
};

// 鼠标事件处理
const handleMouseEnter = (event: MouseEvent) => {
  isMouseEnter.value = true;
  emit("mouseenter", event);
  if (props.hoverPause) {
    scrolling.value = false;
    emit("pause");
  }
};

const handleMouseLeave = (event: MouseEvent) => {
  isMouseEnter.value = false;
  emit("mouseleave", event);
  if (props.hoverPause && !previewVisible.value) {
    // 只有在有预览时才恢复滚动
    scrolling.value = true;
    emit("resume");
  }
};

const handleMouseOver = (event: MouseEvent) => {
  emit("mouseover", event);
};

const handleMouseOut = (event: MouseEvent) => {
  emit("mouseout", event);
};

// 添加预览相关的状
const previewVisible = ref(false);
const previewImage = ref("");

// 图片点击处理
const handleImageClick = (imageUrl: string) => {
  previewImage.value = imageUrl;
  previewVisible.value = true;
  // 预览时暂停滚动
  scrolling.value = false;
  emit("pause");
};

// 添加预览关闭处理
const handlePreviewClose = (value: boolean) => {
  previewVisible.value = value;
  // 预览关闭时恢复滚动
  if (!value && !isMouseEnter.value) {
    scrolling.value = true;
    emit("resume");
  }
};

// 添加鼠标状态跟踪
const isMouseEnter = ref(false);

// 修改数据初始化
const initDisplayData = () => {
  if (shouldScroll.value) {
    const containerWidth = containerRef.value?.clientWidth || 0;
    const containerHeight = containerRef.value?.clientHeight || 0;
    const itemSize = getItemSize();

    if (itemSize <= 0) return;

    // 根据滚动方向计算需要填充的容器尺寸
    const containerSize =
      props.direction === "horizontal" ? containerWidth : containerHeight;

    // 计算一屏能显示多少个项目
    const itemsPerScreen = Math.ceil(containerSize / itemSize);

    // 为了保证流畅滚动，至少需要 2 屏的内容
    const minItems = itemsPerScreen * 2;

    // 计算需要多少组完整的数据
    const setsNeeded = Math.max(
      Math.ceil(minItems / props.data.length),
      2 // 至少需要2组完整数据
    );

    // 创建数据副本
    const copies = [];
    for (let i = 0; i < setsNeeded; i++) {
      copies.push(...props.data);
    }

    displayData.value = copies;

    // 从开始位置显示
    nextTick(() => {
      scrollPosition.value = 0;
    });
  } else {
    displayData.value = [...props.data];
  }
};

// 监听容器尺寸变化
onMounted(() => {
  const resizeObserver = new ResizeObserver(() => {
    // 容器尺寸变化时重新计算所需副本数量
    initDisplayData();
  });

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }

  // 初始化
  nextTick(() => {
    initDisplayData();
    startScroll();
  });

  onUnmounted(() => {
    resizeObserver.disconnect();
  });
});

// 监听原始数据变化
watch(
  () => props.data,
  () => {
    initDisplayData();
  },
  { deep: true }
);

onUnmounted(() => {
  stopScroll();
});

defineExpose({
  pause,
  resume,
  scrollTo,
  currentPosition: scrollPosition,
  isScrolling: scrolling,
  getCurrentIndex: () => {
    const itemSize = getItemSize();
    return Math.floor(scrollPosition.value / itemSize) % props.data.length;
  },
  getCurrentItem: () => {
    const itemSize = getItemSize();
    const currentIndex =
      Math.floor(scrollPosition.value / itemSize) % props.data.length;
    return props.data[currentIndex];
  },
});

// 移除原有的 handleClick
// 添加新的项目点击处理
const handleItemClick = (event: MouseEvent, item: string | RollingItem) => {
  if (!props.clickable) return;

  // 如果点击的是图片，不触发项目点击事件
  const target = event.target as HTMLElement;
  if (target.classList.contains("item-image")) return;

  const itemSize = getItemSize();
  const currentIndex =
    Math.floor(scrollPosition.value / itemSize) % props.data.length;

  emit("itemClick", {
    item,
    index: currentIndex,
  });
};

// 修改鼠标滚动处理
const handleWheel = (e: WheelEvent) => {
  if (!props.clickable || !props.wheelable) return;

  // 阻止默认滚动
  e.preventDefault();

  // 暂停自动滚动
  scrolling.value = false;
  emit("pause");

  // 根据滚动方向调整位置
  const delta = e.deltaY > 0 ? 1 : -1;
  const itemSize = getItemSize();
  scrollPosition.value += delta * (itemSize / 4);

  // 处理循环滚动
  const totalSize = props.data.length * itemSize;
  if (scrollPosition.value < 0) {
    scrollPosition.value = totalSize - itemSize / 4;
  } else if (scrollPosition.value >= totalSize) {
    scrollPosition.value = 0;
  }

  // 计算当前索引并触发事件
  const currentIndex =
    Math.floor(scrollPosition.value / itemSize) % props.data.length;
  emit("change", {
    currentIndex,
    currentItem: props.data[currentIndex],
  });

  // 修复 TypeScript 类型错误
  if (wheelTimer) {
    window.clearTimeout(wheelTimer);
  }

  wheelTimer = window.setTimeout(() => {
    if (!isMouseEnter.value && !previewVisible.value) {
      scrolling.value = true;
      emit("resume");
    }
  }, 1500);
};

// 修改定时器类型
let wheelTimer: number | undefined;

// 在组件卸载时清除定时器
onUnmounted(() => {
  if (wheelTimer) {
    clearTimeout(wheelTimer);
  }
  stopScroll();
});

// 修改获取字段值的工具函数
const getItemText = (item: string | RollingItem): string => {
  if (typeof item === "string") return item;
  if (item.html) return item.html; // 如果有 html 内容，优先返回
  return item.text || "";
};

// 添加获取图片的工具函数
const getItemImage = (item: string | RollingItem): string | undefined => {
  if (typeof item === "string") return undefined;
  return item.image;
};

// 判断内容是否为 HTML
const isHTML = (str: string): boolean => {
  return /<[a-z][\s\S]*>/i.test(str);
};
</script>

<style scoped>
.rolling-display {
  width: v-bind("containerStyle.width");
  height: v-bind("containerStyle.height");
  overflow: hidden;
  position: relative;
  cursor: v-bind('props.clickable ? "pointer" : "default"');
  background-color: #fff;
  border-radius: 4px;
  padding: 5px 12px;
  box-sizing: border-box;
}

.rolling-content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
}

.rolling-list {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  will-change: transform;
}

.rolling-item {
  box-sizing: border-box;
  border-radius: 4px;
  padding: 8px 8px;
  margin: 4px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
}
.rolling-item:hover {
  background-color: rgba(0, 0, 0, 0.2);
  border-color: #e6e6e6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}


.item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 100%;
}

.item-image {
  width: 24px;
  height: 24px;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 4px;
  cursor: zoom-in;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-text {
  flex: 1;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-html {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

.item-html :deep(*) {
  margin: 0;
  padding: 0;
  line-height: inherit;
  font-size: inherit;
}

/* 水平滚动时的特殊处理 */
.rolling-display[data-direction="horizontal"] {
  .rolling-content {
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 10%,
      black 90%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 10%,
      black 90%,
      transparent 100%
    );
  }

  .rolling-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
  }

  .rolling-item {
    flex: 0 0 auto;
    height: 100%;
    padding: 0 16px;
    margin: 0 4px;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  .item-content {
    display: flex;
    align-items: center;
    gap: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-html {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
  }

  .rolling-item {
    height: 100%;
    min-height: unset;
  }
}
</style>
