<template>
  <div class="popover-content" v-if="fanData">
    <div class="title">{{ fanData.name }}{{ fanData.modelType }}</div>
    <div class="progress-info">
      <div class="info-item">
        <span class="label">当前进度:</span>
        <span class="value" :style="{ color: customColor(fanData.pbsComplete) }"
          >{{ fanData.pbsComplete || 0 }}%</span
        >
      </div>
      <div class="info-item">
        <span class="label">已耗时:</span>
        <span class="value" style="color: #ffc600">{{
          TimeChange(fanData.totalUseTime || 0)
        }}</span>
      </div>
      <div class="info-item">
        <span class="label">当前施工工序:</span>
        <span class="value">{{ fanData.nowProcess }}</span>
      </div>
      <div class="info-item">
        <span class="label">当前工序理论耗时:</span>
        <span class="value">{{ TimeChange(fanData.nowTheoryHours || 0) }}</span>
      </div>
      <div class="info-item">
        <span class="label">当前工序实际耗时:</span>
        <span class="value" style="color: #fa3730">{{
          TimeChange(fanData.nowActualHours || 0)
        }}</span>
      </div>
      <div class="info-item">
        <span class="label">下一工序:</span>
        <span class="value">{{ fanData.nextProcess || "-" }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  fanData: {
    type: Object as () => any,
    required: true,
    default: () => ({}),
  },
});

const customColor = (pbsComplete: number) => {
  return pbsComplete < 50
    ? "#FF941A"
    : pbsComplete < 80
    ? "#29FFED"
    : "#1AFF57";
};

const TimeChange = (time: number) => {
  if (!time) return "";
  // Convert hours to minutes (10.5 hours = 630 minutes)
  const totalMinutes = time * 60;
  const day = Math.floor(totalMinutes / 1440);
  const hour = Math.floor((totalMinutes % 1440) / 60);
  const minute = Math.round(totalMinutes % 60); // Round to nearest minute
  return `${day}天${hour}小时${minute}分钟`;
};
</script>

<style scoped lang="scss">
.popover-content {
  width: 437px !important;
  height: 336px !important;
  padding: 5px 20px 0px 20px;
  background-image: url("@/assets/img/big-data/details-bg.png") !important;
  background-position: center !important;
  background-size: 100% 100% !important;
  background-repeat: no-repeat !important;
  .title {
    color: #fff;
    font-size: 20px;
    font-family: "AlibabaPuHuiTi";
    margin-bottom: 18px;
    font-weight: 600;
    margin-left: 28px;
  }
  .progress-info {
    padding: 0 5px;
    .info-item {
      background-color: #0c2652;
      padding: 8px 15px;
      margin-bottom: 10px;
      color: #cfd7eb;
      font-size: 14px;
      font-family: "AlibabaPuHuiTi";
      .label {
        margin-right: 15px;
      }
    }
  }
}
</style>
