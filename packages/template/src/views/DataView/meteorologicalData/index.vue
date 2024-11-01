<template>
  <div class="page-meteorologicalData">
    <!-- 近七日气象数据 -->
    <div class="title">近七日气象数据</div>
    <div class="top">
      <div class="weatherType">
        <div
          :class="{ weatherTypeItemSelected: currentType == item.type }"
          class="weatherTypeItem"
          v-for="item in weather7daysType"
          :key="item.type"
          @click="setEcharts(item.type)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="chartRef">
        <Chart ref="chartRef" class="w-full h-full" :option="option" />
      </div>
    </div>
    <!-- 施工预警 -->
    <div class="bottom">
      <meteTable />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import Chart from "@/components/echart/chart.vue";
import meteTable from "./meteTable.vue";
import { EChartsCoreOption } from "echarts";

import { getWeather7days } from "./api";

const weather7daysType = ref<any[]>([
  {
    name: "气温",
    type: "highTemperature",
  },
  {
    name: "风速",
    type: "windSpeed",
  },
  {
    name: "能见度",
    type: "visibility",
  },
  {
    name: "浪高",
    type: "waveHeight",
  },
  {
    name: "降水量",
    type: "precipitation",
  },
]);

const weather7daysData = ref<any[]>([]);
const currentType = ref<string>("highTemperature");

const formatterUnit = () => {
  switch (currentType.value) {
    case "highTemperature":
      return "°C";
    case "windSpeed":
      return "m/s";
    case "visibility":
      return "km";
    case "waveHeight":
      return "m";
    case "precipitation":
      return "mm";
    default:
      return "";
  }
};

const chartRef = ref(null);
const echartOption = ref<EChartsCoreOption>({
  tooltip: {
    trigger: "axis",
  },
  grid: {
    top: "10%",
    left: "2%",
    right: "2%",
    bottom: "0%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisLine: {
      lineStyle: {
        color: "#0C2E64",
      },
    },
    axisLabel: {
      // 往下偏移
      margin: 20,
      color: "#90BEFF",
    },
    data: [
      "1970-01-01",
      "1970-01-02",
      "1970-01-03",
      "1970-01-04",
      "1970-01-05",
      "1970-01-06",
      "1970-01-07",
    ],
  },
  yAxis: {
    type: "value",
    show: true,
    name: `(°C)`,
    nameTextStyle: {
      color: "#90BEFF",
      padding: [0, 0, 0, -35], // 调整单位文字位置
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "#0C2E64",
      },
    },
    splitLine: {
      lineStyle: {
        color: "rgba(93, 141, 224, 0.3)",
        type: "dashed",
      },
    },
    axisLabel: {
      show: true,
      color: "#90BEFF",
    },
  },
  series: [
    {
      data: [0, 0, 0, 0, 0, 0, 0],
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: {
        width: 2,
        color: "#183FFF",
      },
      areaStyle: {
        opacity: 0.8,
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgba(24, 63, 255, 0.3)",
            },
            {
              offset: 1,
              color: "rgba(7, 131, 250, 0)",
            },
          ],
        },
      },
    },
  ],
});

// 切换数据设置echarts
const setEcharts = (type: string) => {
  currentType.value = type;
  // 从weather7daysData中根据type获取数据
  const data = weather7daysData.value.map((item) => item[type]);
  echartOption.value.series[0].data = data;
  //   设置单位
  echartOption.value.yAxis.name = `(${formatterUnit()})`;
  console.log(type, data);
  if (chartRef.value) {
    chartRef.value.setOption(echartOption.value);
  }
};
const initEcharts = () => {};
onMounted(async () => {
  // 初始化
  initEcharts();
  const res = await getWeather7days();
  if (res.code === 200) {
    console.log("近七日气象数据", res.result.week);
    weather7daysData.value = res.result.week;
    // 日期
    const date = weather7daysData.value.map((item) => {
      const str = item.day.toString();
      return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
    });
    echartOption.value.xAxis.data = date;
    setEcharts("highTemperature");
  }
});
</script>

<style scoped lang="scss">
.page-meteorologicalData {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title {
    width: 100%;
    font-size: 36px;
    height: 44px;
    font-family: "AlibabaPuHuiTi-2-65-Medium";
    font-weight: normal;
    font-size: 36px;
    color: #ffffff;
    line-height: 44px;
    text-align: center;
    font-style: normal;
    text-transform: none;
    margin-bottom: 20px;
    margin-top: 5px;
  }
  .top {
    margin-bottom: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    height: 307px;
    .weatherType {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 15px;
      align-items: center;
      height: 100%;
      border: 1px solid #fff;
      width: 188px;
      height: 307px;
      margin-right: 20px;
      background: linear-gradient(
        180deg,
        rgba(19, 89, 241, 0.37) 0%,
        rgba(41, 107, 248, 0.37) 100%
      );
      border-radius: 6px 6px 6px 6px;
      border: 1px solid;
      border-image: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.18),
          rgba(255, 255, 255, 0.02)
        )
        1 1;

      .weatherTypeItem {
        cursor: pointer;
        width: 140px;
        height: 41px;
        background-image: url("@/assets/img/big-data/weatherTypeItem.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        color: #ffffff;
        font-size: 24px;
        font-family: "AlibabaPuHuiTi-2-65-Medium";
        font-weight: normal;
        line-height: 41px;
        text-align: center;
        font-style: normal;
        text-transform: none;
      }
      .weatherTypeItem:hover {
        background-image: url("@/assets/img/big-data/weatherTypeItemSelected.png");
      }
      .weatherTypeItemSelected {
        background-image: url("@/assets/img/big-data/weatherTypeItemSelected.png");
      }
    }
    .chartRef {
      flex: 1;
      height: 100%;
    }
  }
  .bottom {
    width: 100%;
    flex: 1;
    overflow: hidden;
  }
}
</style>
