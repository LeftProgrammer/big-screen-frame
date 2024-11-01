<script setup lang="ts">
import ContentCar from "@/components/contentCar/index.vue";
import Chart from "@/components/echart/chart.vue";
import * as echarts from "echarts";
import { ref, reactive, onMounted, nextTick } from "vue";
import { userBoardRecord, shipBoardRecord, weekWork } from "./api";
const chartRef = ref(null);
const option = ref({
  // backgroundColor: "#0f1c39", // 背景颜色
  tooltip: {
    trigger: "axis",
  },
  grid: {
    top: "20%",
    left: "3%",
    right: "4%",
    bottom: "1%",
    containLabel: true,
  },
  legend: {
    data: ["出海人员", "出海船舶"],
    textStyle: {
      color: "#fff", // 图例字体颜色
    },
  },
  xAxis: [
    {
      type: "category",
      data: ["08/22", "08/23", "08/24", "08/25", "08/26", "08/27", "08/28"],
      axisLine: {
        lineStyle: {
          color: "#0C2E64", // X轴颜色
        },
      },
      axisLabel: {
        color: "#CFD7EB", // X轴刻度颜色
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      name: "数量: 人",
      min: 0,
      max: 50,
      position: "left",
      axisLine: {
        lineStyle: {
          color: "#CFD7EB", // Y轴左侧颜色
        },
      },
      axisLabel: {
        formatter: "{value}", // Y轴刻度格式
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#0C2E64",
          type: "dashed",
          width: 1,
          dashOffset: 4,
          dash: [4, 4],
        },
      },
    },
    {
      type: "value",
      name: "数量: 艘",
      min: 0,
      max: 10,
      position: "right",
      axisLine: {
        lineStyle: {
          color: "#CFD7EB", // Y轴右侧颜色
        },
      },
      axisLabel: {
        formatter: "{value}", // Y轴刻度格式
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#0C2E64",
          type: "dashed",
          width: 1,
          dashOffset: 4,
          dash: [4, 4],
        },
      },
    },
  ],
  series: [
    // {
    //   // 背景系列
    //   name: "背景",
    //   type: "bar",
    //   data: [400, 400, 400, 400, 400, 400, 400], // 使用Y轴最大值
    //   barWidth: "70%", // 背景柱子宽度
    //   itemStyle: {
    //     color: "rgba(180, 180, 180, 0.1)", // 淡灰色背景
    //   },
    //   z: 1, // 确保背景在数据柱子后面
    //   barGap: "-75%", // 使背景柱和数据柱重叠
    // },
    {
      name: "出海人员",
      type: "bar",
      data: [10, 15, 7, 20, 12, 16, 18],
      barWidth: "40%", // 设置柱子的宽度稍微窄一些
      // barGap: "-10%", // 控制柱子间的间隔，负值使背景宽于柱子
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#0783FA" },
          { offset: 1, color: "rgba(0,85,255,0)" },
        ]),
      },
      showBackground: true,
      backgroundStyle: {
        color: "rgba(180, 180, 180, 0.1)", // 淡灰色背景，可以根据需要调整
        borderRadius: [5, 5, 0, 0], // 给背景添加圆角
      },
      z: 2,
    },
    {
      name: "出海船舶",
      type: "line",
      yAxisIndex: 1, // 使用第二个 Y 轴
      data: [3, 2, 4, 3, 1, 0, 3],
      itemStyle: {
        color: "#ffa500", // 折线图颜色
      },
      lineStyle: {
        width: 2,
      },
      symbol: "circle", // 圆点样式
      symbolSize: 8, // 圆点大小
      // symbolOffset: [4, 0], // 向下偏移 10 像素
      z: 3,
    },
  ],
});
const updateChart = (newOption: any) => {
  if (chartRef.value) {
    chartRef.value.setOption(newOption);
  }
};
// 设置 xAxis 数据
const setXAxisData = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - i);
    const formattedDate = `${String(pastDate.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(pastDate.getDate()).padStart(2, "0")}`;
    dates.push(formattedDate);
  }
  option.value.xAxis[0].data = dates.reverse();
  updateChart(option.value);
};
setXAxisData();
// 出海人员
onMounted(() => {
  weekWork().then((res: any) => {
    console.log("近七日出海船舶", res);
    if (res.code == 200) {
      option.value.series[0].data = res.result.worker;
      option.value.series[1].data = res.result.ship;
      updateChart(option.value);
    }
  });
});
</script>
<template>
  <ContentCar class="contetn_left-top" title="近七日出海统计">
    <template #content>
      <Chart
        ref="chartRef"
        class="w-full"
        style="height: calc(100% - 50px)"
        :option="option"
      />
    </template>
  </ContentCar>
</template>
<style scoped lang="scss">
.carousel {
  margin-bottom: 10px;
}
.content-text {
  font-size: 12px;
}
.contetn_left-top {
  width: 400px;
  height: 300px;
}
</style>
