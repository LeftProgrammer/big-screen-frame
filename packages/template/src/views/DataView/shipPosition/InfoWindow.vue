<template>
  <div class="ship-info-window" v-if="visible">
    <ContentCar class="contetn_left-top" title="xxx船舶">
      <template #content>
        <div class="ship-info-container">
          <div class="ship-info-title">
            <span class="title">AIS信息</span>
          </div>
          <div class="ship-info">
            <div class="info-item">
              <span class="label1">MMSI:</span>
              <span class="value">{{ shipData.mmsi }}</span>
            </div>
            <div class="info-item">
              <span class="label2">船道向:</span>
              <span class="value">{{ shipData.hdg / 100 }}度</span>
            </div>
            <div class="info-item">
              <span class="label1">呼号:</span>
              <span class="value">{{ shipData.callsign }}</span>
            </div>
            <div class="info-item">
              <span class="label2">航向:</span>
              <span class="value">{{ shipData.cog / 100 }}度</span>
            </div>
            <div class="info-item">
              <span class="label1">IMO:</span>
              <span class="value">{{ shipData.imo }}</span>
            </div>
            <div class="info-item">
              <span class="label2">航速:</span>
              <span class="value">{{ shipData.sog / 1000 }}m/s</span>
            </div>
            <div class="info-item">
              <span class="label1">类型:</span>
              <span class="value">{{ shipData.shiptype }}</span>
            </div>
            <div class="info-item">
              <span class="label2">纬度:</span>
              <span class="value">{{
                (shipData.lat * Math.pow(10, -6)).toFixed(6)
              }}</span>
            </div>
            <div class="info-item">
              <span class="label1">状态:</span>
              <span class="value">{{ getStatus(shipData.navistat) }}</span>
            </div>
            <div class="info-item">
              <span class="label2">经度:</span>
              <span class="value">{{
                (shipData.lon * Math.pow(10, -6)).toFixed(6)
              }}</span>
            </div>
            <div class="info-item">
              <span class="label1">船长:</span>
              <span class="value">{{ shipData.length }}</span>
            </div>
            <div class="info-item">
              <span class="label2">目的地:</span>
              <span class="value">{{ shipData.dest_std }}</span>
            </div>
            <div class="info-item">
              <span class="label1">船宽:</span>
              <span class="value">{{ shipData.width }}</span>
            </div>
            <div class="info-item">
              <span class="label2">预到时间:</span>
              <span class="value">{{ shipData.eta_std }}</span>
            </div>
            <div class="info-item">
              <span class="label1">吃水:</span>
              <span class="value">{{ shipData.draught / 100 }}米</span>
            </div>
            <div class="info-item">
              <span class="label2">更新时间:</span>
              <span class="value">{{ getTime(shipData.lasttime) }}</span>
            </div>
          </div>
        </div>
      </template>
    </ContentCar>
  </div>
</template>

<script setup>
import moment from "moment";
const statusMap = {
  0: "在航(主机推动)",
  1: "锚泊",
  2: "失控",
  3: "操纵受限",
  4: "吃水受限",
  5: "靠泊",
  6: "搁浅",
  7: "捕捞作业",
  8: "靠帆船提供动力",
};
const props = defineProps({
  title: {
    type: String,
    required: true,
    default: "船舶信息",
  },
  visible: {
    type: Boolean,
    default: true,
  },
  shipData: {
    type: Object,
    default: () => {},
  },
});

const getStatus = (code) => {
  let statusName = statusMap[code] || "";
  return statusName;
};

const getTime = (time) => {
  return moment(time * 1000).format("YYYY-MM-DD HH:mm:ss");
};
</script>

<style scoped lang="scss">
.ship-info-window {
//   filter: invert(-1) hue-rotate(-293deg) brightness(-0.9) contrast(-1.6)
//     saturate(-1.4) sepia(-0.35) !important;

  padding: 10px 10px 0px 10px;
  border-radius: 5px;
  width: 100%;
  background: #031029;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.5);
  //   border-radius: 0px 0px 0px 0px;
  //   border: 1px solid;
  border-image: linear-gradient(
      180deg,
      rgba(20, 62, 142, 0.14),
      rgba(5, 37, 100, 1)
    )
    1 1;
  .ship-info-container {
    padding: 5px 10px 10px 10px;
    .ship-info-title {
      font-size: 16px;
      color: #fff;
      padding-bottom: 10px;
      border-bottom: 1px solid #0b2b67;
      margin-bottom: 10px;
      position: relative;
      padding-left: 10px;
      letter-spacing: 2px;
    }
    .ship-info-title::before {
      content: "";
      position: absolute;
      width: 4px;
      height: 10px;
      top: 50%;
      left: 0px;
      transform: translateY(calc(-50% - 5px));
      background: #f98431;
    }
    .ship-info {
      // 两列显示
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .info-item {
        width: 50%;
        margin-bottom: 10px;
        .label1 {
          text-align: right;
          width: 40px;
          display: inline-block;
          margin-right: 10px;
          color: #3d6dc9;
        }
        .label2 {
          text-align: right;
          width: 55px;
          display: inline-block;
          margin-right: 10px;
          color: #3d6dc9;
        }
        .value {
          color: #fff;
          display: inline-block;
        }
      }
    }
  }
}
</style>
