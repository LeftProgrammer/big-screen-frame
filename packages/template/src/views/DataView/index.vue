<template>
  <div class="page-dataView">
    <!-- <div class="title animate-title">数据看板</div> -->
    <div
      class="data-item constructionProgress animate-item"
      @click="goTo('/constructionProgress')"
    ></div>
    <div
      class="data-item videoSurveillance animate-item"
      @click="goTo('/videoSurveillance')"
    ></div>
    <div
      class="data-item shipPosition animate-item"
      @click="goTo('/shipPosition')"
    ></div>
    <div
      class="data-item meteorologicalData animate-item"
      @click="goTo('/meteorologicalData')"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
onMounted(async () => {});

const goTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped lang="scss">
.page-dataView {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 14%;
  position: relative;
  // 剧中展示 title
  .title {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 64px;
    color: #fff;
    font-family: "ZiTiQuanXinYiGuanHeiTi4";
    letter-spacing: 5px;
    font-weight: 600;
    opacity: 0;
    &.animate-title {
      animation: slideDown 0.8s ease forwards;
    }
  }
  .data-item {
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(100px);
    &.animate-item {
      animation: slideUp 0.8s ease forwards;
    }
    &.constructionProgress {
      animation-delay: 0.2s;
    }
    &.videoSurveillance {
      animation-delay: 0.4s;
    }
    &.shipPosition {
      animation-delay: 0.6s;
    }
    &.meteorologicalData {
      animation-delay: 0.8s;
    }
    &:hover {
      cursor: pointer;
      transform: scale(1.05) translateY(-10px) !important;
    }
  }
  div {
    width: 260px;
    height: 362px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .constructionProgress {
    background-image: url("@/assets/img/big-data/constructionProgress.png");
  }
  .videoSurveillance {
    background-image: url("@/assets/img/big-data/videoSurveillance.png");
  }
  .shipPosition {
    background-image: url("@/assets/img/big-data/shipPosition.png");
  }
  .meteorologicalData {
    background-image: url("@/assets/img/big-data/meteorologicalData.png");
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translate(-50%, -150%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
