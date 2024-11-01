<template>
  <ContentCar class="contetn_left-top" title="气象情况">
    <template #content>
      <div class="weather-card">
        <div class="weather-header">
          <div class="weather-icon"></div>
          <div class="temp-info">
            <h1 class="text-white">27.5°</h1>
            <div class="weather-condition">
              <span>{{ weatherInfoData.weatherDescription }}</span>
              <span>|</span>
              <span>{{ weatherInfoData.windMark }}风</span>
              <span>|</span>
              <span>3级**</span>
            </div>
          </div>
        </div>
        <div class="weather-details">
          <div class="detail-item">
            <div class="icon-placeholder shidu"></div>
            <div>
              <p>相对湿度</p>
              <p>{{ weatherInfoData.relaHumidity }}%</p>
            </div>
          </div>
          <div class="detail-item">
            <div class="icon-placeholder ziwaixian"></div>
            <div>
              <p>紫外线指数</p>
              <p>{{weatherInfoData.ultravioletRays}}级</p>
            </div>
          </div>
          <div class="detail-item">
            <div class="icon-placeholder tigan"></div>
            <div>
              <p>体感温度</p>
              <p>{{weatherInfoData.appTemp}}°C</p>
            </div>
          </div>
          <div class="detail-item">
            <div class="icon-placeholder nengjiandu"></div>
            <div>
              <p>能见度</p>
              <p>{{weatherInfoData.visibility}}km</p>
            </div>
          </div>
          <div class="detail-item">
            <div class="icon-placeholder jiangyuliang"></div>
            <div>
              <p>降水量</p>
              <p>{{weatherInfoData.precipitation}}mm</p>
            </div>
          </div>
          <div class="detail-item">
            <div class="icon-placeholder qiya"></div>
            <div>
              <p>气压</p>
              <p>{{weatherInfoData.pressure}}mb</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ContentCar>
</template>

<script setup lang="ts">
import ContentCar from "@/components/contentCar/index.vue";
import { ref, reactive, onMounted, nextTick } from "vue";
import { weatherInfo } from "./api";

const weatherInfoData = ref({
  appTemp: 35.3,
  cityName: "钦州",
  clouds: 0,
  createBy: null,
  createTime: "2024-09-29 17:01:09",
  dateTime: "2024-09-29 15:46",
  deleteFlag: 0,
  hour: 2024092917,
  id: "1840315867825483778",
  lat: "21.377178",
  lon: "108.815007",
  pod: "d",
  precipitation: 0,
  pressure: 1004,
  probability: null,
  relaHumidity: 71,
  seaPressure: null,
  snow: 0,
  snowDepth: null,
  temperature: 30,
  ultravioletRays: 3,
  updateBy: null,
  updateTime: null,
  visibility: 16,
  waveHeight: 0,
  weatherCode: 1031,
  weatherDescription: "晴天",
  windDirection: 181,
  windMark: "南",
  windSpeed: 4.6,
});
// weatherInfo
onMounted(() => {
  weatherInfo().then((res: any) => {
    console.log("weatherInfo", res);
    if (res.code == 200) {
      weatherInfoData.value = res.result.now;
    }
  });
});
</script>

<style scoped lang="scss">
.contetn_left-top {
  width: 400px;
  // border: 1px solid red;
  height: 320px;
  // overflow: hidden;
}

.weather-card {
  color: #fff;
  border-radius: 10px;
  width: 100%;
  font-family: "AlibabaPuHuiTi-2-65-Medium";

  .weather-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    margin-left: 30px;
    .temp-info h1 {
      margin: 0;
      font-size: 36px;
    }

    .temp-info .weather-condition {
      font-size: 16px;
      color: #cfd7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 13px;
    }

    .weather-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 20px;
      margin-left: 20px;
      background-image: url("@/assets/img/weather/qintian.png");
      background-size: 100% 100%;
      background-position: center center;
      background-repeat: no-repeat;
    }
  }

  .weather-details {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0px;
    row-gap: 25px;

    .detail-item {
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-placeholder {
        width: 31px;
        height: 31px;
        margin-right: 10px;
        // border-radius: 10%;
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
      }
      .shidu {
        background-image: url("@/assets/img/weather/shidu.png");
      }
      .ziwaixian {
        background-image: url("@/assets/img/weather/ziwaixian.png");
      }
      .tigan {
        background-image: url("@/assets/img/weather/tigan.png");
      }
      .nengjiandu {
        background-image: url("@/assets/img/weather/nengjiandu.png");
      }
      .jiangyuliang {
        background-image: url("@/assets/img/weather/jiangyuliang.png");
      }
      .qiya {
        background-image: url("@/assets/img/weather/qiya.png");
      }
      p:first-child {
        font-size: 14px;
        color: #cfd7eb;
      }
      p:last-child {
        font-size: 16px;
        color: #fff;
        font-weight: 600;
      }
    }
  }
}
</style>
