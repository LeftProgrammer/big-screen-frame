<template>
  <div class="page-dataView">
    <div class="title">数据看板</div>
    <div class="constructionProgress" @click="goTo('/constructionProgress')"></div>
    <div class="videoSurveillance" @click="goTo('/videoSurveillance')"></div>
    <div class="shipPosition" @click="goTo('/shipPosition')"></div>
    <div class="meteorologicalData" @click="goTo('/meteorologicalData')"></div>
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
</style>
