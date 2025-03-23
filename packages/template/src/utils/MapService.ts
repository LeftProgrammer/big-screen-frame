// 初始化地图
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getCxwShip } from '@/api/modules/ship'
import { projectInfoList, getBaseMapData } from "@/api/modules/index";

const typeMap = {
  outShip: '外',
  inShip: '内',
  alarmShip: '警'
}

//配置项
const type = ref('') //1风场总览2形象进度
const defaultZoom = ref(null)
const map = ref(null)
const cxwShipData = ref([])
const scale = ref(1)
const measureTool = ref(null)
const polygonTool = ref(null)
const customsetMark = ref(false)

const localSearch = ref(null);
const localSearchResult = ref(null);

// 创建一个事件发射器
const eventEmitter = {
  listeners: new Map(),

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  },

  emit(event: string, data?: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback: Function) => callback(data));
    }
  },

  off(event: string, callback?: Function) {
    if (!callback) {
      this.listeners.delete(event);
    } else if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
};

// 导出事件发射器
 const mapEvents = eventEmitter;

async function initMap(options: any, callback: (marker: any, markerType: string) => void, callbackMousemove: (lnglat: any, markerType: string) => void, markCallback: (marker: any, markerType: string) => void) {
  if (!options || !options.mapContainer) {
    ElMessage.error('地图容器未找到！')
    return Promise.reject('地图容器未找到')
  }
  const { mapContainer, lng = 108.76236, lat = 21.44643, zoom = 11, porjectName } = options
  defaultZoom.value = zoom
  try {
    if (window.T) {
      // console.log('地图脚本初始化成功...')
      map.value = new T.Map(mapContainer, {
        projection: 'EPSG:4326' // 使用 WGS 84 坐标系
      })

      //   //创建搜索对象
      const localSearchconfig = {
        pageCapacity: 100,	//每页显示的数量
        onSearchComplete: (result: any) => {
          console.log('接收数据的回调函数接收数据的回调函数', result.getResultType(), result)
          // console.log('result.getArea()',result.getArea())
          localSearchResult.value = result.getSuggests()

        }	//接收数据的回调函数
      };
      nextTick(() => {
        localSearch.value = new T.LocalSearch(map.value, localSearchconfig);
        console.log('localSearch', localSearch)
      })

      //地图缩放监听
      map.value.addEventListener('zoomend', (e) => {
        const icons = document.querySelectorAll('.tdt-marker-icon');
        icons.forEach(icon => {
          const rotate = icon.getAttribute('rotate')
          icon.style.transform = `${icon.style.transform} rotate(${rotate}deg)`;
        });
        zoomChange(map, e.target.RR)
      });

      //鼠标移动
      map.value.addEventListener('mousemove', (e) => {
        // console.log('mousemove', e.lnglat)
        callbackMousemove && callbackMousemove(e.lnglat, 'map')
      })

      // 设置地图中心点和缩放级别
      map.value.centerAndZoom(new T.LngLat(lng, lat), zoom)

      //添加比例尺控件
      const scale = new T.Control.Scale()
      map.value.addControl(scale)
      // 添加缩放控件
      const control = new T.Control.Zoom();
      control.setPosition(T_ANCHOR_BOTTOM_LEFT);
      map.value.addControl(control);

      // 添加地图的点击事件监听器
      map.value.addEventListener('click', event => {
        if (callback) {
          callback(event, 'map')
        }
        if (customsetMark.value) {
          startsetMark(event)
        }
      })
      // 图层改变
      map.value.addEventListener('zoomend', e => {
      })
      cxwShipData.value = await setCXWShip(markCallback)
      await setWindFarm(map.value)
      await getData(map.value)

      return {
        map: map.value,
        shipData: cxwShipData.value
      }
    } else {
      throw new Error('地图脚本未加载')
    }
  } catch (error) {
    throw error
  }
}


/**
   * @description 船讯网船舶
   * @param {*} callback
   * @returns
   */
async function setCXWShip(callback: (marker: any, markerType: string) => void) {
  try {
    const res = await getCxwShip()
    const { success, result } = res
    if (!success) {
      ElMessage.error('获取船舶数据失败！')
      throw new Error('获取船舶数据失败')
    }
    if (result) {
      // callback(result) // 如果需要在请求成功后执行额外的回调函数，可以在此处调用
      console.log('获取船舶数据', result)
      setShipMarks(map.value, res.result.outShip || [], 'outShip', callback)
      setShipMarks(map.value, res.result.inShip || [], 'inShip', callback)
      setShipMarks(map.value, res.result.alarmShip || [], 'alarmShip', callback)
      setFence(map.value, JSON.parse(res.result.fenceRadius))
      return result
    } else {
      return []
    }
  } catch (error) {
    throw error
  }
}

/**
   * @description 船舶标点
   * @param {*} markers
   * @param {*} callback
   */
function setShipMarks(map: any, markers: any[], type: string, callback: (marker: any, markerType: string) => void) {
  console.log('setShipMarks', type)
  markers.forEach(marker => {
    let lng = marker.lon * Math.pow(10, -6)
    let lat = marker.lat * Math.pow(10, -6)
    console.log(import.meta.url, marker.cog, '0000000')
    const iconUrl = new T.Icon({
      iconUrl: new URL(`../assets/img/map/${type}.png`, import.meta.url).href + `?cog=${marker.cog}`,
      iconSize: new T.Point(42, 32), // 图标大小
      iconAnchor: new T.Point(21, 16), // 图标锚点，通常是图标中心
      iconRotation: 111,
    })

    const markerLayer = new T.Marker(new T.LngLat(lng, lat), {
      icon: iconUrl,
    })

    markerLayer.addEventListener('click', () => {
      // 鼠标点击事件
      if (callback) {
        callback({ data: marker, type, item: markerLayer })
      }
    })

    markerLayer.markerType = 'ship'
    markerLayer.shipType = type
    // 创建标记的文本标签
    const label1 = new T.Label({
      offset: new T.Point(-65, 30), // 偏移量，使标签在标记上方显示
      text: marker.name, // 显示标记的名称
      position: new T.LngLat(lng, lat) // 标签的位置
    })
    label1.markerType = 'shipLabel'
    label1.setBorderColor('transparent')
    label1.setFontColor('#fff')
    label1.setBackgroundColor('transparent')


    // 创建标记的文本标签
    const label2 = new T.Label({
      offset: new T.Point(-35, 0), // 偏移量，使标签在标记上方显示
      text: typeMap[type], // 显示标记的名称
      position: new T.LngLat(lng, lat), // 标签的位置
    })
    label2.markerType = 'shipLabel'
    label2.addEventListener('click', () => {
      // 鼠标点击事件
      if (callback) {
        callback({ data: marker, type, item: markerLayer })
      }
    })
    label2.setBorderColor('transparent')
    label2.setFontColor('#fff')
    label2.setBackgroundColor('transparent')

    // 将文本标签添加到地图上
    map.addOverLay(label1)
    map.addOverLay(label2)
    map.addOverLay(markerLayer)
    iconUrl.img.style.transform = ` ${iconUrl.img.style.transform} rotate(${marker.cog}deg)`
    iconUrl.img.setAttribute('rotate', `${marker.cog}`)
  })
}
/**
  * @description 图层改变函数
  * @param {*} zoom 层级 （1-8项目图标，大于8风场围栏，大于9升压站，大于11海缆，大于12风机，大于13风机编号船舶名称，10-12船舶点点图标大于12船舶图标）
  */
function zoomChange(map: any, zoom: number) {

  var overlays = map.value.getOverlays()
  if (zoom < 9) {
    overlays
      .filter(x => x.markerType == 'project' || x.markerType == 'projectName')
      .forEach(x => {
        x.show()
      })
  } else {
    overlays
      .filter(x => x.markerType == 'project' || x.markerType == 'projectName')
      .forEach(x => {
        x.hide()
      })
  }
  if (zoom > 8) {
    overlays
      .filter(x => x.markerType == 'fengchang' || x.markerType == 'weilan')
      .forEach(x => {
        x.show()
      })
  } else {
    overlays
      .filter(x => x.markerType == 'fengchang' || x.markerType == 'weilan')
      .forEach(x => {
        x.hide()
      })
  }
  if (zoom > 9) {
    overlays
      .filter(x => x.markerType == 'shengyazhan')
      .forEach(x => {
        x.show()
      })
  } else {
    overlays
      .filter(x => x.markerType == 'shengyazhan')
      .forEach(x => {
        x.hide()
      })
  }
  if (zoom > 11) {
    overlays
      .filter(x => x.markerType == 'hailan')
      .forEach(x => {
        x.show()
      })
  } else {
    overlays
      .filter(x => x.markerType == 'hailan')
      .forEach(x => {
        x.hide()
      })
  }
  if (zoom > 12) {
    overlays
      .filter(x => x.markerType == 'fengji')
      .forEach(x => {
        x.show()
      })
  } else {
    overlays
      .filter(x => x.markerType == 'fengji')
      .forEach(x => {
        x.hide()
      })
  }
  if (zoom > 13) {
    overlays
      .filter(x => x.markerType == 'fengjiLabel')
      .forEach(x => {
        x.show()
      })
  } else {
    overlays
      .filter(x => x.markerType == 'fengjiLabel')
      .forEach(x => {
        x.hide()
      })
  }

  // 图层改变图标变化
  if (zoom < 13) {
    scale.value = 1
  } else {
    scale.value = Number((1.6 ** Math.abs(zoom - 13)).toFixed(1))
  }
  // 升压站图标自适应
  overlays
    .filter(x => x.markerType == 'shengyazhan')
    .forEach(x => {
      let { iconUrl } = x.getIcon().options
      x.setIcon(
        new T.Icon({
          iconUrl,
          iconSize: new T.Point(32 * scale.value, 32 * scale.value),
          iconAnchor: new T.Point(16 * scale.value, 16 * scale.value)
        })
      )
    })
  // 风机图标自适应
  overlays
    .filter(x => x.markerType == 'fengji')
    .forEach(x => {
      let { iconUrl } = x.getIcon().options
      x.setIcon(
        new T.Icon({
          iconUrl,
          iconSize: new T.Point(50 * scale.value, 50 * scale.value),
          iconAnchor: new T.Point(26 * scale.value, 45 * scale.value)
        })
      )
    })
  // 设置风机船舶label
  overlays
    .filter(x => x.markerType == 'fengjiLabel' || x.markerType == 'shipLabel')
    .forEach(x => {
      let fontSizeScale = zoom > 14 ? 1.6 ** (zoom - 14) : 1
      x.setFontSize(12 * fontSizeScale)
      if (x.markerType == 'fengjiLabel') x.setOffset(new T.Point(-37, 30 * fontSizeScale))
      else x.setOffset(new T.Point(-50, 40 * fontSizeScale))
    })
  // 海缆线自适应
  overlays
    .filter(x => x.markerType == 'hailan')
    .forEach(x => {
      x.setWeight(zoom - 10)
    })
}
/**
 * @description 电子围栏
 * @param {*} fence
 * @param {*} callback
 */
function setFence(map: any, fence: any[]) {
  let points = []
  fence.forEach(x => {
    points.push(new T.LngLat(x[0], x[1]))
  })
  // 开始画线
  const polyline = new T.Polyline(points, {
    color: '#FF7D00',
    weight: 4,
    opacity: 1,
    lineStyle: 'dashed'
  })

  polyline.markerType = 'weilan'
  map.addOverLay(polyline)
}
/**
 * @description 绘制风场
 * @param {*} windFarm
 * @param {*} callback
 */
async function setWindFarm(map: any) {
  const res = await projectInfoList()
  const windFarm = JSON.parse(res.result.records[0].siteRange)
  const polygonConfig = {
    color: '#7599F4',
    weight: 1,
    opacity: 0.1,
    fillColor: '#7599F4',
    fillOpacity: 0.2
  }
  if (Array.isArray(windFarm)) {
    let points = []
    windFarm.forEach(x => {
      points.push(new T.LngLat(x[0], x[1]))
    })
    const Polygon = new T.Polygon(points, polygonConfig)
    Polygon.markerType = 'fengchang'

    map.addOverLay(Polygon)
  }
}

/**
 * @description 获取数据(风机 海缆 升压站)
 */
async function getData(map: any) {
  const res = await getBaseMapData()
  submarineCable(map, res.result.cableList) //海缆
  setFanMarks(map, res.result.fanList) //风机
  setBoosterStation(map, res.result.syzPbsList)
}
/**
  * @description 画海缆线
  * @param {*} callback
  */
function submarineCable(map: any, cableList: any[]) {
  cableList.forEach(item => {
    if (item.point) {
      let json = JSON.parse(item.point)
      let points = []
      if (Array.isArray(json) && json.length >= 2) {
        json.forEach(x => {
          points.push(new T.LngLat(x[0], x[1]))
        })
        // 开始画线
        const polyline = new T.Polyline(points, {
          color: item.dataCableInfo.color || '#F3C978',
          weight: 3,
          opacity: 1,
          lineStyle: 'solid'
        })
        polyline.markerType = 'hailan'
        polyline.isCompleted = item.isCompleted
        polyline.addEventListener('mouseover', e => {
          e.target.setWeight(e.target.getWeight() * 2)
        })
        polyline.addEventListener('mouseout', e => {
          e.target.setWeight(e.target.getWeight() / 2)
        })
        map.addOverLay(polyline)
      }
    }
  })
}

/**
 * @description 风机标点
 * @param {*} markers
 * @param {*} callback
 */
function setFanMarks(map: any, fanList: any[]) {
  fanList.forEach(marker => {
    let point = JSON.parse(marker.point)
    if (Array.isArray(point) && point.length == 2) {
      const markerLayer = new T.Marker(new T.LngLat(point[0], point[1]), {
        icon: new T.Icon({
          iconUrl: `${import.meta.env.VITE_BASE_URL}/sys/common/static/qzhf/${marker.dataFanInfo.installedIcon}`,
          iconSize: new T.Point(50, 50),
          iconAnchor: new T.Point(26, 45),
          iconId: marker.id
        })
      })
      markerLayer.markerType = 'fengji'
      markerLayer.lastProcessIcon = marker.lastProcessIcon
      markerLayer.specificationModel = marker.specificationModel
      markerLayer.installedIcon = marker.dataFanInfo.installedIcon
      markerLayer.addEventListener('mouseover', e => {
        let { iconAnchor, iconId, iconSize, iconUrl } = e.target.getIcon().options
        e.target.setIcon(
          new T.Icon({
            iconId,
            iconUrl,
            iconSize: new T.Point(iconSize.x * 2, iconSize.y * 2),
            iconAnchor: new T.Point(iconAnchor.x * 2, iconAnchor.y * 2)
          })
        )
      })
      markerLayer.addEventListener('mouseout', e => {
        let { iconAnchor, iconId, iconSize, iconUrl } = e.target.getIcon().options
        e.target.setIcon(
          new T.Icon({
            iconId,
            iconUrl,
            iconSize: new T.Point(iconSize.x / 2, iconSize.y / 2),
            iconAnchor: new T.Point(iconAnchor.x / 2, iconAnchor.y / 2)
          })
        )
      })
      // 创建标记的文本标签
      const label = new T.Label({
        offset: new T.Point(-37, 30), // 偏移量，使标签在标记上方显示
        text: marker.name, // 显示标记的名称
        position: new T.LngLat(point[0], point[1]) // 标签的位置
      })

      label.markerType = 'fengjiLabel'
      label.setBorderColor('transparent')
      label.setFontColor('#fff')
      label.setFontSize(12)
      label.setBackgroundColor('transparent')
      // 将文本标签添加到地图上
      map.addOverLay(label)
      map.addOverLay(markerLayer)
      label.hide()
      markerLayer.hide()
    }
  })
}
/**
 * @description 升压站
 * @param {*} callback
 */
function setBoosterStation(map: any, syzPbsList: any[]) {
  syzPbsList.forEach(marker => {
    let point = JSON.parse(marker.point)
    if (Array.isArray(point) && point.length == 2) {
      const markerLayer = new T.Marker(new T.LngLat(point[0], point[1]), {
        zIndexOffset: 1,
        icon: new T.Icon({
          iconUrl: new URL(`../assets/img/map/BoosterStation.png`, import.meta.url).href,
          iconSize: new T.Point(32, 32),
          iconAnchor: new T.Point(16, 16),
          iconId: marker.id
        })
      })
      markerLayer.markerType = 'shengyazhan'
      markerLayer.addEventListener('mouseover', e => {
        let { iconAnchor, iconId, iconSize, iconUrl } = e.target.getIcon().options
        e.target.setIcon(
          new T.Icon({
            iconId,
            iconUrl,
            iconSize: new T.Point(iconSize.x * 2, iconSize.y * 2),
            iconAnchor: new T.Point(iconAnchor.x * 2, iconAnchor.y * 2)
          })
        )
      })
      markerLayer.addEventListener('mouseout', e => {
        let { iconAnchor, iconId, iconSize, iconUrl } = e.target.getIcon().options
        e.target.setIcon(
          new T.Icon({
            iconId,
            iconUrl,
            iconSize: new T.Point(iconSize.x / 2, iconSize.y / 2),
            iconAnchor: new T.Point(iconAnchor.x / 2, iconAnchor.y / 2)
          })
        )
      })
      map.addOverLay(markerLayer)
    }
  })
}


// 修改测距方法
const startMeasure = () => {
  if (!map.value) return;
  console.log('开始测距map', map.value);
  if (measureTool.value) {
    measureTool.value.close();
    measureTool.value = null;
  }
  measureTool.value = new T.PolylineTool(map.value, {
    showLabel: true,
    color: "#de590e",
    weight: 5,
  });
  measureTool.value.open();
  //绘制结束事件
  measureTool.value.addEventListener('draw', (e: any) => {
    console.log('绘制结束', e);
    // 得到绘制的覆盖物
    const line = e.currentPolyline;
    // 关闭绘制
    stopMeasure();
    // 给覆盖物添加 右键事件
    line.addEventListener('contextmenu', (e: any) => {
      // 清除这个覆盖物
      map.value.removeOverLay(line);
    });

    // 触发自定义事件
    eventEmitter.emit('measureComplete', {
      type: 'line',
      overlay: line,
      event: e
    });
  });
};

// 修改结束测距方法
const stopMeasure = () => {
  if (measureTool.value) {
    measureTool.value.close()
    measureTool.value = null
  }
}

// 测面积
const measureArea = () => {
  if (!map.value) return
  if (!polygonTool.value) {
    const polygonToolconfig = {
      showLabel: true,
      color: "#de590e", weight: 3, opacity: 0.5, fillColor: "#FFFFFF", fillOpacity: 0.5
    };
    //创建标注工具对象
    polygonTool.value = new T.PolygonTool(map.value, polygonToolconfig);
  }
  polygonTool.value.open()
  //绘制结束事件
  polygonTool.value.addEventListener('draw', (e: any) => {
    console.log('绘制结束', e)
    closeMeasureArea()
    // 得到绘制的覆盖物
    const polygon = e.currentPolygon
    // 给覆盖物添加 右键事件
    polygon.addEventListener('contextmenu', (e: any) => {
      // 清除这个覆盖物
      map.value.removeOverLay(polygon)
    })
    // 触发自定义事件
    eventEmitter.emit('measureAreaComplete', {
      type: 'polygon',
      overlay: polygon,
      event: e
    });
  })
}

// 关闭绘制面积
const closeMeasureArea = () => {
  if (polygonTool.value) {
    polygonTool.value.close()
    polygonTool.value = null
  }
}


// 
// 鼠标点击标点
const startsetMark = (e: UIEvent) => {
  const marker = new T.Marker(e.lnglat, {
    icon: new T.Icon({
      iconUrl: new URL(`../assets/img/map/mark.png`, import.meta.url).href,
      iconSize: new T.Point(32, 32),
      iconAnchor: new T.Point(16, 16),
    })
  })
  map.value.addOverLay(marker)
  // 点位添加右键事件  清除该点位
  marker.addEventListener('contextmenu', (e: any) => {
    map.value.removeOverLay(marker)
  })
}
// 标点开关
const setMarkStatus = (status: boolean) => {
  customsetMark.value = status
}

export { initMap, startMeasure, stopMeasure, measureArea, closeMeasureArea, setMarkStatus, localSearchResult, localSearch, mapEvents }
