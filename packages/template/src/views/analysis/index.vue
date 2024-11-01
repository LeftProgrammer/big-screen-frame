<template>
  <div class="page-analysis">
    <div class="top-center">
      <div class="flex items-center justify-center space-x-8">
        <InfoCard
          icon="top-center-1"
          title="计划工期"
          :value="projectInfo.plannedDuration || 0"
          unit="个"
        />
        <InfoCard
          icon="top-center-2"
          title="已开工"
          :value="projectInfo.workedDays || 0"
          unit="天"
        />
        <InfoCard
          icon="top-center-3"
          title="风机进度"
          :value="projectInfo.fjPercent || 0"
          unit="%"
        />
        <InfoCard
          icon="top-center-4"
          title="海缆进度"
          :value="projectInfo.hlPercent || 0"
          unit="%"
        />
      </div>
    </div>
    <div class="left">
      <!-- 工程大事记 -->
      <Car1 class="car" />
      <!-- 近七日出海统计 -->
      <Car2 class="car" />
      <!-- 结算信息 -->
      <Car3 class="car" />
    </div>
    <div class="right">
      <!-- 气象情况 -->
      <Car4 class="car" />
      <!-- 气象预警 -->
      <Car5 class="car" />
      <!-- 气象预警 -->
      <Car6 class="car" />
    </div>
    <!--  -->
    <div class="center">
      <threeGis></threeGis>
    </div>
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
  .top-center {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: max-content;
    height: fit-content;
    margin: auto;
  }
  .left {
    width: 400px;
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient( to left, rgba(1,7,19,0.5) 0%, rgba(2,5,15,0.96) 80%);
    padding-right: 20px;
  }
  .right {
    width: 400px;
    position: absolute;
    top: 0;
    right: 0;
    background: linear-gradient( to right, rgba(1,7,19,0.5) 0%, rgba(2,5,15,0.96) 80%);
    padding-left: 20px;
  }
}
.car {
  margin-bottom: 20px;
}
</style>
