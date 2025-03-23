<template>
  <div class="page-analysis">
    <div class="top-center">
      <div class="flex items-center justify-center space-x-8">
        <InfoCard
          class="animate-top"
          style="animation-delay: 0.3s"
          icon="top-center-1"
          title="计划工期"
          :value="projectInfo.plannedDuration || 0"
          unit="天"
        />
        <InfoCard
          class="animate-top"
          style="animation-delay: 0.6s"
          icon="top-center-2"
          title="已开工"
          :value="projectInfo.workedDays || 0"
          unit="天"
        />
        <InfoCard
          class="animate-top"
          style="animation-delay: 0.9s"
          icon="top-center-3"
          title="风机进度"
          :value="projectInfo.fjPercent || 0"
          unit="%"
        />
        <InfoCard
          class="animate-top"
          style="animation-delay: 1.2s"
          icon="top-center-4"
          title="海缆进度"
          :value="projectInfo.hlPercent || 0"
          unit="%"
        />
      </div>
    </div>
    <div class="left">
      <!-- 工程大事记 -->
      <Car1 class="car animate-left" style="animation-delay: 0.5s" />
      <!-- 近七日出海统计 -->
      <Car2 class="car animate-left" style="animation-delay: 1s" />
      <!-- 结算信息 -->
      <Car3 class="car animate-left" style="animation-delay: 1.5s" />
    </div>
    <div class="right">
      <!-- 气象情况 -->
      <Car4 class="car animate-right" style="animation-delay: 0.5s" />
      <!-- 气象预警 -->
      <Car5 class="car animate-right" style="animation-delay: 1s" />
      <!-- 气象预警 -->
      <Car6 class="car animate-right" style="animation-delay: 1.5s" />
    </div>
    <!-- 3DGIS -->
    <div class="center">
      <threeGis class="w-full h-full"></threeGis>
    </div>

    <!-- <div class="direction"></div> -->
  </div>
</template>

<script setup lang="ts">
import Car1 from "./Car1.vue";
import Car2 from "./Car2.vue";
import Car3 from "./Car3.vue";
import Car4 from "./Car4.vue";
import Car5 from "./Car5.vue";
import Car6 from "./Car6.vue";
import threeGis from "./threeGis.vue";
import InfoCard from "./InfoCard.vue";
import { ref, reactive, onMounted, nextTick } from "vue";
import { ProjectInfo } from "@/api/modules/index";
const projectInfo = ref({
  plannedDuration: "0",
  workedDays: "0",
  fjPercent: "0",
  hlPercent: "0",
});
onMounted(async () => {
  const res = await ProjectInfo();
  if (res.code == 200) {
    projectInfo.value = res.result.projectInfo;
  }
});
</script>

<style scoped lang="scss">
.page-analysis {
  width: 100%;
  height: 100%;
  position: relative;
  .direction {
    position: absolute;
    left: 25%;
    bottom: 15%;
    z-index: 10;
    width: 64px;
    height: 64px;
    background: #ced0d2 url("@/assets/img/big-data/direction.png");
    background-size: 90%;
    border-radius: 4px;
    background-repeat: no-repeat;
    background-position: center;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -1px;
    right: -1px;
    bottom: 0px;
    pointer-events: none;
    // box-shadow: inset 1px 50px 30px 80px rgba(0, 0, 0, .4);
    background: linear-gradient(
        90deg,
        #02051c 0%,
        rgba(7, 27, 54, 0.8) 10%,
        rgba(5, 32, 43, 0) 30%
      ),
      linear-gradient(
        270deg,
        #02051c 0%,
        rgba(7, 27, 54, 0.8) 10%,
        rgba(5, 32, 43, 0) 30%
      ),
      linear-gradient(
        360deg,
        #02051c 0%,
        rgba(7, 27, 54, 0.8) 10%,
        rgba(5, 32, 43, 0) 30%
      );
    z-index: 3;
  }

  .top-center {
    position: absolute;
    top: 118px;
    left: 0;
    right: 0;
    width: max-content;
    height: fit-content;
    margin: auto;
    z-index: 10;
  }

  .left {
    width: 400px;
    position: absolute;
    top: 118px;
    left: -1px;
    z-index: 10;
  }
  .right {
    width: 400px;
    position: absolute;
    top: 118px;
    right: -1px;
    z-index: 10;
  }
  .center {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    position: relative;
    z-index: 1;
  }
}
.car {
  margin-bottom: 20px;
  opacity: 0;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInTop {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-left {
  animation: slideInLeft 0.8s ease forwards;
}

.animate-right {
  animation: slideInRight 0.8s ease forwards;
}

.animate-top {
  opacity: 0;
  animation: slideInTop 0.8s ease forwards;
}

@keyframes moveLight {
  0% {
    top: 0;
    left: 0;
  }
  25% {
    top: 0;
    left: 100%;
    transform: translateX(-100%);
  }
  50% {
    top: 100%;
    left: 100%;
    transform: translate(-100%, -100%);
  }
  75% {
    top: 100%;
    left: 0;
    transform: translateY(-100%);
  }
  100% {
    top: 0;
    left: 0;
  }
}
</style>
