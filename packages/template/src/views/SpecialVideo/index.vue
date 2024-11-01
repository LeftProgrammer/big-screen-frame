<template>
  <div class="page-specialVideo">
    <div class="promotionalVideo">
      <div class="video" :class="{ 'no-video': !projectInfoListData.video }">
        <video
          v-if="projectInfoListData.video"
          class="video-content w-full h-full"
          :src="
            baseUrl + '/api/sys/common/static/qzhf/' + projectInfoListData.video
          "
          controls
        ></video>
      </div>
      <div class="title">
        <div class="icon"></div>
        <div class="line"></div>
      </div>
      <div class="description" v-html="projectInfoListData.remark"></div>
    </div>
    <div class="processVideo">
      <div
        class="video"
        :class="{ 'no-video': !projectInfoListData.processVideo }"
      >
        <video
          v-if="projectInfoListData.processVideo"
          class="video-content w-full h-full"
          :src="
            baseUrl +
            '/api/sys/common/static/qzhf/' +
            projectInfoListData.processVideo
          "
          controls
        ></video>
      </div>
      <div class="title">
        <div class="icon"></div>
        <div class="line"></div>
      </div>
      <div
        class="description"
        v-html="projectInfoListData.processVideoRemark"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import { projectInfoList } from "./api";
import UtilVar from "@/config/UtilVar";

const baseUrl = UtilVar.baseUrl;

const projectInfoListData = ref({
  remark: "",
  video: "",
  processVideo: "",
  processVideoRemark: "暂无字段",
});
onMounted(async () => {
  const res = await projectInfoList();
  console.log("res", res.result.records[0]);
  if (res.code === 200) {
    // 合并 projectInfoListData res.result.records[0];
    projectInfoListData.value = {
      ...projectInfoListData.value,
      ...res.result.records[0],
    };
  }
});
</script>

<style scoped lang="scss">
.no-video {
  background-color: #122547;
  position: relative;
}
.no-video::before {
  content: "暂无视频";
  color: #a6c9ff;
  font-size: 20px;
  font-family: "AlibabaPuHuiTi-2-65-Medium";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.page-specialVideo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  > div {
    width: 764px;
    height: 718px;
    background: linear-gradient(360deg, #122547 0%, rgba(18, 37, 71, 0) 100%);
    border-radius: 6px 6px 6px 6px;
    border: 1px solid;
    border-image: linear-gradient(
        180deg,
        rgba(62, 76, 236, 0.5),
        rgba(38, 79, 217, 0)
      )
      1 1;
    overflow: hidden;
    padding: 35px 22px 0px 22px;
  }
  .video {
    width: 100%;
    height: 400px;
  }

  ::v-deep .description > p > span {
    font-size: 20px !important;
    font-family: "AlibabaPuHuiTi-2-65-Medium" !important;
    color: #fff !important;
  }

  .title {
    margin-top: 10px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    margin-left: 20px;
    .icon {
      width: 158px;
      height: 42px;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      margin-right: 30px;
    }
    .line {
      flex: 1;
      height: 4px;
    }
  }
  .promotionalVideo {
    margin-right: 112px;
    .icon {
      background-image: url("@/assets/img/big-data/promotionalVideo.png");
    }
    .line {
      background: linear-gradient(
        90deg,
        #ff9419 0%,
        rgba(255, 148, 25, 0) 100%
      );
    }
  }
  .processVideo {
    .icon {
      background-image: url("@/assets/img/big-data/processVideo.png");
    }
    .line {
      background: linear-gradient(90deg, #1aff57 0%, rgba(26, 255, 87, 0) 100%);
    }
  }
}
</style>
