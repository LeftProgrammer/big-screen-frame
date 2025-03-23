<script setup lang="ts">
import { reactive, watch, ref } from "vue";
import dayjs from "dayjs";
import type { DateDataType } from "./index.d";
// import { useSettingStore } from "@/stores/index";
import { useUserStore } from "@/utils/userStore";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const userStore = useUserStore();
const router = useRouter();
const logout = async () => {
  const res = await userStore.logout();
  if (res.code === 200) {
    // router.push("/login");
    ElMessage.success(res.message);
    // 刷新当前页面
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
};
const dateData = reactive<DateDataType>({
  dateDay: "",
  dateYear: "",
  dateWeek: "",
  timing: null as any,
  nowTime: "",
});
// const { setSettingShow } = useSettingStore();
const weekday = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];
const timeFn = () => {
  dateData.dateWeek = weekday[dayjs().day()];
  // 获取今天得日期
  dateData.dateDay = dayjs().format("YYYY-MM-DD");
  dateData.timing = setInterval(() => {
    dateData.nowTime = dayjs().format("HH : mm : ss");
  }, 1000);
};
timeFn();

const back = () => {
  // router.push('/analysis');
  router.go(-1);
};

let nowPath = ref("/analysis");

// 监听路由变化
watch(
  router.currentRoute,
  (to, from) => {
    console.log(to, from);
    nowPath.value = to.path;
  },
  { immediate: true }
);
</script>

<template>
  <div class="d-flex jc-center title_wrap animate-enter">
    <div class="timers">
      <span class="font-bold text-xl"> {{ dateData.nowTime }}</span>
      <span class="mx-3 text-gray-400">|</span>
      <span class="font text-sm text-gray-400">{{ dateData.dateWeek }}</span>
      <span class="mx-3 text-gray-400">|</span>
      <span class="text-3 text-sm text-gray-400">{{ dateData.dateDay }}</span>

      <!-- <div class="setting_icon" @click="setSettingShow(true)">
        <img src="@/assets/img/headers/setting.png" alt="设置" />
      </div> -->
    </div>
    <!-- <div class="d-flex jc-center">
      <div class="title">
        <span class="title-text">{{ screenTitle }}</span>
      </div>
    </div> -->
    <div class="right" v-if="nowPath.includes('/analysis')">
      <div class="dataView" @click="router.push('/dataView')"></div>
      <div class="video" @click="router.push('/specialVideo')"></div>
      <div class="loginout" @click="logout"></div>
    </div>
    <div class="right" v-else>
      <div class="back" @click="back"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title_wrap {
  width: 100%;
  height: 118px;
  background-image: url("@/assets/img/big-data/index_1.webp");
  background-size: cover;
  background-position: center center;
  position: relative;

  .timers {
    position: absolute;
    left: 24px;
    top: 30px;
    font-size: 18px;
    display: flex;
    align-items: center;

    .setting_icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin-left: 12px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .right {
    position: absolute;
    right: 24px;
    top: 30px;
    font-size: 18px;
    display: flex;
    align-items: center;
    .dataView {
      width: 88px;
      height: 32px;
      background-image: url("@/assets/img/big-data/dataView.png");
      background-size: cover;
      background-position: center center;
      cursor: pointer;
      margin-right: 24px;
      &:hover {
        transform: scale(1.05);
      }
    }
    .video {
      width: 88px;
      height: 32px;
      background-image: url("@/assets/img/big-data/video.png");
      background-size: cover;
      background-position: center center;
      cursor: pointer;
      margin-right: 24px;
      &:hover {
        transform: scale(1.05);
      }
    }
    .back {
      width: 88px;
      height: 32px;
      background-image: url("@/assets/img/big-data/back.png");
      background-size: cover;
      background-position: center center;
      cursor: pointer;
      &:hover {
        transform: scale(1.05);
      }
    }
    .loginout {
      width: 45px;
      height: 32px;
      background-image: url("@/assets/img/big-data/loginout.svg");
      background-size: cover;
      background-position: center center;
      cursor: pointer;
      &:hover {
        transform: scale(1.05);
      }
    }
  }

  // 添加动画相关样式
  opacity: 0;
  transform: translateY(-20px);
  animation: fadeInDown 0.8s ease forwards;
}

// 添加动画关键帧
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  position: relative;
  // width: 500px;
  text-align: center;
  background-size: cover;
  color: transparent;
  height: 60px;
  line-height: 46px;

  .title-text {
    font-size: 38px;
    font-weight: 900;
    letter-spacing: 6px;
    width: 100%;
    background: linear-gradient(
      92deg,
      #0072ff 0%,
      #00eaff 48.8525390625%,
      #01aaff 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
