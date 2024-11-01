<script setup lang="ts">
import { ref, watch } from "vue";
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
  // width: window.innerWidth,
  // height: window.innerHeight,
  width: window.screen.width,
  height: window.screen.height,
};

const router = useRouter();

const bg = ref("analysisBg");

// 监听路由
watch(router.currentRoute, (to) => {
  console.log("HomeView", to.path);
  if (to.path.includes("dataView")) {
    bg.value = "dataViewBg";
  } else {
    bg.value = "analysisBg";
    }
  },
  { immediate: true },
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
  >
    <div :class="['content_wrap', bg]">
      <Headers />
      <div class="content_wrap-content">
        <RouterView />
      </div>
      <MessageContent />
      <Footer></Footer>
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
  // padding: 16px 16px 16px 16px;
  box-sizing: border-box;
  // 背景50% 的透明度
  background-size: cover;
  background-position: center center;
  position: relative;
  .content_wrap-content {
    padding: 0 16px 0 16px;
    height: calc(100% - 170px);
  }
}
</style>
