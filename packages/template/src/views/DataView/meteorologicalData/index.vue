<template>
  <div class="page-meteorologicalData">
    <!-- 近七日气象数据 -->
    <div class="title">近七日气象数据</div>
    <div class="top" @mouseenter="stopAutoSwitch" @mouseleave="startAutoSwitch">
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
import { ref, reactive, onMounted, nextTick, onUnmounted } from "vue";
import Chart from "@/components/echart/chart.vue";
import meteTable from "./meteTable.vue";
import { EChartsCoreOption } from "echarts";

import moment from "moment";

import { getWeather7days } from "./api";

const weather7daysType = ref<any[]>([
  {
    name: "气温",
    type: "temperature",
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
const currentType = ref<string>("temperature");
const timer = ref<NodeJS.Timer | null>(null);

const formatterUnit = () => {
  switch (currentType.value) {
    case "temperature":
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
    trigger: "axis", // 设置触发类型为坐标轴触发
    formatter: (params: any) => {
      // params 是一个数组，包含着该点所有数据信息
      let xValue = moment(Number(params[0].axisValue)).format(
        "YYYY-MM-DD HH:mm:ss"
      ); // x 轴数据
      let yValue = params[0].value; // y 轴数据
      return `
              <div >
                <div style="margin-bottom:10px;font-size: 14px;">${yValue}${formatterUnit()}</div>
                <div style='color: #86909C;font-size: 12px;'>${xValue}</div>
              </div>
              `;
    },
  },
  grid: {
    top: "3%",
    left: "2%",
    right: "2%",
    bottom: "0%",
    containLabel: true,
  },
  xAxis: {
    type: "category", 
    splitNumber: 100, // 刻度数量
    boundaryGap: false,
    axisLine: {
      lineStyle: {
        color: "#0C2E64",
      },
    },
    axisLabel: {
      margin: 20,
      color: "#90BEFF", // 设置X轴刻度文字颜色为白色
      fontSize: 12,
    },
    axisTick: {
      show: false, // 隐藏 X 轴的刻度线
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
  const data = weather7daysData.value[type];
  echartOption.value.series[0].data = data;
  echartOption.value.yAxis.axisLabel.formatter = (value: number) => {
    return `${value}${formatterUnit()}`;
  };
  echartOption.value.yAxis.min = 0;
  if (type == "temperature") {
    echartOption.value.yAxis.min = -10;
    echartOption.value.yAxis.max = 40;
  } else if (type == "windSpeed") {
    echartOption.value.yAxis.max = 35;
  } else if (type == "waveHeight") {
    echartOption.value.yAxis.max = 5;
  } else if (type == "precipitation") {
    echartOption.value.yAxis.max = 40;
  } else {
    echartOption.value.yAxis.max = null;
  }

  echartOption.value.xAxis.axisLabel = {
    hideOverlap: true,
    interval: 0,
    margin: 20,
    color: "#90BEFF", // 设置X轴刻度文字颜色为白色
    fontSize: 12,
    formatter: (value, index) => {
      if (index === 0) {
        return moment(Number(value)).format("YYYY-MM-DD"); // 第一个刻度始终显示
      } else {
        let xOption = echartOption.value.xAxis.data[index - 1];
        const prevValue = moment(xOption).format("YYYY-MM-DD");
        let day = moment(Number(value)).format("YYYY-MM-DD");
        if (day !== prevValue) {
          return day; // 与前一个刻度不同的日期才显示标签
        } else {
          return ""; // 与前一个刻度相同的日期不显示标签
        }
      }
    },
  };

  console.log(type, data);
  if (chartRef.value) {
    chartRef.value.setOption(echartOption.value);
  }
};
// 添加自动切换函数
const autoSwitch = () => {
  const types = weather7daysType.value;
  const currentIndex = types.findIndex(
    (item) => item.type === currentType.value
  );
  const nextIndex = (currentIndex + 1) % types.length;
  setEcharts(types[nextIndex].type);
};

// 开始自动切换
const startAutoSwitch = () => {
  if (!timer.value) {
    timer.value = setInterval(autoSwitch, 5000);
  }
};

// 停止自动切换
const stopAutoSwitch = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

onMounted(async () => {
  // 初始化
  const res = await getWeather7days();
  if (res.code === 200) {
    console.log("近七日气象数据", res.result);
    const { hours, now, today } = res.result;

    // 准备X轴
    let xName: string[] = [];

    let temperature: number[] = [];
    let windSpeed: number[] = [];
    let visibility: number[] = [];
    let waveHeight: number[] = [];
    let precipitation: number[] = [];
    hours.forEach((item: any) => {
      temperature.push(item.temperature);
      xName.push(item.timestamp);
      windSpeed.push(item.windSpeed);
      visibility.push(item.visibility);
      waveHeight.push(item.waveHeight);
      precipitation.push(item.precipitation);
    });

    weather7daysData.value = {
      temperature,
      windSpeed,
      visibility,
      waveHeight,
      precipitation,
    };
    // 日期
    echartOption.value.xAxis.data = xName;
    setEcharts("temperature");
  }
  startAutoSwitch(); // 开始自动切换
});

onUnmounted(() => {
  stopAutoSwitch(); // 组件销毁时清除定时器
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
