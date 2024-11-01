<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { projectInfo } from "./analysis/api";
const isShow = ref(true);
const route = useRoute();
watch(
  () => route.path,
  (newPath) => {
    if (newPath.includes("/analysis")) {
      isShow.value = true;
    } else {
      isShow.value = false;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  const res = await projectInfo();
  if (res.code == 200) {
    console.log("projectInfo", res.result);
  }
});
</script>

<template>
  <div class="content_bottom">
    <div class="content_bottom-content" v-if="isShow">
      <div class="stat-item">
        <div class="icon-wrapper icon-capacity"></div>
        <div class="stat-info">
          <div class="stat-label">装机容量</div>
          <div class="stat-value">399 <span class="unit">WM</span></div>
        </div>
      </div>
      <div class="stat-item mx-10">
        <div class="icon-wrapper icon-turbine"></div>
        <div class="stat-info">
          <div class="stat-label">风机数量</div>
          <div class="stat-value">38 <span class="unit">台</span></div>
        </div>
      </div>
      <div class="stat-item">
        <div class="icon-wrapper icon-cable"></div>
        <div class="stat-info">
          <div class="stat-label">海缆数量</div>
          <div class="stat-value">38 <span class="unit">段</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content_bottom {
  width: 100%;
  height: 50px;
  background-image: url("../assets/img/big-data/bottom.webp");
  background-size: cover;
  background-position: center center;
  position: absolute;
  bottom: 0;
  left: 0;
  .content_bottom-content {
    display: flex;
    justify-content: center;
    margin-top: -80px;

    .stat-item {
      display: flex;
      align-items: center;

      .icon-wrapper {
        width: 100px;
        height: 78px;
        margin-right: 10px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        position: relative;
      }
      .icon-capacity {
        background-image: url("@/assets/img/big-data/capacity.png");
      }

      .icon-turbine {
        background-image: url("@/assets/img/big-data/turbine.png");
      }

      .icon-cable {
        background-image: url("@/assets/img/big-data/cable.png");
      }

      .stat-info {
        display: flex;
        flex-direction: column;

        .stat-label {
          font-size: 14px;
          color: #cfd7eb;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #ffffff;
        }

        .unit {
          font-size: 16px;
          color: #b8d0ff;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
