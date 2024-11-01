<template>
  <div ref="sceneContainer" class="scene-container">
    <div ref="labelContainer" class="label-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

import { Water } from "three/examples/jsm/objects/Water";
import { Sky } from "three/addons/objects/Sky.js";

import { projectInfo, getCablePress } from "./api";
import gsap from "gsap";
// import cable from "./hailan";
// import fanList from "./fanList";
import syz from "./syz";

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

// DOM引用，用于将Three.js渲染的内容添加到DOM中
const sceneContainer = ref(null);
const fanList = ref([]);
const cable = ref([]);
const cableProgress = ref([]); //海缆工序
// 设置模型状态
const setModelState = (object, fanData, i) => {
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
  }
};


// 场景初始化
const sceneInit = (scene) => {
  // 在创建场景后设置背景色
  scene.background = null; // 浅灰色背景
  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // 添加平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 50, 0);
  scene.add(directionalLight);

  // 添加更多的光源
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(hemisphereLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(0, 50, 0);
  scene.add(pointLight);
  // 添加网格辅助线
  // const gridHelper = new THREE.GridHelper(1000, 100, 0x888888, 0x888888);
  // scene.add(gridHelper);

  // 添加坐标轴辅助线
  // const axesHelper = new THREE.AxesHelper(1000);
  // scene.add(axesHelper);
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

onMounted(async () => {
  await getprojectInfo();
  await getCablePressData();

  const longitudeScale = 200; // 经度缩放比例
  const latitudeScale = 200; // 纬度缩放比例

  const scaleFactor = 10; // 将 0.5 改为 10 或更大的值，如 20, 50 等

  // 偏移量
  const offsetX = 28.2;
  const offsetY = 0;
  const offsetZ = -49.5;

  // 获取升压站的经纬度
  const syzLngLat = JSON.parse(syz.point);
  const SYZ_LONGITUDE = syzLngLat[0];
  const SYZ_LATITUDE = syzLngLat[1];

  // 创建Three.js场景
  const scene = new THREE.Scene();
  scene.value = scene;
  // 监听
  scene.value.addEventListener("click", () => {
    console.log("监听");
  });

  sceneInit(scene);

  // 设置相机
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // 创建WebGL渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true, // 设置透明
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  // 将渲染器的DOM元素添加到组件中
  sceneContainer.value.appendChild(renderer.domElement);
  renderer.setClearColor(0x000000, 0); // 设置清除色为黑色，但完全透明

  // 添加轨道控制器（允许用户拖动场景）
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 平滑的拖动效果
  controls.dampingFactor = 0.5; // 调整平滑因子
  controls.enablePan = true; // 启用平移（左右拖动）
  controls.enableRotate = true; // 启用旋转
  controls.enableZoom = true; // 启用缩放
  controls.panSpeed = 0.5; // 调整平移速度
  controls.rotateSpeed = 0.5; // 调整旋转速度
  controls.zoomSpeed = 0.5; // 调整缩放速度
  controls.maxPolarAngle = Math.PI * 0.495; // 限制相机仰角，使其不能看到水平面以下
  controls.minPolarAngle = 0; // 限制相机最小仰角为0，即不能从下方观察

  controls.update();
  // 设置鼠标按住移动模型

  // 初始化风机模型回调函数
  const initFanModelCallback = (fanobj) => {
    const fontLoader = new FontLoader();
    fontLoader.load("/static/font/helvetiker_regular.typeface.json", (font) => {
      for (let i = 0; i < fanList.value.length; i++) {
        const fanData = fanList.value[i];
        if (fanData.fanSection == "0") {
          const turbine = fanobj.clone();
          const fan = JSON.parse(fanList.value[i].point);
          const position = latLngToVector3(fan[1], fan[0]);
          position.x += offsetX;
          position.y += offsetY; // 增加 Y 轴偏移，使风机"站"在地面上
          position.z += offsetZ;

          turbine.position.copy(position);
          turbine.userData.fanData = fanData; // 将风机数据存储在userData中
          // 设置模型状态
          setModelState(turbine, fanData, i);
          turbine.visible = true; // 确保模型可见
          turbine.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.visible = true; // 确保每个子网格都是可见的
            }
          });
          scene.add(turbine);

          // 创建文本几何体
          const textGeometry = new TextGeometry(`${fanList.value[i].name}`, {
            font: font,
            size: 2,
            height: 1,
          });

          const textMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
          });
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);

          // 将文本位置设置在风机上方
          textMesh.position.set(position.x - 3, position.y + 25, position.z);

          // 使文本始终面向相机
          textMesh.lookAt(camera.position);

          scene.add(textMesh);
        }
      }
    });
  };

  // 加载风机模型
  const initFanModel = (callback) => {
    console.log("initFanModel");
    const loader = new OBJLoader();
    loader.load(
      "/static/threeModel/fan.obj",
      (object) => {
        if (object) {
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
          base.position.set(0, 0, 0);
          base.rotation.set(Math.PI / 2, 0, 0); // 旋转180度使面朝下
          object.add(base);
          callback(object);
        } else {
          console.error("模型加载失败：object 为 null");
        }
      },
      undefined,
      function (error) {
        console.error("加载错误:", error);
      }
    );
  };

  // 加载升压模型
  function initszyModel() {
    const loader = new OBJLoader();
    // 真TMD坑 这个静态资源需要放在pblic下
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
          console.error("模型加载失败：object 为 null");
        }
      },
      undefined,
      function (error) {
        console.error("加载错误:", error);
      }
    );
  }

  // 修改经纬度转换函数
  function latLngToVector3(lat, lng) {
    const x = (lng - SYZ_LONGITUDE) * longitudeScale * scaleFactor;
    const z = -(lat - SYZ_LATITUDE) * latitudeScale * scaleFactor;
    const randomOffset = 1;
    return new THREE.Vector3(x + randomOffset, 0, z + randomOffset);
  }

  // 从升压站连接到每个风机
  const createBranchFromBoosterStation = () => {
    // 取出所有海缆线
    const cables = cable.value;
    console.log("cables", cables);
    // 遍历所有海缆线
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
      wireframe: wireframe, // 是否显示为线框，由外部变量控制
    });

    const path = new THREE.CatmullRomCurve3(vectors);

    const radius = 0.5;
    const tubularSegments = 10;
    const geometry = new THREE.TubeGeometry(path, tubularSegments, radius);

    const tube = new THREE.Mesh(geometry, material);
    scene.add(tube);
  };

  let water;
  const sky = new Sky();
  // 初始化太阳向量
  let sun = new THREE.Vector3(0, 5, 0).normalize().multiplyScalar(10000);
  const seaBackground = () => {
    // Water
    // 创建一个更大的水面几何体，确保视野范围内看不到边缘
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "static/threeModel/waternormals.jpg",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined,
    });

    water.rotation.x = -Math.PI / 2;

    scene.add(water);
  };

  const setSkyBox = () => {
    sky.scale.setScalar(10000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;

    skyUniforms["turbidity"].value = 10;
    skyUniforms["rayleigh"].value = 2;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;
  };

  // 太阳参数
  const parameters = {
    elevation: 4,
    azimuth: 180,
  };

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const sceneEnv = new THREE.Scene();
  let renderTarget;

  // 更新太阳位置函数
  function updateSun() {
    // 将太阳高度角和方位角转换为弧度
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation); // 高度角(elevation)转换为天顶角(phi)
    const theta = THREE.MathUtils.degToRad(parameters.azimuth); // 方位角转换为弧度

    // 根据球坐标设置太阳位置，增加太阳距离到1000
    sun.setFromSphericalCoords(1000, phi, theta); // 将半径从1增加到1000，使太阳更远

    // 更新天空和水面的太阳相关参数
    sky.material.uniforms["sunPosition"].value.copy(sun); // 设置天空的太阳位置
    water.material.uniforms["sunDirection"].value.copy(sun).normalize(); // 设置水面的太阳方向(归一化)

    // 更新环境贴图
    if (renderTarget !== undefined) renderTarget.dispose(); // 如果已存在renderTarget则释放
    sceneEnv.add(sky); // 将天空添加到临时场景
    renderTarget = pmremGenerator.fromScene(sceneEnv); // 生成预过滤的环境贴图
    scene.add(sky); // 将天空添加回主场景
    scene.environment = renderTarget.texture; // 设置场景的环境贴图
  }

  camera.position.set(600, 600, 600); // 增加相机距离

  // 创建入场动画函数
  const createEntranceAnimation = () => {
    initszyModel();
    initFanModel(initFanModelCallback);
    createBranchFromBoosterStation();
    setSkyBox();
    seaBackground();
    updateSun();
    gsap.to(camera.position, {
      z: 100, // 将相机 z 位置平滑地移动到接近模型的位置
      x: 20,
      y: 100,
      fov: 35,
      duration: 3, // 动画持续 2 秒
      ease: "power2.out",
      onUpdate: () => {
        camera.lookAt(scene.position); // 保持相机视角对准模型
      },
    });
  };
  createEntranceAnimation();

  // 调整相机位置
  // camera.fov = 2; // 调整视野角度
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    // // 更新所有文本标签，使其始终面向相机
    scene.children.forEach((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.geometry instanceof TextGeometry
      ) {
        child.lookAt(camera.position);
      }
    });
    water.material.uniforms["time"].value += 2.0 / 60.0;
    renderer.render(scene, camera);
  };

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  //鼠标双击触发的方法
  const onClick = (event) => {
    // 计算鼠标在标准化设备坐标中的位置
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 使用相机和鼠标位置更新拾取射线
    raycaster.setFromCamera(mouse, camera);

    // 计算与拾取射线相交的对象，递归检查子对象
    const intersects = raycaster.intersectObjects(scene.children, true);

    console.log("intersects", intersects);
    if (intersects.length > 0) {
      // 获取第一个相交的对象
      const intersectedObject = intersects[0].object;

      // 改变颜色或其他处理
      intersectedObject.material.color.set(0xff0000);

      // 检查相交的对象是否是风机
      if (intersectedObject.userData.fanData) {
        console.log("点击了风机:", intersectedObject.userData.fanData);
        // 这里可以添加风机点击的逻辑
      } else {
        console.log("点击了对象:", intersectedObject);
      }
    }
  };

  // window.addEventListener("click", onClick, false);

  animate(); // 启动动画循环
  // 处理窗口调整大小
  window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
});

// 页面卸载 关闭所有的模型
onBeforeUnmount(() => {
  // scene.value.clear();
  // this.renderer.dispose();
  // this.renderer.forceContextLoss();
  // this.renderer.content = null;
  // // cancelAnimationFrame(animationID) // 去除animationFrame
  // const gl = this.renderer.domElement.getContext("webgl");
  // gl && gl.getExtension("WEBGL_lose_context").loseContext();
  // scene.remove(sky);
  // scene.remove(water);
});
</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
