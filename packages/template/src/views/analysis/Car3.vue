<script setup lang="ts">
import ContentCar from "@/components/contentCar/index.vue";
import { ref, reactive, onMounted, nextTick } from "vue";
import { getSettledContractList } from "./api";
const settledContractInfo = ref({
  settlementMoney: 0,
  settlementPercent: 0,
  totalContract: 0,
});

onMounted(() => {
  getSettledContractList().then((res: any) => {
    console.log("getSettledContractList", res);
    if (res.code == 200) {
      settledContractInfo.value = res.result;
    }
  });
});
</script>
<template>
  <ContentCar class="contetn_left-top" title="结算信息">
    <template #content>
      <div class="flex settlement">
        <div class="settlement-left flex justify-center items-center">
          <div class="text-center" style="margin-top: -20px">
            <div class="text-progress mb-2">{{settledContractInfo.settlementPercent}}%</div>
            <div class="text">已结算</div>
          </div>
        </div>
        <div class="settlement-right flex flex-col justify-between">
          <div>
            <div class="mb-1 text-sm title-text title-text1">
              合同总金额（元）
            </div>
            <div class="text-lg text-white">{{settledContractInfo.totalContract}}</div>
          </div>
          <div>
            <div class="mb-1 text-sm title-text title-text2">
              累计结算（元）
            </div>
            <div class="text-lg text-white">{{settledContractInfo.settlementMoney}}</div>
          </div>
        </div>
      </div>
    </template>
  </ContentCar>
</template>
<style scoped lang="scss">
.content-text {
  font-size: 12px;
}
.contetn_left-top {
  width: 400px;
  height: 240px;
}
.settlement {
  font-family: "AlibabaPuHuiTi-2-65-Medium";
  margin-top: 30px;
  height: 166px;
  .title-text {
    color: #b6d1f0;
    // AlibabaPuHuiTi-2-65-Medium
    position: relative;
  }
  .title-text1::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    position: absolute;
    top: 5px;
    left: -20px;
    border-radius: 50%;
    background-color: #f88138;
  }
  .title-text2::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    position: absolute;
    top: 5px;
    left: -20px;
    border-radius: 50%;
    background-color: #1346e3;
  }
  .settlement-left {
    width: 209px;
    height: 100%;
    margin-left: 20px;
    background-image: url("@/assets/img/big-data/settlement.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    .text-progress {
      font-family: "ZiTiQuanXinYiGuanHeiTi4";
      color: #f88138;
      letter-spacing: 2px;
      font-weight: 900;
    }
    .text {
      color: #2c4ec1;
    }
  }
  .settlement-right {
    width: 209px;
    height: 100%;
    padding: 20px 0 20px 40px;
  }
}
</style>
