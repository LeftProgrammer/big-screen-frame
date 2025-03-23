<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { RouterView, useRouter } from "vue-router";
import ScaleScreen from "@/components/scale-screen";
import Headers from "./header.vue";
import Footer from "./footer.vue";
import Setting from "./setting.vue";
import { useSettingStore } from "@/stores/index";
import { storeToRefs } from "pinia";
import MessageContent from "@/components/Plugins/MessageContent";

const settingStore = useSettingStore();
const { isScale } = storeToRefs(settingStore);
const wrapperStyle = {};
const screen = {
  // width:  window.innerWidth,
  // height: window.innerHeight,
  width: window.screen.width,
  height: window.screen.height,
  // width: document.documentElement.clientWidth,
  // height: document.documentElement.clientHeight,
};
const router = useRouter();

const bg = ref("analysisBg");

const headersClass = ref("");
// 监听路由
watch(
  router.currentRoute,
  (to) => {
    console.log("HomeView", to.path);
    if (to.path.includes("dataView")) {
      bg.value = "dataViewBg";
    } else {
      bg.value = "analysisBg";
    }
    if (to.path.includes("analysis")) {
      headersClass.value = "analysisHeaders";
    } else {
      headersClass.value = "";
    }
  },
  { immediate: true }
);
</script>

<template>
  <scale-screen

    :width="screen.width"
    :height="screen.height"
    :delay="500"
    :fullScreen="false"
    :boxStyle="{
      background: '#03050C',
      overflow: isScale ? 'hidden' : 'auto',
    }"
    :wrapperStyle="wrapperStyle"
    :autoScale="isScale"
    class="home-view"
  >
    <div :class="['content_wrap', bg]">
      <Headers :class="headersClass" />
      <div
        class="content_wrap-content"
        :style="{
          height: headersClass ? '100%' : 'calc(100% - 170px)',
          overflow: 'hidden',
        }"
      >
        <RouterView />
      </div>
      <MessageContent />
      <Footer class="footer"></Footer>
    </div>
  </scale-screen>
  <Setting />
</template>
<style lang="scss" scoped>
.dataViewBg {
  background-image: url("@/assets/img/big-data/dataViewBg.png");
}
.analysisBg {
  background-image: url("@/assets/img/big-data/analysisBg.png");
}
.content_wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-size: cover;
  background-position: center center;
  position: relative;
  // padding: 6px;
  .analysisHeaders {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 118px;
    z-index: 10;
  }

  // 向右运动的线条
  &::before {
    content: "";
    position: absolute;
    width: 10px; // 线条长度
    height: 3px; // 线条宽度
    top: 0;
    left: 50%;
    background: rgba(64, 158, 255, 0.95);
    box-shadow: 0 0 4px 2px rgba(64, 158, 255, 0.8),
      0 0 8px 4px rgba(64, 158, 255, 0.6), 0 0 12px 6px rgba(64, 158, 255, 0.4);
    animation: moveLightRight 30s linear infinite,
      blink 1.5s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 30;
    transform: translateX(-50%);
    filter: blur(0.5px);
  }

  // 向左运动的线条
  &::after {
    content: "";
    position: absolute;
    width: 10px; // 线条长度
    height: 3px; // 线条宽度
    top: 0;
    left: 50%;
    background: rgba(64, 158, 255, 0.95);
    box-shadow: 0 0 4px 2px rgba(64, 158, 255, 0.8),
      0 0 8px 4px rgba(64, 158, 255, 0.6), 0 0 12px 6px rgba(64, 158, 255, 0.4);
    animation: moveLightLeft 30s linear infinite,
      blink 1.5s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 30;
    transform: translateX(-50%);
    filter: blur(0.5px);
  }

  .content_wrap-content {
    padding: 0 16px 0 16px;
    height: 100%;
  }
}

// 向右运动的动画
@keyframes moveLightRight {
  0% {
    top: 0;
    left: 50%;
    transform: translateX(-50%) rotate(0deg);
  }
  24% {
    top: 0;
    left: calc(100% - 6px);
    transform: translateX(-100%) rotate(0deg);
  }
  25% {
    top: 0;
    left: calc(100% - 6px);
    transform: translateX(-100%) rotate(90deg);
  }
  49% {
    top: calc(100% - 6px);
    left: calc(100% - 6px);
    transform: translate(-100%, -100%) rotate(90deg);
  }
  50% {
    top: calc(100% - 6px);
    left: calc(100% - 6px);
    transform: translate(-100%, -100%) rotate(180deg);
  }
  74% {
    top: calc(100% - 6px);
    left: 6px;
    transform: translateY(-100%) rotate(180deg);
  }
  75% {
    top: calc(100% - 6px);
    left: 6px;
    transform: translateY(-100%) rotate(270deg);
  }
  89% {
    top: 0;
    left: 6px;
    transform: rotate(270deg);
  }
  90% {
    top: 0;
    left: 6px;
    transform: rotate(360deg);
  }
  100% {
    top: 0;
    left: 50%;
    transform: translateX(-50%) rotate(360deg);
  }
}

// 向左运动的动画
@keyframes moveLightLeft {
  0% {
    top: 0;
    left: 50%;
    transform: translateX(-50%) rotate(0deg);
  }
  24% {
    top: 0;
    left: 6px;
    transform: rotate(0deg);
  }
  25% {
    top: 0;
    left: 6px;
    transform: rotate(90deg);
  }
  49% {
    top: calc(100% - 6px);
    left: 6px;
    transform: translateY(-100%) rotate(90deg);
  }
  50% {
    top: calc(100% - 6px);
    left: 6px;
    transform: translateY(-100%) rotate(180deg);
  }
  74% {
    top: calc(100% - 6px);
    left: calc(100% - 6px);
    transform: translate(-100%, -100%) rotate(180deg);
  }
  75% {
    top: calc(100% - 6px);
    left: calc(100% - 6px);
    transform: translate(-100%, -100%) rotate(270deg);
  }
  89% {
    top: 0;
    left: calc(100% - 6px);
    transform: translateX(-100%) rotate(270deg);
  }
  90% {
    top: 0;
    left: calc(100% - 6px);
    transform: translateX(-100%) rotate(360deg);
  }
  100% {
    top: 0;
    left: 50%;
    transform: translateX(-50%) rotate(360deg);
  }
}

// 添加闪烁动画
@keyframes blink {
  0% {
    opacity: 1;
    box-shadow: 0 0 4px 2px rgba(64, 158, 255, 0.8),
      0 0 8px 4px rgba(64, 158, 255, 0.6), 0 0 12px 6px rgba(64, 158, 255, 0.4);
  }
  100% {
    opacity: 0.4;
    box-shadow: 0 0 2px 1px rgba(64, 158, 255, 0.4),
      0 0 4px 2px rgba(64, 158, 255, 0.3), 0 0 6px 3px rgba(64, 158, 255, 0.2);
  }
}
</style>
