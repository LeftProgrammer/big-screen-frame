<template>
  <div class="content-bottom">
    <div class="select-btn">
      <div
        v-for="(item, index) in buttons"
        :key="index"
        class="btn"
        :class="{
          'select-active': activeBtn == item.type,
          select: activeBtn != item.type,
        }"
        @click="changeBtn(item.type)"
      >
        <span>{{ item.name }}</span>
      </div>
    </div>
    <el-table
      v-loading="loading"
      v-show="activeBtn === 'processAssess'"
      style="width: 100%"
      ref="table"
      :data="tableData"
      :row-class-name="rowClassName"
      :border="true"
      :pagination="false"
      class="table-content-1"
    >
      <template v-for="col in columns1" :key="col.dataIndex">
        <el-table-column
          :prop="col.dataIndex"
          :label="col.title"
          :width="col.width"
          :min-width="col.minWidth"
        >
          <template #default="scope">
            <el-popover
              v-if="col.dataIndex === 'name' || col.dataIndex === 'typeName'"
              :content="
                getColumnName(
                  scope.row[col.dataIndex],
                  scope.row,
                  scope.$index,
                  col
                )
              "
              trigger="hover"
              placement="top"
            >
              <template #reference>
                <div class="w-100pre text-left custom-text">
                  {{
                    getColumnName(
                      scope.row[col.dataIndex],
                      scope.row,
                      scope.$index,
                      col
                    )
                  }}
                </div>
              </template>
            </el-popover>

            <template v-else>
              <el-popover
                popper-class="popover-content"
                v-if="getColumnName(scope, scope.row, scope.$index, col) < 3"
                placement="right"
                trigger="click"
                width="400"
              >
                <template #reference>
                  <span
                    @click="
                      initPopover(
                        scope.row[col.dataIndex],
                        scope.row,
                        scope.$index,
                        col
                      )
                    "
                  >
                    <el-image
                      v-if="
                        getColumnName(scope, scope.row, scope.$index, col) == 1
                      "
                      style="width: 22px; height: 22px"
                      :src="iconOk"
                      fit="fill"
                    />
                    <el-image
                      v-if="
                        getColumnName(scope, scope.row, scope.$index, col) == 2
                      "
                      style="width: 22px; height: 22px"
                      :src="alert"
                      fit="fill"
                    />
                  </span>
                </template>

                <el-table
                  :data="popoverTableData"
                  :row-class-name="popoverRowClassName"
                  :header-row-style="{ border: '1px solid #fea743' }"
                >
                  <el-table-column>
                    <template #header>
                      <div>指标</div>
                    </template>
                    <template #default="scope">
                      <div class="first-column">
                        <el-avatar
                          style="margin-right: 5px"
                          :size="16"
                          :src="getImageUrl(scope.row.icon)"
                        />
                        <span>{{ scope.row.index }}</span>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column prop="forecastWeather" align="left">
                    <template #header>
                      <div>预测天气</div>
                    </template>
                    <template #default="scope">
                      <div class="first-column">
                        <span :style="alertName(scope.row)">{{
                          scope.row.forecastWeather
                        }}</span>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column prop="wather" align="left">
                    <template #header>
                      <div>适宜施工天气</div>
                    </template>
                    <template #default="scope">
                      <div class="first-column">{{ scope.row.wather }}</div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-popover>
              <el-avatar v-else :size="18" />
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-table
      v-loading="loading"
      v-show="activeBtn === 'sailingAssess'"
      style="width: 100%"
      ref="table"
      :data="tableData"
      :row-class-name="rowClassName"
      :border="true"
      :pagination="false"
      class="table-content-1"
    >
      <template v-for="col in columns2" :key="col.dataIndex">
        <el-table-column
          :prop="col.dataIndex"
          :label="col.title"
          :width="col.width"
          :min-width="col.minWidth"
        >
          <template #default="scope">
            <el-popover
              v-if="col.dataIndex === 'name' || col.dataIndex === 'typeName'"
              :content="
                getColumnName(
                  scope.row[col.dataIndex],
                  scope.row,
                  scope.$index,
                  col
                )
              "
              trigger="hover"
              placement="top"
            >
              <template #reference>
                <div class="text-left ml-5" style="width: 100%;">
                  {{
                    getColumnName(
                      scope.row[col.dataIndex],
                      scope.row,
                      scope.$index,
                      col
                    )
                  }}
                </div>
              </template>
            </el-popover>

            <template v-else>
              <el-popover
                popper-class="popover-content"
                v-if="getColumnName(scope, scope.row, scope.$index, col) < 3"
                placement="right"
                trigger="click"
                width="400"
              >
                <template #reference>
                  <span
                    @click="
                      initPopover(
                        scope.row[col.dataIndex],
                        scope.row,
                        scope.$index,
                        col
                      )
                    "
                  >
                    <el-image
                      v-if="
                        getColumnName(scope, scope.row, scope.$index, col) == 1
                      "
                      style="width: 22px; height: 22px"
                      :src="iconOk"
                      fit="fill"
                    />
                    <el-image
                      v-if="
                        getColumnName(scope, scope.row, scope.$index, col) == 2
                      "
                      style="width: 22px; height: 22px"
                      :src="alert"
                      fit="fill"
                    />
                  </span>
                </template>

                <el-table
                  :data="popoverTableData"
                  :row-class-name="popoverRowClassName"
                  :header-row-style="{ border: '1px solid #fff' }"
                >
                  <el-table-column>
                    <template #header>
                      <div>指标</div>
                    </template>
                    <template #default="scope">
                      <div class="first-column">
                        <el-avatar
                          style="margin-right: 5px"
                          :size="16"
                          :src="getIcon(scope.row.icon)"
                        />
                        <span>{{ scope.row.index }}</span>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column prop="forecastWeather" align="left">
                    <template #header>
                      <div>预测天气</div>
                    </template>
                    <template #default="scope">
                      <div class="first-column">
                        <span :style="alertName(scope.row)">{{
                          scope.row.forecastWeather
                        }}</span>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column prop="wather" align="left">
                    <template #header>
                      <div>适宜施工天气</div>
                    </template>
                    <template #default="scope">
                      <div class="first-column">{{ scope.row.wather }}</div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-popover>
              <el-avatar v-else :size="18" />
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { getImageUrl } from "@/utils/image";

import { processAssess, sailingAssess } from "./api";

import { queryTreeList } from "@/api/modules/index";

import iconOk from "@/assets/img/big-data/ok.png";
import alert from "@/assets/img/big-data/alert.png";
const rule = {
  gt: ">",
  gte: ">=",
  eq: "=",
  lt: "<",
  lte: "<=",
};
const buttons = ref([
  {
    name: "施工评估与预警",
    type: "processAssess",
  },
  {
    name: "出航评估与预警",
    type: "sailingAssess",
  },
]);

const activeBtn = ref("processAssess");

const getIcon = (icon: string) => {
  let iconUrl = new URL(`../../../assets/img/big-data/${icon}`, import.meta.url)
    .href;
  return iconUrl;
};

const tableData = ref<any[]>([
  {
    name: "沉桩施工",
    type: "风机安装",
    key: "1",
  },
  {
    name: "沉桩施工",
    type: "风机安装",
    key: "2",
  },
  {
    name: "沉桩施工",
    type: "风机安装",
    key: "3",
  },
  {
    name: "沉桩施工",
    type: "风机安装",
    key: "4",
  },
  {
    name: "沉桩施工",
    type: "风机安装",
    key: "5",
  },
  {
    name: "沉桩施工",
    type: "风机安装",
    key: "6",
  },
]);
const columns1 = ref<any[]>([
  {
    title: "工序类型",
    dataIndex: "typeName",
    key: "typeName",
    width: 100,
    ellipsis: true,
    fixed: "left",
  },
  {
    title: "工序名称",
    dataIndex: "name",
    slots: { title: "工序名称" },
    scopedSlots: { customRender: "name" },
    key: "name",
    width: 300,
    ellipsis: true,
    fixed: "left",
  },
]);

const columns2 = ref<any[]>([
  {
    title: "船舶名称",
    dataIndex: "name",
    slots: { title: "船舶名称" },
    scopedSlots: { customRender: "name" },
    key: "name",
    width: 400,
    ellipsis: true,
    fixed: "left",
  },
]);

const changeBtn = async (type: string) => {
  activeBtn.value = type;
  await getAllData(type);
};

const initTable = () => {
  // 循环24次
  let column = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0");
    column.push({
      title: `${hour}:00`,
      dataIndex: hour, // 使用hour作为dataIndex
      key: hour,
      scopedSlots: { customRender: hour },
      width: 61,
      minWidth: 61,
    });
  }
  columns1.value = columns1.value.concat(column);
  columns2.value = columns2.value.concat(column);
};
initTable();

const popoverTableData = ref<any[]>([
  {
    index: "风速(m/s)",
    forecastWeather: 3.0,
    wather: ">0.00;5.00",
    forecasKey: "windSpeed",
    key: "windCondition",
    icon: "win.png",
  },
  {
    index: "浪高(m)",
    forecastWeather: 0.5,
    wather: ">0.00;5.00",
    forecasKey: "waveHeight",
    key: "waveCondition",
    icon: "wave.png",
  },
  {
    index: "能见度(km)",
    forecastWeather: 0.5,
    wather: ">0.00;5.00",
    forecasKey: "visibility",
    key: "visibilityCondition",
    icon: "visibility.png",
  },
  {
    index: "温度(℃)",
    forecastWeather: 0.5,
    wather: ">0.00;5.00",
    forecasKey: "temperature",
    key: "temperatureCondition",
    icon: "temperature.png",
  },
  {
    index: "降雨量(mm)",
    forecastWeather: 0.5,
    wather: ">0.00;5.00",
    forecasKey: "precipitation",
    key: "precipitationCondition",
    icon: "rainfall.png",
  },
]);

const processType = ref<[]>([]);
const rowClassName = (row: any) => {
  return row.rowIndex % 2 === 0 ? "even-row" : "odd-row";
};

const alertName = (record: any) => {
  if (record.check) {
    return "color:#dbecf5";
  } else {
    return "color:#f53f3f";
  }
};

const popoverRowClassName = (record: any, index: any) => {
  // console.log('record', record, index)
  return "popover-row";
};

// 扁平化树结构
const flatten = (data: any[], result: any[] = []) => {
  for (let item of data) {
    const { children, ...rest } = item;
    result.push(rest);
    if (children && children.length > 0) {
      flatten(children, result);
    }
  }
  return result;
};

const initDict = async () => {
  const res = await queryTreeList({ code: "B04" });
  if (res.success) {
    console.log("res.result", res.result);
    processType.value = flatten(res.result);
    console.log("processType", processType.value);
  }
};

const getColumnName = (text: any, record: any, index: any, col: any) => {
  if (col.dataIndex === "typeName") {
    return record.typeName;
  }
  if (col.dataIndex === "name") {
    return record.name;
  }
  if (record[col.dataIndex]) {
    return record[col.dataIndex].weatherCheck ? 1 : 2;
  } else {
    return 3;
  }
};

const initPopover = (text, record, index, col) => {
  if (!text) {
    popoverTableData.value.forEach((item) => {
      item.forecastWeather = "/";
      item.wather = "/";
    });
    return;
  }
  popoverTableData.value.forEach((item) => {
    item.forecastWeather = text[item.forecasKey];
    item.check = text[item.key.replace("Condition", "Check")];
    if (text[item.key]) {
      let json = JSON.parse(text[item.key]);
      console.log("constructionEvaluation", json);
      if (rule[json[0].symbol]) {
        item.wather = `${rule[json[0].symbol] ? rule[json[0].symbol] : ""}${
          json[0].num || json[0].num == 0 ? json[0].num : ""
        };${rule[json[1].symbol] ? rule[json[1].symbol] : ""}${
          json[1].num || json[1].num == 0 ? json[1].num : ""
        }`;
      } else {
        item.wather = "/";
        item.check = true;
      }
    } else {
      item.wather = "/";
      item.check = true;
    }
  });
  popoverTableData.value = popoverTableData.value;
};

const loading = ref(false);
const getAllData = async (type: string) => {
  loading.value = true;
  let res;
  if (type === "processAssess") {
    res = await processAssess();
  } else if (type === "sailingAssess") {
    res = await sailingAssess();
  }

  if (res?.code === 200) {
    let sevenDaysTable = [];
    res.result.forEach((element) => {
      sevenDaysTable.push(element.processCheck);
    });
    tableData.value = sevenDaysTable[0];
    console.log("tableData", tableData.value);
  }
  loading.value = false;
};
// 初始化
onMounted(async () => {
  await initDict();
  await changeBtn(activeBtn.value);
});
</script>

<style scoped lang="scss">
.content-bottom {
  width: 100%;
  height: 100%;
  border-radius: 6px 6px 6px 6px;
  background: linear-gradient(
    360deg,
    rgba(12, 33, 69, 0.6) 0%,
    rgba(12, 33, 69, 0.6) 100%
  );
  padding: 10px;
}
::v-deep .el-table .cell {
  padding: 0 !important;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  .el-tooltip__trigger {
    display: flex;
  }
}

::v-deep .el-table .cell:has(.custom-text) {
  justify-content: left;
  .custom-text {
    margin-left: 10px;
  }
}

::v-deep .el-table {
  background: transparent;
  height: 410px;
  tr {
    background-color: transparent;
  }
}
.table-content-1 {
  overflow: hidden;
  --el-table-border-color: #1f5481;
  --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.1);
  ::v-deep > .el-table__inner-wrapper {
    .el-table__header-wrapper {
      .el-table__header {
        width: initial !important;
        tr > .el-table__cell {
          background-color: transparent;
          color: #fea743;
          font-weight: 500;
        }
      }
    }
    .el-table__body-wrapper {
      .el-scrollbar {
        .el-scrollbar__wrap {
          .el-scrollbar__view {
            .el-table__body {
              .el-table__row {
                background-color: transparent;
                color: #dbecf5;
              }
            }
          }
        }
      }
    }
  }
  ::v-deep .el-table__body {
    width: initial !important;
  }
}

.select-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  .select-active {
    background-image: url("@/assets/img/big-data/select-active.png");
    color: #fff !important;
  }
  .select {
    background-image: url("@/assets/img/big-data/select.png");
  }
  .btn {
    width: 193px;
    height: 41px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    line-height: 39px;
    text-align: center;
    color: #4f74d6;
    font-size: 16px;
    font-weight: 500;
    font-family: "AlibabaPuHuiTi";
  }
}
::v-deep .popover-content {
  background-color: #000;
  .el-table__cell {
    background-color: #000 !important;
  }
}

.first-column {
  display: flex;
  align-items: center;
}

::v-deep .el-loading-mask {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
