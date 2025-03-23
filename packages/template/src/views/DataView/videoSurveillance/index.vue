<template>
  <div class="page-videoSurveillance">
    <div class="left">
      <div class="tree-title">摄像头列表</div>
      <div
        class="tree-content"
        :class="{ 'tree-content-not-empty': videoList.length == 0 }"
      >
        <div
          class="tree-item"
          :class="{ 'active-video': currentIndex === index }"
          @click="handleNodeClick(item, index)"
          v-for="(item, index) in videoList"
          :key="index"
        >
          <div class="tree-item-title">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <!-- not-empty -->
    <div class="right" :class="{ 'not-empty': videoList.length == 0 }">
      <div class="video-grid" ref="videoGridRef">
        <div class="pointer"></div>
        <div
          class="video-item"
          :class="{ active: currentIndex === index }"
          v-for="(item, index) in videoList"
          :key="index"
          @click="handleVideoClick(item, index)"
        >
          <!-- <div class="corner-lt"></div>
          <div class="corner-rt"></div>
          <div class="corner-lb"></div>
          <div class="corner-rb"></div> -->
          <div
            class="video-content"
            :id="'mse-' + index"
            @click="handleVideoClick(item, index)"
          ></div>
          <div class="monitor-code">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Tree {
  label: string;
  children?: Tree[];
}

import { ref, onMounted, nextTick, onUnmounted } from "vue";
import { list } from "./api";

// 存储所有播放器实例
const players = ref<any[]>([]);
const currentIndex = ref(0);
const videoList = ref([]);

// 添加 ref 用于获取视频网格容器
const videoGridRef = ref(null);

const initPlayer = () => {
  // 清理之前的播放器实例
  players.value.forEach((player) => {
    if (player) {
      player.destroy();
    }
  });
  players.value = [];

  // 获取所有的dom元素
  const videoItems = document.querySelectorAll(".video-content");
  // 开始初始化所有的播放器
  videoList.value.forEach((item, index) => {
    const player = new window.Player({
      id: videoItems[index].id,
      url: item.serial,
      autoplay: false, // 默认不自动播放
      muted: false,
      height: 0,
      width: 0,
      plugins: [window.HlsPlayer],
      videoFillMode: "fill",
      playsinline: true,
    });
    player.on("play", function () {
      console.log("Video started playing", index);
      // 暂停其他播放器
      players.value.forEach((p, idx) => {
        if (idx !== index) {
          p.pause();
        }
      });
    });
    players.value.push(player);
  });
};

/**
 * @description 获取摄像头列表
 */
const getList = async () => {
  const res = await list();
  console.log(res);
  if (res.code === 200) {
    videoList.value = res.result || [];
    // 开始初始化所有的播放器
    nextTick(() => {
      initPlayer();
      handleNodeClick(videoList.value[0], 0);
      // 更新 pointer 尺寸
      updatePointerSize();
    });
  }
};

const scrollToElement = (
  container: Element,
  element: Element,
  padding = 20
) => {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  // 计算相对位置，考虑 padding
  const relativeTop = elementRect.top - containerRect.top;
  const relativeBottom = elementRect.bottom - containerRect.top;

  // 容器可视区域的高度（减去padding）
  const viewportHeight = containerRect.height - padding * 2;

  // 如果元素不在可视区域内
  if (
    relativeTop < padding ||
    relativeBottom > containerRect.height - padding
  ) {
    // 计算目标滚动位置，使元素在容器中居中
    const targetScroll =
      container.scrollTop +
      relativeTop -
      viewportHeight / 2 +
      elementRect.height / 2;

    // 使用平滑滚动
    container.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: "smooth",
    });
  }
};

const handleNodeClick = (item: any, index: number) => {
  console.log(item, index);
  currentIndex.value = index;

  // 滚动右侧视频到对应位置
  nextTick(() => {
    const videoItems = videoGridRef.value.querySelectorAll(".video-item");
    if (videoItems[index]) {
      scrollToElement(videoGridRef.value, videoItems[index]);
      // 让pointer移动到对应位置
      // 获取当前pointer的坐标
      const pointer = document.querySelector(".pointer");
      // 更新的poiner坐标
      const item = videoItems[index];
      pointer.style.setProperty("--sw", `${item.offsetWidth}px`);
      pointer.style.setProperty("--sh", `${item.offsetHeight}px`);
      pointer.style.setProperty("--x", `${item.offsetLeft}px`);
      pointer.style.setProperty("--y", `${item.offsetTop}px`);
    }
    // 播放对应视频
    players.value[index].play();
  });
  
};

const handleVideoClick = (item: any, index: number) => {
  console.log(item, index);
  currentIndex.value = index;

  // 滚动左侧树到对应位置
  nextTick(() => {
    const treeContent = document.querySelector(".tree-content");
    const treeItems = treeContent.querySelectorAll(".tree-item");
    if (treeItems[index]) {
      scrollToElement(treeContent, treeItems[index]);
    }
  });
};

// 更新 pointer 尺寸的函数
const updatePointerSize = () => {
  nextTick(() => {
    const videoItem = document.querySelector(".video-item");
    if (videoItem) {
      const rect = videoItem.getBoundingClientRect();
      const root = document.querySelector(":root") as HTMLElement;
      console.log(rect);
      if (root) {
        root.style.setProperty("--sw", `${rect.width}px`);
        root.style.setProperty("--sh", `${rect.height}px`);
      }
    }
    const pointer = document.querySelector(".pointer");
    // 获取所有的video-item 监听鼠标移入事件
    const videoItems = document.querySelectorAll(".video-item");
    videoItems.forEach((item) => {
      item.addEventListener("mouseenter", (e) => {
        console.log(
          item.offsetWidth,
          item.offsetHeight,
          item.offsetLeft,
          item.offsetTop
        );
        // 更新的poiner坐标
        pointer.style.setProperty("--sw", `${item.offsetWidth}px`);
        pointer.style.setProperty("--sh", `${item.offsetHeight}px`);
        pointer.style.setProperty("--x", `${item.offsetLeft}px`);
        pointer.style.setProperty("--y", `${item.offsetTop}px`);
      });
    });
  });
};

onMounted(async () => {
  await getList();
  window.addEventListener("resize", updatePointerSize);
});

// 移除事件监听
onUnmounted(() => {
  window.removeEventListener("resize", updatePointerSize);
  players.value.forEach((player) => {
    if (player) {
      player.destroy();
    }
  });
});
</script>

<style scoped lang="scss">
.page-videoSurveillance {
  display: flex;
  height: 100%;
  width: 100%;
  .left {
    width: 339px;
    height: 100%;
    margin-right: 35px;
    padding: 30px 20px;
    background-image: url("@/assets/img/big-data/video-left.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    .tree-title {
      font-size: 22px;
      font-family: "AlibabaPuHuiTi";
      letter-spacing: 3px;
      line-height: 40px;
      margin-bottom: 10px;
      margin-left: 20px;
    }
    .tree-content {
      padding: 0 20px;
      margin-left: 0px;
      height: calc(100% - 50px);
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      .tree-item {
        cursor: pointer;
        padding: 5px;
        border-radius: 10px;
        position: relative;
        margin-bottom: 5px;

        .tree-item-title {
          font-size: 20px;
          font-family: "AlibabaPuHuiTi";
          letter-spacing: 3px;
          padding-left: 30px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &:hover {
          &::before {
            content: "";
            position: absolute;
            left: 0px;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            background-image: url("@/assets/img/big-data/tree-select.png");
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
          }
        }
      }

      .active-video {
        background-image: url("@/assets/img/big-data/tree-select-bg.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;

        &::before {
          content: "";
          position: absolute;
          left: 0px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          background-image: url("@/assets/img/big-data/tree-select.png");
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
        }
      }
    }

    .tree-content-not-empty {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      &:empty::after {
        content: "暂无数据";
        color: #fff;
        font-size: 16px;
        opacity: 0.6;
      }
    }
  }
  .not-empty {
    background-image: url("@/assets/img/big-data/video-border.png"),
      url("@/assets/img/big-data/fan.png");
  }
  .right {
    width: calc(100% - 339px - 35px);
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    padding: 20px;
    overflow: hidden;

    .video-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: min-content;
      gap: 20px;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      align-content: flex-start;
      align-items: start;
      position: relative;
      padding: 20px;
      .pointer {
        position: absolute;
        --l: 30px;
        --t: 3px;
        --g: 15px;
        --sw: 475px;
        --sh: 312px;
        --x: 0px;
        --y: 0px;
        width: calc(var(--sw) + 2 * var(--g));
        height: calc(var(--sh) + 2 * var(--g));
        border: var(--t) solid #00ffff;
        left: calc(var(--x) - var(--g));
        top: calc(var(--y) - var(--g));
        transition: 0.4s;
        mask: conic-gradient(at var(--l) var(--l), transparent 75%, blue 75%) 0
          0 / calc(100% - var(--l)) calc(100% - var(--l)) repeat;
      }
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      .video-item {
        width: 100%;
        min-width: 0;
        height: fit-content;
        position: relative;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        padding-bottom: 44px;
        cursor: pointer;

        // 四角边框效果 - 同时处理悬停和选中状态
        &:hover,
        &.active {
          .corner-lt,
          .corner-rt,
          .corner-lb,
          .corner-rb {
            opacity: 1;
            border-color: #00ffff;
            filter: drop-shadow(0 0 2px #00ffff);
          }

          // 视频容器添加边框效果
          .video-content {
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
          }

          // 标题背景效果
          .monitor-code {
            background-color: rgba(0, 255, 255, 0.2);
          }
        }

        .corner-lt,
        .corner-rt,
        .corner-lb,
        .corner-rb {
          content: "";
          position: absolute;
          width: 30px;
          height: 30px;
          border-color: #00ffff;
          border-style: solid;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          z-index: 1;
        }

        // 左上角
        .corner-lt {
          top: -3px;
          left: -3px;
          border-width: 3px 0 0 3px;
        }

        // 右上角
        .corner-rt {
          top: -3px;
          right: -3px;
          border-width: 3px 3px 0 0;
        }

        // 左下角
        .corner-lb {
          bottom: -3px;
          left: -3px;
          border-width: 0 0 3px 3px;
        }

        // 右下角
        .corner-rb {
          bottom: -3px;
          right: -3px;
          border-width: 0 3px 3px 0;
        }

        .video-content {
          width: 100%;
          aspect-ratio: 16/9;
          min-height: 0;
          max-width: 100%;
        }

        .monitor-code {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 44px;
          color: #fff;
          font-size: 24px;
          font-family: "AlibabaPuHuiTi";
          letter-spacing: 3px;
          text-align: center;
          line-height: 44px;
          background-color: rgba(0, 0, 0, 0.5);
        }

        // 添加点击效果
        &:active {
          transform: scale(0.98);
          transition: transform 0.1s;
        }
      }
    }
  }
}
// 禁用播放器控件
::v-deep .xgplayer-controls {
  display: none;
}
</style>
