<script setup lang="ts">
import ContentCar from "@/components/contentCar/index.vue";
import { ref, reactive, onMounted, nextTick } from "vue";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import { weatherAlarm } from "./api";

const alarmData = ref([
  // 1黄色 2橙色 3红色
  // {
  //   alarmType: "1",
  //   type: "黄色预警",
  //   content:
  //     "灵山县气象台黄色大雨预警，请灵山县气象台黄色大雨预警，请灵山县气象台黄色大雨预警，请灵山县气象台黄色大雨预警，请",
  //   date: "10:23:12",
  // },
]);
const scrollFlag = ref(true);

onMounted(() => {
  weatherAlarm().then((res: any) => {
    if (res.code == 200) {
      alarmData.value = res.result;
    }
  });
});
</script>
<template>
  <ContentCar class="contetn_left-top" title="气象预警">
    <template #content>
      <div
        class="scroll-wrap"
        :class="{ 'scroll-content-empty': alarmData.length === 0 }"
      >
        <div class="scroll-content">
          <vue3-seamless-scroll
            class="scroll-list"
            :list="alarmData"
            v-model="scrollFlag"
            :hover="true"
            :step="0.4"
            :wheel="true"
            :isWatch="true"
            :limitScrollNum="5"
          >
            <ul
              class="scroll-ul"
              v-for="(item, index) in alarmData"
              :key="index"
            >
              <li class="scroll-li">
                <div
                  class="alert-type"
                  :style="{
                    color:
                      item.alarmType === '1'
                        ? '#FFA72C'
                        : item.alarmType === '2'
                        ? '#FF5F25'
                        : '#FF1B13',
                  }"
                >
                  {{
                    item.alarmType === "1"
                      ? "黄色预警"
                      : item.alarmType === "2"
                      ? "橙色预警"
                      : "红色预警"
                  }}
                </div>
                <div class="alert-content">
                  <div class="text-ellipsis">{{ item.content }}</div>
                </div>
                <div class="alert-date">
                  {{ item.date }}
                </div>
              </li>
            </ul>
          </vue3-seamless-scroll>
        </div>
      </div>
    </template>
  </ContentCar>
</template>
<style scoped lang="scss">
.contetn_left-top {
  width: 400px;
  // border: 1px solid red;
  height: 320px;
  // overflow: hidden;
  .scroll-wrap {
    width: 100%;
    margin-top: 20px;
    height: calc(100% - 60px);
    overflow: hidden;
    .scroll-content {
      width: 100%;
      display: flex;
      .scroll-list {
        width: 100%;
        overflow: hidden;
        .scroll-ul:last-child .scroll-li {
          // border-bottom: 1px solid #dcdfe6;
        }
        .scroll-ul {
          width: 100%;
          display: flex;
          .scroll-li {
            width: 100%;
            display: flex;
            .alert-type {
              width: 70px;
              font-size: 14px;
              font-family: "ZiTiQuanXinYiGuanHeiTi4";
              font-weight: 700;
              letter-spacing: 1px;
            }
            .alert-content {
              flex: 1;
              .text-ellipsis {
                font-size: 16px;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                lines: 1;
                white-space: nowrap;
                word-break: break-all;
              }
            }
            .alert-date {
              width: 65px;
              font-size: 14px;
              color: #4e89ff;
              margin-left: 15px;
            }
            > div {
              display: flex;
              height: 40px;
              line-height: 40px;
              padding-left: 5px;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
  .scroll-content-empty {
    background-image: url("static/img/empty.png");
    background-size: 40% 40%;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
  }
  .scroll-content-empty::before {
    content: "暂无预警";
    color: #CFD7EB;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    position: absolute;
    top: 80%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
