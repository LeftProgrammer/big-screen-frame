<template>
  <svg
    id="svgfilters"
    aria-hidden="true"
    style="position: absolute; width: 0; height: 0; overflow: hidden"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <defs>
      <filter
        id="dark-green-sepia"
        x="-10%"
        y="-10%"
        width="120%"
        height="120%"
        filterUnits="objectBoundingBox"
        primitiveUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feColorMatrix
          type="matrix"
          values=".33 .33 .33 0 0
					.33 .33 .33 0 0
					.33 .33 .33 0 0
					0 0 0 1 0"
          in="SourceGraphic"
          result="colormatrix"
        />
        <feComponentTransfer in="colormatrix" result="componentTransfer">
          <feFuncR type="table" tableValues="0.25 0.39 0.96" />
          <feFuncG type="table" tableValues="0.16 0.52 0.97" />
          <feFuncB type="table" tableValues="0.06 0.39 0.78" />
          <feFuncA type="table" tableValues="0 1" />
        </feComponentTransfer>
        <feBlend
          mode="normal"
          in="componentTransfer"
          in2="SourceGraphic"
          result="blend"
        />
      </filter>
    </defs>
  </svg>

  <div class="page-shipPosition" id="MapContainer">
    <div class="localsearch">
      <div class="clear-mark" @click="handleClear"></div>
      <el-select
        v-model="searchValue"
        filterable
        remote
        reserve-keyword
        placeholder="请输入位置名称"
        :remoteMethod="remoteMethod"
        style="width: 240px"
        @change="searchChange"
      >
        <el-option
          v-for="item in localSearchResult"
          :key="item.gbCode"
          :label="item.name"
          :value="item.lonlat"
        />
      </el-select>
    </div>
    <div class="control-container">
      <div class="back-top"></div>
      <div class="back-center" @click="backCenter"></div>
      <div
        class="start-measureArea"
        :class="{ 'start-mark-active': activeToolType === 'measureArea' }"
        @click="handleToolClick('measureArea')"
      ></div>
      <div
        class="start-measure"
        :class="{ 'start-mark-active': activeToolType === 'measure' }"
        @click="handleToolClick('measure')"
      ></div>
      <div
        class="start-mark"
        :class="{ 'start-mark-active': activeToolType === 'mark' }"
        @click="handleToolClick('mark')"
      ></div>
      <div class="lng-lat">
        <span class="lng-lat-item">经度：{{ lng }}</span>
        <span class="lng-lat-item">纬度：{{ lat }}</span>
      </div>
    </div>
    <!-- 图例 -->
    <div class="legend-container">
      <div class="legend-item">
        <div class="legend-item-title">
          <div class="legend-item-title-icon alarm-ship"></div>
          <div class="legend-item-title-text">告警船舶</div>
        </div>
        <div class="legend-item-title">
          <div class="legend-item-title-icon external-ship"></div>
          <div class="legend-item-title-text">外部船舶</div>
        </div>
        <div class="legend-item-title">
          <div class="legend-item-title-icon internal-ship"></div>
          <div class="legend-item-title-text">内部船舶</div>
        </div>
      </div>
      <div class="legend-note">
        注:图例箭头代表船舶行驶方向，文字代表船舶类型
      </div>
    </div>
    <InfoWindow
      class="InfoWindowContainer"
      :visible="infoWindowVisible"
      :shipData="shipData"
    ></InfoWindow>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, nextTick, onUnmounted } from "vue";
import {
  initMap,
  startMeasure,
  stopMeasure,
  measureArea,
  setMarkStatus,
  localSearchResult,
  localSearch,
  closeMeasureArea,
  mapEvents
} from "@/utils/MapService";
import InfoWindow from "./InfoWindow.vue";

// 底图对象
const Map = ref();
const shipData = ref({});

const lng = ref(108.76236);
const lat = ref(21.44643);

const searchValue = ref("");
const searchOptions = ref([]);
// 点击船舶
const clickShip = (mark: any) => {
  console.log("mark", mark);
  infoWindowVisible.value = true;
  //   传递数据
  shipData.value = mark.data;
};
const infoWindowVisible = ref(false);

// 回到底图中心点
const backCenter = () => {
  //  lng = 108.76236, lat = 21.44643, zoom = 14
  //   console.log("backCenter", Map.value.getCenter(), Map.value.getZoom());
  Map.value.centerAndZoom([21.44643, 108.76236], 11);
};

const updateScale = () => {
  // 获取真实视口尺寸
  const currentWidth = document.body.clientWidth;
  const currentHeight = document.body.clientHeight;
  // 获取大屏最终的宽高
  const realWidth = window.screen.width;
  const realHeight = window.screen.height;
  // 计算缩放比例
  const widthScale = currentWidth / +realWidth;
  const heightScale = currentHeight / +realHeight;

  // 按照宽高最小比例进行缩放
  const scale = Math.min(widthScale, heightScale);
  return scale;
};

const setTransform = () => {
  nextTick(() => {
    // 获取当前页面的缩放比
    const scale = updateScale();
    console.log("当前缩放比transform:", scale);

    const mapContainer = document.getElementById("MapContainer");
    if (mapContainer) {
      mapContainer.style.zoom = `${1 / scale}`;
    }
  });
};

// 当前激活的工具类型
const activeToolType = ref("");

// 统一处理工具点击事件
const handleToolClick = (toolType: string) => {
  // 如果点击的是当前激活的工具，则取消激活
  if (activeToolType.value === toolType) {
    activeToolType.value = "";
    // 根据工具类型执行相应的取消操作
    switch (toolType) {
      case "measureArea":
        closeMeasureArea();
        break;
      case "measure":
        stopMeasure();
        break;
      case "mark":
        setMarkStatus(false);
        break;
    }
  } else {
    // 先取消当前激活的工具
    switch (activeToolType.value) {
      case "measureArea":
        closeMeasureArea();
        activeToolType.value = "";
        break;
      case "measure":
        stopMeasure();
        activeToolType.value = "";
        break;
      case "mark":
        setMarkStatus(false);
        break;
    }
    // 激活新的工具
    activeToolType.value = toolType;
    switch (toolType) {
      case "measureArea":
        measureArea();
        break;
      case "measure":
        startMeasure();
        break;
      case "mark":
        setMarkStatus(true);
        break;
    }
  }
};

const remoteMethod = (query: string) => {
  console.log("remoteMethod", query);
  // 置空
  searchOptions.value = [];
  if (query) {
    if (localSearch.value) {
      localSearch.value.search(query, 4);
      console.log("搜索条件", query);
    }
  }
};

const handleClear = () => {
  // 清空
  searchOptions.value = [];
  // 获取所有的mark点
  const markers = Map.value.getOverlays();
  // 找出所有的 marker.setType("search") 的点，满足条件的清除点
  console.log("markers", markers);
  markers.forEach((marker: any) => {
    if (marker.type === "search") {
      Map.value.removeOverLay(marker);
    }
  });
};

//显示信息框
function showPosition(markerLnglat: any, winHtml: any) {
  let markerInfoWin = new T.InfoWindow(winHtml, { autoPan: true });
  markerInfoWin.type = "search";
  let marker = new T.Marker(markerLnglat);
  marker.type = "search";
  Map.value.addOverLay(marker);
  marker.openInfoWindow(markerInfoWin);
}

// 监听localSearchResult
watch(localSearchResult, (obj) => {
  console.log("监听localSearchResult", obj);
  if (obj) {
    //坐标数组，设置最佳比例尺时会用到
    var zoomArr = [];
    for (var i = 0; i < obj.length; i++) {
      let name = obj[i].name;
      //地址
      let address = obj[i].address;
      //坐标
      let lnglatArr = obj[i].lonlat.split(",");
      let lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);

      let winHtml = "名称:" + name + "<br/>地址:" + address;

      //创建标注对象
      let marker = new T.Marker(lnglat);
      // 设置点的类型 以便于一会 清除
      marker.type = "search";
      //地图上添加标注点
      var markerInfoWin = new T.InfoWindow(winHtml, { autoPan: true });
      markerInfoWin.type = "search";
      Map.value.addOverLay(marker);

      //注册标注点的点击事件
      marker.addEventListener("click", function () {
        console.log("marker", marker);
        marker.openInfoWindow(markerInfoWin);
      });

      zoomArr.push(lnglat);
    }
    //显示地图的最佳级别
    Map.value.setViewport(zoomArr);
  }
});

const searchChange = (value: string) => {
  console.log("searchChange", typeof value, value);
  // 找出当前选中的项
  const currentItem = localSearchResult.value?.find(
    (item) => item.lonlat === value
  );
  console.log("currentItem", currentItem);
  if (currentItem) {
    const lnglat = currentItem.lonlat.split(",");
    let lnglatObj = new T.LngLat(lnglat[0], lnglat[1]);
    Map.value.panTo(lnglatObj);
    let winHtml =
      "名称:" + currentItem.name + "<br/>地址:" + currentItem.address;
    showPosition(lnglatObj, winHtml);
  }
};

onMounted(async () => {
  const mapContainer = document.getElementById("MapContainer");
  const { map, shipData } = await initMap(
    {
      mapContainer,
    },
    () => {
      if (infoWindowVisible.value) {
        infoWindowVisible.value = false;
      }
      console.log("markCallback");
    },
    (lnglat, markerType) => {
      lng.value = lnglat.lng;
      lat.value = lnglat.lat;
    },
    clickShip
  );
  if (map) {
    Map.value = map;
  }
  setTransform();
  // 监听当前页面的尺寸变化
  window.addEventListener("resize", setTransform);

  // 监听测距完成事件
  mapEvents.on('measureComplete', (data) => {
    console.log('测距完成:', data);
    // 在这里处理测距完成后的逻辑
    activeToolType.value = "";
  });

  // 监听测面积完成事件
  mapEvents.on('measureAreaComplete', (data) => {
    console.log('测面积完成:', data);
    // 在这里处理测面积完成后的逻辑
    activeToolType.value = "";
  });
});

// 组件卸载时清理事件监听
onUnmounted(() => {
  mapEvents.off('measureComplete');
  mapEvents.off('measureAreaComplete');
});
</script>

<style scoped lang="scss">
#MapContainer {
  ::v-deep .tdt-tile-pane {
    filter: url("#dark-green-sepia") invert(1) hue-rotate(293deg)
      brightness(0.9) contrast(1.6) saturate(1.4) sepia(0.35);
  }
  // transform: scale(1.175) translate(150px, 60px) !important; /* 1/0.850926 ≈ 1.175 */
}
.page-shipPosition {
  position: relative;
  width: 100%;
  height: 100%;
  .InfoWindowContainer {
    width: 484px;
    position: absolute;
    top: 60px;
    right: 20px;
    z-index: 9999;
  }

  .lng-lat {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 300px;
    color: #dee9ff;
    position: absolute;
    bottom: -36%;
    left: 400%;
    font-size: 14px;
    .lng-lat-item {
      padding-right: 20px;
    }
  }
  .localsearch {
    top: 2%;
    left: 2%;
    z-index: 99999;
    position: absolute;
  }
  .clear-mark {
    position: absolute;
    top: 50%;
    right: -15%;
    z-index: 99999;
    cursor: pointer;
    transform: translateY(-50%);
    background-image: url("@/assets/img/map/clearMark.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    width: 32px;
    height: 32px;
  }
  .control-container {
    position: absolute;
    z-index: 9999;
    bottom: 10.5%;
    left: 1.35%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .back-top {
      width: 32px;
      height: 32px;
      background-image: url("@/assets/img/map/pointingSigns.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      margin-bottom: 11px;
    }
    .back-center {
      width: 24px;
      height: 24px;
      background-image: url("@/assets/img/map/mapCenter.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      margin-bottom: 11px;
    }
    .start-measure {
      width: 24px;
      height: 24px;
      background-image: url("@/assets/img/map/chizi.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-color: #fff;
      border-radius: 2px;
      cursor: pointer;
      margin-bottom: 11px;
    }
    .start-measureArea {
      width: 24px;
      height: 24px;
      background-image: url("@/assets/img/map/polygon.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-color: #fff;
      border-radius: 2px;
      cursor: pointer;
      margin-bottom: 11px;
    }
    .start-mark {
      width: 24px;
      height: 24px;
      background-image: url("@/assets/img/map/mark.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-color: #fff;
      border-radius: 2px;
      cursor: pointer;
      margin-bottom: 11px;
    }
    .start-mark-active {
      background-color: #999 !important;
    }
  }
  .legend-container {
    position: absolute;
    bottom: 2%;
    right: 1%;
    z-index: 99999;
    width: 250px;
    .legend-item {
      display: flex;
      align-items: center;
      width: 100%;
      flex-wrap: wrap;
      margin-bottom: 10px;
      .legend-item-title {
        display: flex;
        align-items: center;
        width: 50%;
        margin-bottom: 10px;
        .legend-item-title-icon {
          width: 28px;
          height: 22px;
          margin-right: 10px;
        }
        .legend-item-title-text {
          color: #fff;
          font-size: 14px;
        }
        // 图标
        .alarm-ship {
          background-image: url("@/assets/img/map/alarmShip.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center;
        }
        .external-ship {
          background-image: url("@/assets/img/map/outShip.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center;
        }
        .internal-ship {
          background-image: url("@/assets/img/map/inShip.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center;
        }
      }
    }
    .legend-note {
      width: 100%;
      // color: #2F4D84;
      color: #dee9ff;
      font-size: 12px;
    }
  }
}

::v-deep .tdt-marker-pane > img {
  //   以自己为中心旋转
  transform-origin: 36% 51% !important;
  //   transform: rotate(141deg) !important;
}

::v-deep .tdt-marker-pane {
  z-index: 300;
}
::v-deep .tdt-label {
  -webkit-box-shadow: none;
  box-shadow: none;
}

::v-deep .content-car {
  height: auto !important;
}

::v-deep .tdt-bottom,
.tdt-top {
  bottom: 1%;
  left: 1%;
}

::v-deep .tdt-control-zoom {
  box-shadow: none;
  margin-bottom: -5px;
  > a {
    width: 24px;
    height: 24px;
    line-height: 24px;
  }
  > .tdt-control-zoom-in {
    margin-bottom: 10px;
  }
}
::v-deep .tdt-control-scale {
  margin-left: 60px;
  > .tdt-control-scale-line {
    color: #fff;
    border: 2px solid #fff;
    border-top: none;
  }
  > .tdt-control-scale-linebottom {
    display: none;
    border: 2px solid #fff;
    border-bottom: none;
  }
}
::v-deep .tdt-control-scale-line {
  color: #fff;
}
::v-deep .tdt-control-copyright {
  display: none;
}

::v-deep .tdt-interactive {
  transform: translate(-5px, -5px);
}
</style>
