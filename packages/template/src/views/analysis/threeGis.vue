<template>
  <div ref="sceneContainer" id="sceneContainer" class="scene-container">
    <div
      :class="{ 'show-loading': !showLoading }"
      class="model-loading-progress"
      style="
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 9999;
        width: 50%;
        height: 10px;
        transform: translate(-50%, -50%);
      "
    >
      <!-- <el-progress :percentage="modelLoadingProgress" /> -->
    </div>
    <div
      v-if="showCard"
      class="absolute"
      style="
        top: 50%;
        left: 50%;
        z-index: 9999;
        transform: translate(-50%, -50%);
      "
    >
      <Car :fanData="selectedFanData" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount, computed } from "vue";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import Car from "./car.vue";

// 导入需要的插件
import gsap from "gsap";
import syz from "./syz";

import { ElMessage } from "element-plus";

import { projectInfo, getCablePress } from "./api";
import { schedule } from "../DataView/constructionProgress/api";

import {
  initSkyAndWater,
  initComposer,
  onMouseMove,
  setOutline,
} from "./utils/initUtils";
import { initThreeScene } from "./utils/sceneInit";
const matchName = {
  steelPipe: {
    name: "zhuangji",
    color: 0x547fe5,
  }, // 钢管桩锤击完成
  cage: {
    name: "taolong",
    color: 0x547fe5,
  }, // 套笼安装完成
  basalGanglia: {
    name: "tong01",
    color: 0xffffff,
  }, // 底节塔筒吊装完成
  Section2Tower: {
    name: "tong02",
    color: 0xffffff,
  }, // 第二节塔筒吊装完成
  Section3Tower: {
    name: "tong03",
    color: 0xffffff,
  }, // 机舱
  host: {
    name: "jicang",
    color: 0x547fe5,
  }, // 轴流风机安装完成
  firstBlade: {
    name: "shanye01",
    color: 0xffffff,
  }, // 第一支叶片安装完成
  secondBlade: {
    name: "shanye02",
    color: 0xffffff,
  }, // 第二支叶片安装完成
  thirdBlade: {
    name: "shanye03",
    color: 0xffffff,
  }, // 第三支叶片安装完成
};

const longitudeScale = 200; // 经度缩放比例
const latitudeScale = 200; // 纬度放比例

const scaleFactor = 10; // 将 0.5 改为 10 或更大的值，如 20, 50 等

// 偏移量
const offsetX = 28.2;
const offsetY = 0;
const offsetZ = -49.5;

// 获取升压站的经纬度
const syzLngLat = JSON.parse(syz.point);
const SYZ_LONGITUDE = syzLngLat[0];
const SYZ_LATITUDE = syzLngLat[1];

//模型加载进度
const modelLoadingProgress = ref(0);

// ======================threejs 全局变量 初始化==============================
// 全局变量 初始化 这里不能使用vue3的响应式  threejs 内部的数据是常量不能挂在到proxy
var renderer = null; // 渲染器
var scene = null; // 场景
var camera = null; // 相机
var sky = null; // 天空
var water = null; // 水
var composer = null; // 合成器
var outlinePass = null; // 轮廓线
var controls = null; // 控制器
// ======================end==============================

// DOM引用，用于将Three.js渲染的内容添加到DOM中
const sceneContainer = ref(null);
const fanList = ref([]);
const cable = ref([]);
const cableProgress = ref([]); //海缆工序

// 使用计算器属性 根据 modelLoadingProgress 计算 showLoading
const showLoading = computed(() => {
  if (modelLoadingProgress.value == 100) {
    return false;
  }
  return true;
});
// 设置模型状态
const setModelState = (object, fanData, i) => {
  // console.log("setModelState", object, fanData, i);
  if (object) {
    const modelChild = object.children;
    // 根据风机型号设置模型状态

    if (fanData.completedProcess.length > 0) {
      const completedProcess = fanData.completedProcess;
      completedProcess.forEach((process) => {
        // process.file &&
        if (process.modelSign) {
          const model_signName = matchName[process.modelSign]?.name;
          if (model_signName) {
            // 特殊处理
            if (model_signName == "tong03") {
              // 生成新的材质
              const newMaterial = new THREE.MeshPhongMaterial({
                color: matchName[process.modelSign]?.color || 0xffffff,
                transparent: false,
                opacity: 1,
                wireframe: false,
              });
              const child = modelChild.find((child) => child.name === "tong04");
              child.material = newMaterial;
            }

            if (model_signName == "jicang") {
              // 生成新的材质
              const newMaterial = new THREE.MeshPhongMaterial({
                color: matchName[process.modelSign]?.color || 0xffffff,
                transparent: false,
                opacity: 1,
                wireframe: false,
              });
              const child = modelChild.find((child) => child.name === "zhou");
              child.material = newMaterial;
            }

            const child = modelChild.find(
              (child) => child.name === model_signName
            );

            // console.log("model_signName", modelChild, model_signName);
            // console.log("child", child);
            // 生成新的材质
            const newMaterial = new THREE.MeshPhongMaterial({
              color: matchName[process.modelSign]?.color || 0xffffff,
              transparent: false,
              opacity: 1,
              wireframe: false,
            });
            child.material = newMaterial;
          }
        }
      });
    }
    // 风机状态  已完成2 进行中1  未开始0
    if (fanData.constructionStatus == 2) {
      // 播放动画
      const mixer = new THREE.AnimationMixer(object);
      const action = mixer.clipAction(object.animations[0]);
      action.play();
      mixers.value.push(mixer);
    }
    if (fanData.constructionStatus == 1) {
      // 设置动画 轮廓线
      // 设置的模型额外字段
      object.userData.lineHeight = true;
      console.log("object", object);
      outlinePass.selectedObjects.push(object);
      renderer.domElement.style.cursor = "pointer";
    }
  }
};

// 请求项目信息
const getprojectInfo = async () => {
  const res = await projectInfo();
  if (res.code == 200) {
    console.log("projectInfoprojectInfoprojectInfo", res);
    fanList.value = res.result.fjList;
    cable.value = res.result.hlList;
  }
};

// 请求所有得海缆工序
const getCablePressData = async () => {
  const cableParam = {
    type: "B04A02A01",
  };
  const cableRes = await getCablePress(cableParam);
  if (cableRes.code == 200) {
    cableProgress.value = cableRes.result.records;
  }
};

// 在 script setup 顶部添加动画混合器数组
const mixers = ref([]);
let clock = new THREE.Clock();
const canvas = ref(null);
const sceneWidth = ref(0);
const sceneHeight = ref(0);

// 添加新的响应式变量
const showCard = ref(false);
const selectedFanData = ref(null);

// 修改经纬度转换函数
function latLngToVector3(lat, lng) {
  const x = (lng - SYZ_LONGITUDE) * longitudeScale * scaleFactor;
  const z = -(lat - SYZ_LATITUDE) * latitudeScale * scaleFactor;
  const randomOffset = 1;
  return new THREE.Vector3(x + randomOffset, 0, z + randomOffset);
}

// 修改 showFanCard 函数
const showFanCard = async (modelData) => {
  console.log("showFanCard", modelData);
  if (!modelData) {
    showCard.value = false;
    return;
  }
  // 请求 数据
  const { code, result } = await schedule({ id: modelData.id });
  if (code === 200 && result) {
    const data = { ...modelData, ...result };
    selectedFanData.value = data;
  } else {
    showCard.value = false;
    ElMessage.warning("暂未施工");
    selectedFanData.value = modelData;
    return;
  }
  showCard.value = true;
};

// 模型顺序
const modelList = ref([
  "zhuangji",
  "taolong",
  "tong01",
  "tong02",
  "tong03",
  "tong04",
  "jicang",
  "zhou",
  "shanye01",
  "shanye02",
  "shanye03",
]);
// 设置动画
function initModel(startFanModel) {
  // 按照 modelList 对 children 进行排序
  const sortedChildren = [];
  // 设置高亮属性
  startFanModel.userData.lineHeight = true;
  outlinePass.selectedObjects.push(startFanModel);
  // outlinePass.pulsePeriod = 0.5;
  scene.add(startFanModel);
  modelList.value.forEach((modelName) => {
    const child = startFanModel.children.find((child) => child.name === modelName);
    if (child) {
      sortedChildren.push(child);
    }
  });

  let totalChildren = sortedChildren.length;
  let completedAnimations = 0;

  sortedChildren.forEach((child, index) => {
    // 初始时隐藏所有构件
    child.visible = false;

    // 使用setTimeout依次显示每个构件
    setTimeout(() => {
      child.visible = true;
      child.material.color?.set(0x293b5d);

      // 可以添加一个简单的缩放动画
      child.scale.set(0.1, 0.1, 0.1);
      const startScale = { x: 0.1, y: 0.1, z: 0.1 };
      const endScale = { x: 1, y: 1, z: 1 };
      const duration = 500;
      const startTime = Date.now();

      function animate() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Simple elastic easing
        const t = progress;
        const ts = t * t;
        const tc = ts * t;
        const ease =
          33 * tc * ts + -106 * ts * ts + 126 * tc + -67 * ts + 15 * t;

        child.scale.x = startScale.x + (endScale.x - startScale.x) * ease;
        child.scale.y = startScale.y + (endScale.y - startScale.y) * ease;
        child.scale.z = startScale.z + (endScale.z - startScale.z) * ease;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          completedAnimations++;
          // 当所有动画完成时执行入场动画
          if (completedAnimations === totalChildren) {
            // 销毁 startFanModel
            scene.remove(startFanModel);
            createEntranceAnimation();
          }
        }
      }
      animate();
    }, index * 200); // 每200毫秒显示一个构件
  });
}

// 加载风机模型
const initFanModel = (callback) => {
  console.log("initFanModel");
  const loader = new FBXLoader();
  loader.load(
    "/static/threeModel/fan.FBX",
    (object) => {
      if (object) {
        const startFanModel = object.clone();

        // 设置点位   - x:-50向左偏移50个单位, y:100向上偏移100个单位, z:200向前偏移200个单位
        startFanModel.position.set(300, 300, 300); // 调整位置到图中所示的位置
        startFanModel.scale.set(3, 3, 3); // 缩小模型比例以匹配图中大小
        // 设置沿X轴稍微往后翻转一点
        startFanModel.rotation.x = 0.4 * Math.PI;
        startFanModel.rotation.y = 1.1 * Math.PI;
        startFanModel.rotation.z = 1.1 * Math.PI; // Subtract 10 degrees in radians
        startFanModel.userData.lineHeight = true;
        initModel(startFanModel);

        console.log("风机模型加载成功", object);
        // 调整风机模型的尺寸
        object.scale.set(0.1, 0.1, 0.1);
        // 将整个模型旋转，使其垂直立起
        object.rotation.set(-Math.PI / 2, 0, 0); // 旋转90度，使风机垂直

        object.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh) {
            // 修改 child.name 名称
            // child.name = matchName[child.name]?.name || child.name;
            const defaultMaterial = new THREE.MeshPhongMaterial({
              color: 0xffffff,
              wireframe: true, // 仅显示线框
              transparent: true,
              opacity: 0.05,
            });
            child.material = defaultMaterial;
          }
        });

        // 创建一个底部半径为10的饼状底座，面朝上
        const baseGeometry = new THREE.CylinderGeometry(10, 10, 10, 64);
        const baseMaterial = new THREE.MeshPhongMaterial({
          color: 0x547fe5,
          transparent: true,
          opacity: 0.8,
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);

        // 将底座放置在风机正下方的中心位置
        base.position.set(-8, 0, -115); // z坐标使用包围的底部
        base.rotation.set(Math.PI / 2, 0, 0);

        object.add(base);

        // 调用模型旋转函数
        callback(object);
      } else {
        console.error("模型加载失败：object 为 null");
      }
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      modelLoadingProgress.value = (xhr.loaded / xhr.total) * 100;
    },
    (error) => {
      console.error("加载错误:", error);
    }
  );
};

// 创建海缆线函数
const createCableLine = (vectors, cable) => {
  // 创建一个组来包含所有的对象
  // const group = new THREE.Group();

  let transparent = true;
  let wireframe = true;
  let opacity = 0.3;
  let color = 0xffffff;
  if (
    Array.isArray(cable.completedProcess) &&
    cableProgress.value.length == cable.completedProcess.length
  ) {
    transparent = false;
    wireframe = false;
    opacity = 1;
    color = 0x0000ff;
  }

  // MeshPhongMaterial的属性说明:
  const material = new THREE.MeshPhongMaterial({
    color: color, // 材质的颜色，这里是蓝色
    shininess: 30, // 材质的光泽度，控制高光的亮度
    specular: 0x111111, // 材质的高光颜色
    transparent: transparent, // 是否透明，由外部变量控制
    opacity: opacity, // 不透明度，由外部变量控制
    wireframe: wireframe, // 是否显示线框，由外部变量控制
  });

  const path = new THREE.CatmullRomCurve3(vectors);

  const radius = 0.5;
  const tubularSegments = 10;
  const geometry = new THREE.TubeGeometry(path, tubularSegments, radius);

  const tube = new THREE.Mesh(geometry, material);

  tube.name = "hailan";
  // 设置存入数据
  tube.userData.modelData = cable;
  scene.add(tube);
};

// 加载升压模型
function initszyModel() {
  const loader = new OBJLoader();
  // 真TMD坑 这个静态资需要放在pblic下
  loader.load(
    "/static/threeModel/syz.obj", // 添加前导斜杠
    (object) => {
      if (object) {
        console.log("升压站模型加载成功", object);
        //   设置大小
        object.scale.set(0.2, 0.2, 0.2); // 减小升压站模型尺寸
        //   设置旋转角度
        // object.rotation.set(300, 0, 0);

        const position = latLngToVector3(SYZ_LATITUDE, SYZ_LONGITUDE);
        position.x += offsetX - 25;
        position.y += offsetY;
        position.z += offsetZ - 10;

        object.position.copy(position);
        // 修改模型的背景颜色
        // console.log("升压站", object);
        object.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh) {
            // console.log("构件", index, child);
            if (index == 0) {
              child.material = new THREE.MeshPhongMaterial({
                color: 0x1f5330,
              });
            }
            if (index == 1) {
              // child.material.color.set(0x850f11); //red
              child.material = new THREE.MeshPhongMaterial({
                color: 0x98742a,
              });
            }
          }
        });
        scene.add(object);
      } else {
        console.error("模型加载失败object 为 null");
      }
    },
    undefined,
    function (error) {
      console.error("加载错误:", error);
    }
  );
}

// 从升压站连接到每个风机
const createBranchFromBoosterStation = () => {
  // 取出所有海缆线
  const cables = cable.value;
  console.log("cables", cables);
  // 遍历所有海缆
  cables.forEach((cable) => {
    // 取出海缆线的经过点  points是一个数组 里面包含多个点位
    const points = JSON.parse(cable.point);
    // 将多个点位转换为Vector3对象
    const vectors = points.map((point) => {
      const vector = latLngToVector3(point[1], point[0]);
      vector.x += offsetX;
      vector.y += 0;
      vector.z += offsetZ;
      return vector;
    });
    // 创建海缆线
    createCableLine(vectors, cable);
  });
};

// 初始化风机模型回调函数
const initFanModelCallback = (fanobj) => {
  const fontLoader = new FontLoader();
  fontLoader.load("/static/font/helvetiker_regular.typeface.json", (font) => {
    // 创建一个 Promise 数组来跟踪所有风机的初始化
    const initPromises = [];

    for (let i = 0; i < fanList.value.length; i++) {
      const fanData = fanList.value[i];

      if (fanData.fanSection == "0") {
        const turbine = fanobj.clone(true);
        turbine.animations = fanobj.animations.map((anim) => anim.clone());

        const fan = JSON.parse(fanList.value[i].point);
        const position = latLngToVector3(fan[1], fan[0]);
        position.x += offsetX + 0.75;
        position.y += offsetY + 11.5;
        position.z += offsetZ + 0;

        turbine.position.copy(position);
        turbine.userData.modelData = fanData;
        setModelState(turbine, fanData, i);
        turbine.visible = true;

        turbine.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.material.visible = true;
          }
        });

        scene.add(turbine);

        const textGeometry = new TextGeometry(`${fanList.value[i].name}`, {
          font: font,
          size: 2,
          height: 1,
        });

        const textMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.position.set(position.x - 3, position.y + 10, position.z);
        textMesh.lookAt(camera.position);
        scene.add(textMesh);
      }
    }
  });
};

// 创建入场动画函数
const createEntranceAnimation = () => {
  console.log("创建入场动画函数");

  // 保存初始 FOV
  const initialFOV = camera.fov;
  const targetFOV = 35;

  gsap.to(camera.position, {
    z: 100,
    x: 20,
    y: 100,
    duration: 3,
    ease: "power2.out",
    onUpdate: () => {
      camera.lookAt(scene.position);
    },
  });

  // 单独处理 FOV 的动画
  // gsap.to(
  //   {},
  //   {
  //     duration: 3,
  //     ease: "power2.out",
  //     onUpdate: function () {
  //       const progress = this.progress();
  //       camera.fov = initialFOV + (targetFOV - initialFOV) * progress;
  //       camera.updateProjectionMatrix(); // 重要：更新 FOV 后需要更新投影矩阵
  //     },
  //   }
  // );
};

// 初始化内容
const initContent = () => {
  canvas.value = document.getElementById("sceneContainer");
  sceneWidth.value = canvas.value.clientWidth;
  sceneHeight.value = canvas.value.clientHeight;

  const sceneinfo = initThreeScene(canvas.value);

  scene = sceneinfo.scene;
  camera = sceneinfo.camera;

  renderer = sceneinfo.renderer;
  controls = sceneinfo.controls;

  const initComposerInfo = initComposer(
    scene,
    camera,
    renderer,
    sceneWidth.value,
    sceneHeight.value
  );
  composer = initComposerInfo.composer;
  outlinePass = initComposerInfo.outlinePass;

  camera.position.set(600, 600, 600); // 增加相机距离

  // 生成太阳 天空
  const { skyObject, waterObject, updateSunFunction } = initSkyAndWater(
    scene,
    renderer
  );
  sky = skyObject;
  water = waterObject;
  // updateSun = updateSunFunction;
};

onMounted(async () => {
  await getprojectInfo();
  await getCablePressData();
  // 获取场景容器
  initContent();

  // 加载升压站模型
  initszyModel();
  // 加载风机模型
  initFanModel(initFanModelCallback);
  // 创建海缆线
  createBranchFromBoosterStation();
  // 调整相机位置
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();

    // 更新动画
    const delta = clock.getDelta();
    mixers.value.forEach((mixer) => mixer.update(delta));

    scene.children.forEach((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.geometry instanceof TextGeometry
      ) {
        // 计算从相机到物体的方向向量
        const direction = new THREE.Vector3();
        direction.subVectors(camera.position, child.position);

        // 使用 lookAt 让物体面向相机
        child.lookAt(camera.position);
      }
    });

    water.material.uniforms["time"].value += 2.0 / 60.0;
    // renderer.render(scene, camera);
    composer.render();
  };
  animate(); // 启动动画循环
  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();

  //鼠标双击触发的方法
  const onClick = (event) => {
    event.preventDefault();
    // 获取canvas的边界框
    const rect = canvas.value.getBoundingClientRect();

    // 计算鼠标在canvas中的相对位置
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // 更新射线
    raycaster.setFromCamera(mouse, camera);

    // 获取所有可点击对象
    const clickableObjects = scene.children.filter(
      (obj) =>
        obj.userData.modelData || // 包含模型数据的对象
        (obj instanceof THREE.Group &&
          obj.children.some((child) => child.userData.modelData)) // 包含模型数据的组
    );

    // 检测射线相交
    const intersects = raycaster.intersectObjects(clickableObjects, true);
    console.log("intersects", intersects);
    if (intersects.length > 0) {
      // 查找第一个有效的相交对象
      const intersection = intersects.find((item) => {
        const object = item.object;
        return (
          object.name.includes("hailan") ||
          object.parent?.name.includes("fengji")
        );
      });

      if (!intersection) {
        showCard.value = false;
        return;
      }
      // 说明选中了 然后给选的模型数据
      console.log("说明选中了", intersection);
      // 将intersection  gao'liang

      let modelData = null;
      const object = intersection.object;

      if (object.name.includes("hailan")) {
        modelData = object.userData.modelData;
        modelData.modelType = "海缆";
      } else if (object.parent?.name.includes("fengji")) {
        modelData = object.parent.userData.modelData;
        modelData.modelType = "风机";
      }

      if (modelData) {
        showFanCard(modelData);
      }
    } else {
      showCard.value = false;
    }
  };
  window.addEventListener("click", onClick, false);
  window.addEventListener(
    "mousemove",
    (event) => onMouseMove(event, scene, camera, renderer, outlinePass),
    false
  );
});

// 页面卸载 关闭所有的模型
onBeforeUnmount(() => {
  mixers.value.forEach((mixer) => mixer.stopAllAction());
  mixers.value = [];
  scene.remove(sky);
  scene.remove(water);
  scene.clear();
  renderer.dispose();
  // renderer.forceContextLoss();
  renderer.content = null;
  // // // cancelAnimationFrame(animationID) // 去除animationFrame
  // 在组件卸载时释放WebGL上下文和资源
  // 1. 获取WebGL上下文
  if (renderer && renderer.domElement) {
    // const gl = renderer.domElement.getContext("webgl2") || renderer.domElement.getContext("webgl");
    // if (gl) {
    //   // 2. 通知GPU失去上下文,释放GPU资源
    //   gl.getExtension('WEBGL_lose_context')?.loseContext();
    // }
    // 3. 清除DOM引用,帮助垃圾回收
    // renderer.domElement = null;
  }
});
</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 100%;
}
.show-loading {
  opacity: 0;
  transition: opacity 3s ease;
  /* display: none; */
}
</style>
