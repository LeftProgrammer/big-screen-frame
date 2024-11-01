<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
const props = defineProps({
  title: {
    type: String,
    default: "car-title",
  },
});
</script>
<template>
  <div class="content-car">
    <div class="content-car-header ">
      <div class="content-car-header-title">
        <span class="content-car-header-title-text">{{ props.title }}</span>
      </div>
    </div>
    <slot name="content"></slot>
  </div>
</template>
<style scoped lang="scss">
.content-car {
  width: 100%;
  height: 100%;
  // border: 1px solid #fff;
  .content-car-header {
    width: 100%;
    height: 28px;
    background-image: url("../../assets/img/big-data/car-bg.webp");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    margin-bottom: 14px;
    .content-car-header-title{
      position: absolute;
      top: -10px;
      left: 28px;
      width: 100%;
      height: 100%;
      color: #fff;
      font-size: 20px;
      font-weight: 500;
      font-family: "ZiTiQuanXinYiGuanHeiTi4";
      letter-spacing: 2px;
    }
  }
}
</style>
