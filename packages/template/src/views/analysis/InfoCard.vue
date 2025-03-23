<template>
  <div class="gradient-background">
    <div
      :style="{
        backgroundImage: `url('static/img/${icon}.png')`,
      }"
      class="iconClass"
    ></div>
    <div>
      <div class="text-white font-bold text">
        {{ value }}<span class="text-blue-200 text-sm ml-1">{{ unit }}</span>
      </div>
      <div class="text-blue-200 text-sm">{{ title }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  icon: String,
  title: String,
  value: [String, Number],
  unit: String,
});
</script>
<style scoped>
.gradient-background {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("@/assets/img/big-data/bg-1.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 10px 20px;
}

.iconClass {
  width: 45px;
  height: 45px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 10px;
}
.text {
  font-size: 28px;
}
</style>
