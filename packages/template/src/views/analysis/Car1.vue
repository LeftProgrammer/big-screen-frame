<script setup lang="ts">
import UtilVar from "@/config/UtilVar";
const baseUrl = UtilVar.baseUrl;

import ContentCar from "@/components/contentCar/index.vue";
import { ref, reactive, onMounted, nextTick } from "vue";
import { projectBigEvent } from "./api";

const content = ref("暂无大事记内容");
// 定义图片数组
const images = ref([]);

onMounted(() => {
  const params = {
    column: "happenTime",
    order: "desc",
    pageNo: 1,
    pageSize: 1,
  };
  projectBigEvent(params).then((res: any) => {
    if (res.code == 200) {
      content.value = res.result.records[0].content;
      // 图片
      if (res.result.records[0].file) {
        let file = JSON.parse(res.result.records[0].file);
        images.value = file;
      }
    }
  });
});
</script>
<template>
  <ContentCar class="contetn_left-top" title="工程大事记">
    <template #content>
      <div class="carousel">
        <el-carousel height="214px" indicator-type="dot">
          <el-carousel-item v-for="(image, index) in images" :key="index">
            <img class="w-full h-full" :src="`${baseUrl}${image.url}`" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="content-text" :title="content">{{ content }}</div>
    </template>
  </ContentCar>
</template>
<style scoped lang="scss">
.carousel {
  margin-bottom: 10px;
}
.content-text {
  font-size: 12px;
  height: 55px;
  overflow: hidden;
  font-family: "AlibabaPuHuiTi-2-65-Medium";
  // 多行超出部分显示省略号
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
}
.contetn_left-top {
  width: 400px;
  height: 320px;
}
// 指示器的样式

::v-deep .el-carousel__indicator--horizontal .el-carousel__button {
  width: 10px;
  height: 10px;
  background: transparent;
  border: 1px solid #ffffff;
  border-radius: 50%;
  opacity: 0.5;
}
::v-deep .el-carousel__indicator--horizontal.is-active .el-carousel__button {
  width: 10px;
  height: 10px;
  background: #0096ff;
  border-radius: 50%;
  opacity: 1;
}
::v-deep .el-carousel__arrow--left {
  display: none;
}
::v-deep .el-carousel__arrow--right {
  display: none;
}
</style>
