// 初始化地图
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getCxwShip } from '@/api/modules/ship'


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


async function initMap(options: any, callback: (marker: any, markerType: string) => void, markCallback) {
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

      map.value.addEventListener('zoomend', () => {
        console.log('zoomend', document.querySelectorAll('.tdt-marker-icon'))
        const icons = document.querySelectorAll('.tdt-marker-icon');
        icons.forEach(icon => {
          const rotate = icon.getAttribute('rotate')
          icon.style.transform = `${icon.style.transform} rotate(${rotate}deg)`;
        });
      });


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
      })
      // 图层改变
      map.value.addEventListener('zoomend', e => {
      })
      cxwShipData.value = await setCXWShip(markCallback)
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
      // setFence(map.value, JSON.parse(res.result.fenceRadius))
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
export { initMap }
