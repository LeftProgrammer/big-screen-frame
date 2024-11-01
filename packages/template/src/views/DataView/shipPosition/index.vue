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
    <div class="control-container">
      <div class="back-top"></div>
      <div class="back-center" @click="backCenter"></div>
    </div>
    <InfoWindow
      class="InfoWindowContainer"
      :visible="infoWindowVisible"
      :shipData="shipData"
    ></InfoWindow>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import { initMap } from "@/utils/MapService";
import InfoWindow from "./InfoWindow.vue";

// 底图对象
const Map = ref();
const shipData = ref({});

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
    clickShip
  );
  if (map) {
    Map.value = map;
  }
});
</script>

<style scoped lang="scss">
#MapContainer {
  ::v-deep .tdt-tile-pane {
    filter: url("#dark-green-sepia") invert(1) hue-rotate(293deg)
      brightness(0.9) contrast(1.6) saturate(1.4) sepia(0.35);
  }
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

  .control-container {
    position: absolute;
    z-index: 9999;
    bottom: 83px;
    left: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    // 以自己为圆心 旋转60度

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
</style>
