<template>
  <div class="page-videoSurveillance">
    <div class="left">
      <el-tree
        :data="treeData"
        :defaultExpandAll="true"
        node-key="id"
        :props="{
          children: 'children',
          label: 'name',
          key: 'id',
        }"
        ref="treeRef"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <span
            class="custom-tree-node"
            :class="{
              'tree-default-icon': node.level !== 1,
              'show-tree-icon': node.isCurrent && node.level !== 1,
            }"
            :style="{ fontSize: computedFontSize(node) }"
            >{{ data.name }}</span
          >
        </template>
      </el-tree>
    </div>
    <div class="right">
      <div class="right-content" id="mse"></div>
      <div class="bottom-content">
        <span class="monitor-code">监控编号：{{ currentMonitor.serial }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Tree {
  label: string;
  children?: Tree[];
}

import { ref, reactive, onMounted, nextTick } from "vue";
import { list } from "./api";

const treeRef = ref(null);
const checkedkeys = ref([]);
const treeData: Tree[] = ref([
  {
    name: "摄像头列表",
    id: "0",
    children: [],
  },
]);

const currentMonitor = ref({
  serial: "****",
});

// 播放器
const playerConfig = ref({
  id: "mse",
  url: "",
  autoplay: true,
  muted: true,
  height: 0,
  width: 0,
  plugins: [window.HlsPlayer],
  videoFillMode: "fill",
});
const player = ref(null);

const playUrl = (serial: string) => {
  playerConfig.value.url = serial;
  player.value = new window.Player(playerConfig.value);
};

/**
 * @description 获取摄像头列表
 */
const getList = async () => {
  const res = await list();
  if (res.code === 200) {
    treeData.value[0].children = res.result || [];
    // 设置树节点默认选中第一个
    await nextTick(() => {
      if (res.result && res.result.length > 0) {
        const firstNodeId = res.result[0].id;
        treeRef.value.setCurrentKey(firstNodeId);
      }
    });
  }
};

const handleNodeClick = (data: Tree, node: any) => {
  console.log("handleNodeClick", data, node);
  currentMonitor.value = data;
  playUrl(data.serial);
};

const computedFontSize = (node: any) => {
  console.log(node);
  if (node.level == 1) {
    return "24px";
  } else {
    return "20px";
  }
};
onMounted(async () => {
  await getList();
  playerConfig.value.height = document.getElementById("mse").clientHeight;
  playerConfig.value.width = document.getElementById("mse").clientWidth;
  playUrl(treeData.value[0].children[0].serial);
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
    ::v-deep .el-tree {
      background-color: transparent;
      .el-tree-node__content {
        margin: 5px 0;
        height: 40px;
        --el-tree-node-hover-bg-color: transparent;
        // 禁用hover
        &:hover {
          background-color: transparent;
        }
        // el-tree-node is-expanded is-current is-focusable
        ::v-deep .is-focusable {
          background-color: transparent;
        }
        .el-tree-node__expand-icon {
          background-image: url("@/assets/img/big-data/jiantou.png");
          background-size: 35% 50%;
          background-repeat: no-repeat;
          background-position: center;
          svg {
            display: none;
          }
        }
        .custom-tree-node {
          color: #fff !important;
          font-family: "AlibabaPuHuiTi";
          letter-spacing: 3px;
        }
        .tree-default-icon::before {
          content: "";
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 15px;
        }

        .show-tree-icon::before {
          content: "";
          display: inline-block;
          width: 16px;
          height: 16px;
          background-image: url("@/assets/img/big-data/tree-select.png");
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100%;
          margin-right: 15px;
        }
      }
    }
  }
  .right {
    width: calc(100% - 339px - 35px);
    height: 100%;
    position: relative;
    background-image: url("@/assets/img/big-data/video-border.png"),
      url("@/assets/img/big-data/fan.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    .right-content {
      width: 100%;
      height: 100%;
    }
    .bottom-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 110%;
      height: 88px;
      background-color: rgba(0, 0, 0, 0.5);
      .monitor-code {
        color: #fff;
        font-size: 28px;
        font-family: "AlibabaPuHuiTi";
        letter-spacing: 3px;
        line-height: 88px;
        margin-left: 30px;
      }
    }
  }
}

::v-deep .el-tree-node.is-current {
  background-image: url("@/assets/img/big-data/tree-select-bg.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
// 禁用播放器控件
::v-deep .xgplayer-controls {
  display: none;
}
</style>
