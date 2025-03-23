<script setup lang="ts">
import ContentCar from "@/components/contentCar/index.vue";
import { ref, reactive, onMounted, nextTick, onUnmounted, watch } from "vue";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import { weatherAlarm } from "./api";

const alarmData = ref([]);
const scrollFlag = ref(true);

// 简化的滚动控制逻辑
const scrollTimers = ref<{[key: number]: NodeJS.Timer | null}>({});

const initScrollElements = () => {
  nextTick(() => {
    const elements = document.querySelectorAll('.scrooll-content');
    elements.forEach((el, index) => {
      const element = el as HTMLElement;
      const container = element.parentElement;
      
      if (!container) return;
      
      // 重置样式
      element.style.transform = 'translateX(0)';
      
      // 检查是否需要滚动
      if (element.scrollWidth > container.clientWidth) {
        startScroll(element, index);
      }
    });
  });
};

const startScroll = (element: HTMLElement, index: number) => {
  stopScroll(index);

  // 创建一个副本并添加到原文本后面
  const originalText = element.textContent || '';
  element.textContent = originalText + ' ' + originalText;

  const speed = 1; // 滚动速度
  const contentWidth = element.scrollWidth / 2; // 使用一半宽度作为重置点
  let position = 0;

  scrollTimers.value[index] = setInterval(() => {
    position += speed;
    
    // 当滚动到第一份文本末尾时，重置位置到开始
    if (position >= contentWidth) {
      position = 0;
    }
    
    element.style.transform = `translateX(${-position}px)`;
  }, 30);
};

const stopScroll = (index: number) => {
  if (scrollTimers.value[index]) {
    clearInterval(scrollTimers.value[index]!);
    scrollTimers.value[index] = null;
  }
};

// 监听数据变化
watch(() => alarmData.value, () => {
  nextTick(() => {
    initScrollElements();
  });
}, { deep: true });

onMounted(() => {
  weatherAlarm().then((res: any) => {
    if (res.code == 200) {
      alarmData.value = res.result;
    }
  });
});

onUnmounted(() => {
  Object.keys(scrollTimers.value).forEach(key => {
    stopScroll(Number(key));
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
                      item.warningLevel == '黄色'
                        ? '#FFA72C'
                        : item.warningLevel == '蓝色'
                        ? '#3254ff'
                        : item.warningLevel == '红色'
                        ? '#FF0000'
                        : '#FF5F25',
                  }"
                >
                  {{ item.warningLevel + "预警" }}
                </div>
                <div class="alert-content">
                  <div class="text-ellipsis">
                    <div class="scrooll-content">
                      {{ item.title }}
                    </div>
                  </div>
                </div>
                <div class="alert-date">
                  {{ item.releaseDate }}
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
              overflow: hidden;
              
              .text-ellipsis {
                width: 100%;
                overflow: hidden;
                position: relative;
              }
              
              .scrooll-content {
                display: inline-block;
                white-space: nowrap;
                position: relative;
                transition: none;
                cursor: pointer;
                padding-right: 20px;
                
                &:hover {
                  color: #4e89ff;
                }
              }
            }
            .alert-date {
              width: 92px;
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
    background-image: url("@/assets/img/big-data/empty.png");
    background-size: 40% 40%;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
  }
  .scroll-content-empty::before {
    content: "暂无预警";
    color: #cfd7eb;
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
