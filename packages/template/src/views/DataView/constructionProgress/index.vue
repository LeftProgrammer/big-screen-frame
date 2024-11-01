<template>
  <div class="page-constructionProgress">
    <div class="select-btn">
      <div
        v-for="(item, index) in buttons"
        :key="index"
        class="btn"
        :class="{
          'select-active': activeBtn == item.type,
          select: activeBtn != item.type,
        }"
        @click="changeBtn(item.type)"
      >
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="content">
      <el-carousel
        ref="carouselRef"
        indicator-position="outside"
        :autoplay="false"
        :loop="false"
      >
        <el-carousel-item v-for="(item, index) in dataList" :key="index">
          <div class="custom-carousel h-full w-full">
            <div
              v-for="(initem, i) in item"
              :key="i"
              class="custom-carousel-item"
            >
              <ContentCar :title="initem[0]" />
              <div class="progress scrollbar">
                <el-popover
                  :teleported="false"
                  v-for="(fan, k) in initem[1]"
                  :key="k"
                  ref="popover"
                  placement="right"
                  :width="200"
                  trigger="click"
                >
                  <template #reference>
                    <div class="progress-item" @click="clickProgress(fan)">
                      <div class="up">
                        <div class="icon"></div>
                        <div class="title">{{ fan.name }}风机</div>
                        <div class="right-icon"></div>
                      </div>
                      <div class="down">
                        <el-progress
                          :percentage="fan.percentage"
                          :color="customColor(fan.percentage)"
                        />
                      </div>
                    </div>
                  </template>
                  <template #default>
                    <div class="popover-content">
                      <div class="title">{{ fan.name }}风机</div>
                      <div class="progress-info">
                        <div class="info-item">
                          <span class="label">当前进度:</span>
                          <span
                            class="value"
                            :style="{ color: customColor(fan.percentage) }"
                            >{{ fan.percentage }}%</span
                          >
                        </div>
                        <div class="info-item">
                          <span class="label">已耗时:</span>
                          <span class="value" style="color: #ffc600">{{
                            TimeChange(scheduleInfo.totalUseTime)
                          }}</span>
                        </div>
                        <div class="info-item">
                          <span class="label">当前施工工序:</span>
                          <span class="value">{{
                            scheduleInfo.nowProcess
                          }}</span>
                        </div>
                        <div class="info-item">
                          <span class="label">当前工序理论耗时:</span>
                          <span class="value">{{
                            TimeChange(scheduleInfo.nowTheoryHours)
                          }}</span>
                        </div>
                        <div class="info-item">
                          <span class="label">当前工序实际耗时:</span>
                          <span class="value" style="color: #fa3730">{{
                            TimeChange(scheduleInfo.nowActualHours)
                          }}</span>
                        </div>
                        <div class="info-item">
                          <span class="label">下一工序:</span>
                          <span class="value">{{
                            scheduleInfo.nextProcess
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
            <div v-for="n in 3" :key="n" style="width: 0"></div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="change-btn">
      <div class="prev" @click="prev"></div>
      <div class="next" @click="next"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ContentCar from "@/components/contentCar/index.vue";
import { constructionList, schedule } from "./api";

interface ScheduleInfoType {
  nextProcess: string;
  nowActualHours: number;
  nowProcess: string;
  nowTheoryHours: number;
  totalUseTime: number;
}

const activeBtn = ref("B06A01A01");
const buttons = ref([
  {
    name: "风机进度",
    type: "B06A01A01",
  },
  {
    name: "海缆进度",
    type: "B06A01A02",
  },
]);
const dataList = ref([]);
const scheduleInfo = ref<ScheduleInfoType>({});

const customColor = (percentage: number) => {
  return percentage < 50 ? "#FF941A" : percentage < 80 ? "#29FFED" : "#1AFF57";
};

const carouselRef = ref();

const TimeChange = (time: number) => {
  if (!time) return "";
  const day = Math.floor(time / 1440);
  const hour = Math.floor((time % 1440) / 60);
  const minute = Math.round(time % 60); //四舍五入
  return `${day}天${hour}小时${minute}分钟`;
};
const changeBtn = async (type: string) => {
  activeBtn.value = type;
  await requestData(type);
};
// 请求数据
const requestData = async (type: string) => {
  const { code, result } = await constructionList({ type });
  if (code === 200) {
    const list = Object.entries(result);
    dataList.value = Array.from(
      { length: Math.ceil(list.length / 4) },
      (_, i) => list.slice(i * 4, i * 4 + 4)
    );
  }
};

const clickProgress = async (item: any) => {
  console.log("当前pbs 信息", item);
  // /bigScreen/schedule
  const { code, result } = await schedule({ id: item.id });
  if (code === 200) {
    console.log("施工进度", result);
    scheduleInfo.value = result;
  }
};

onMounted(async () => {
  changeBtn(activeBtn.value);
});

const prev = () => carouselRef.value.prev();
const next = () => carouselRef.value.next();
</script>

<style scoped lang="scss">
.page-constructionProgress {
  width: 100%;
  height: 100%;
  .select-btn {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    .select-active {
      background-image: url("@/assets/img/big-data/select-active.png");
    }
    .select {
      background-image: url("@/assets/img/big-data/select.png");
    }
    .btn {
      width: 179px;
      height: 51px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      cursor: pointer;
      line-height: 51px;
      text-align: center;
      color: #fff;
      font-size: 22px;
      font-weight: 500;
      font-family: "AlibabaPuHuiTi";
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 130px);
    margin-bottom: 20px;
    ::v-deep .el-carousel {
      height: 100%;
      .el-carousel__arrow {
        display: none;
      }
      .el-carousel__container {
        height: 100%;
      }
    }
    .custom-carousel {
      display: flex;
      gap: 40px;
      > .custom-carousel-item {
        width: 25%;
        height: 100%;
        padding: 25px 15px 15px 15px;
        background: linear-gradient(
          360deg,
          rgba(12, 33, 69, 0.6) 0%,
          rgba(12, 33, 69, 0.6) 100%
        );
        border-radius: 6px 6px 6px 6px;
        border-image: linear-gradient(
            180deg,
            rgba(62, 76, 236, 0.5),
            rgba(38, 79, 217, 0)
          )
          1 1;
        ::v-deep .content-car {
          height: 50px;
        }
        .progress {
          width: 100%;
          height: calc(100% - 50px);
          overflow: hidden;
          .progress-item {
            margin-bottom: 58px;
            .up {
              display: flex;
              align-items: center;
              .icon {
                width: 22px;
                height: 22px;
                background: url("@/assets/img/big-data/fan-icon.png");
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
              }
              .title {
                color: #ccd6ff;
                font-family: "AlibabaPuHuiTi";
                font-size: 20px;
                margin: 0 8px;
                letter-spacing: 2px;
              }
              .right-icon {
                width: 22px;
                height: 22px;
                background: url("@/assets/img/big-data/fan-right.png");
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
              }
            }
            .down {
              ::v-deep .el-progress__text {
                color: #fff;
              }
              ::v-deep .el-progress-bar__outer {
                background-color: #0c2652;
              }
            }
          }
          ::v-deep .el-popover.el-popper {
            width: auto !important;
            padding: 0;
            .popover-content {
              width: 437px;
              height: 336px;
              padding: 5px 20px 0px 20px;
              background-image: url("@/assets/img/big-data/details-bg.png");
              background-position: center;
              background-size: cover;
              background-repeat: no-repeat;
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
          }
          ::v-deep .el-popper.is-light {
            background-color: #0c2652;
            border: none;
          }

          ::v-deep .el-popper__arrow::before {
            display: none;
          }
        }
      }
    }
  }
  .change-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 80px;
    cursor: pointer;
    > div {
      width: 48px;
      height: 48px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
    }
    .prev {
      background-image: url("@/assets/img/big-data/prev.png");
    }
    .next {
      background-image: url("@/assets/img/big-data/next.png");
    }
  }
}
</style>
