<template>
  <ContentCar class="contetn_left-top" title="本月观豚情况">
    <template #content>
      <div class="relative w-full container">
        <div ref="container" class="w-full h-full absolute pie"></div>
        <div class="absolute top-0 left-0 w-full h-full pie-bg"></div>
        <div class="total-value text-sm text-white">总次数</div>
      </div>
      <div class="legend">
        <div class="flex justify-around items-center">
          <div class="legend-color">
            <div class="legend-icon1"></div>
            <div class="legend-color-item">
              <span class="legend-text">影响施工</span>
              <span class="legend-value">{{ yellowValue }}次</span>
            </div>
          </div>
          <div class="legend-color">
            <div class="legend-icon2"></div>
            <div class="legend-color-item">
              <span class="legend-text">未影响施工</span>
              <span class="legend-value">{{ blueValue }}次</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ContentCar>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import ContentCar from "@/components/contentCar/index.vue";

import { dolphinInfo } from "./api";

const container = ref(null);
let scene, camera, renderer, controls;

const totalValue = ref(0);
const blueValue = ref(0);
const yellowValue = computed(() => totalValue.value - blueValue.value);

const createSmoothHollowDonutSegment = (
  startAngle,
  endAngle,
  innerRadius,
  outerRadius,
  height,
  color,
  radialSegments = 1150
) => {
  const shape = new THREE.Shape();
  const curve = new THREE.EllipseCurve(
    0,
    0,
    outerRadius,
    outerRadius,
    startAngle,
    endAngle,
    false,
    0
  );

  const outerPoints = curve.getPoints(radialSegments);
  shape.moveTo(outerPoints[0].x, outerPoints[0].y);
  outerPoints.forEach((pt) => shape.lineTo(pt.x, pt.y));

  const innerCurve = new THREE.EllipseCurve(
    0,
    0,
    innerRadius,
    innerRadius,
    endAngle,
    startAngle,
    true,
    0
  );

  const innerPoints = innerCurve.getPoints(radialSegments);
  innerPoints.forEach((pt) => shape.lineTo(pt.x, pt.y));
  shape.closePath();

  const extrudeSettings = {
    steps: 2,
    depth: height,
    bevelEnabled: false, //关闭倒角
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 5,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshPhongMaterial({
    color: color,
    shininess: 100,
    specular: 0x111111,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;

  return mesh;
};

const getdolphinInfo = async () => {
  const res = await dolphinInfo();
  if (res.code == 200) {
    totalValue.value = Number(res.result.able) + Number(res.result.unable);
    blueValue.value = Number(res.result.unable);
  }
  init();
};

const init = () => {
  scene = new THREE.Scene();

  // 在创建场景后设置背景色
  scene.background = null; // 浅灰色背景

  camera = new THREE.PerspectiveCamera(
    14,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 4, 7);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  container.value.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 3; // 最小距离
  controls.maxDistance = 20; // 最大距离
  controls.enableRotate = false; //   关闭控制器旋转
  controls.enableZoom = false; // 关闭鼠标滚轴

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  const group = new THREE.Group();

  const blueAngle = (blueValue.value / totalValue.value) * Math.PI * 2;
  const yellowAngle = (yellowValue.value / totalValue.value) * Math.PI * 2;

  const blueSegment = createSmoothHollowDonutSegment(
    (3 * Math.PI) / 2, // 蓝色部分从左上角开始
    (3 * Math.PI) / 2 + blueAngle,
    0.7,
    1,
    0.25,
    0x0263ff
  );

  const yellowSegment = createSmoothHollowDonutSegment(
    (3 * Math.PI) / 2 + blueAngle, // 黄色部分接着蓝色部分开始
    Math.PI * 2 + (3 * Math.PI) / 2,
    0.7,
    1,
    0.4,
    0xeda927
  );
  // 设置大小
  blueSegment.scale.set(1.1, 1.1, 1.1);
  yellowSegment.scale.set(1.1, 1.1, 1.1);
  // 设置往下偏移
  blueSegment.position.set(0, -0.2, 0);
  yellowSegment.position.set(0, -0.2, 0);
  // 显示被盖住的轮廓

  group.add(blueSegment);
  group.add(yellowSegment);

  const loader = new FontLoader();
  loader.load("/static/font/helvetiker_regular.typeface.json", (font) => {
    const totalValueText = totalValue.value.toString();

    // 生成文字几何并居中
    const textGeometry = new TextGeometry(totalValueText, {
      font: font,
      size: 0.5,
      height: 0.1,
    });
    textGeometry.computeBoundingBox();
    textGeometry.center(); // 居中文字

    const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    // 将文字稍微上移一点
    textMesh.position.set(0, 0.3, 0); // 上移到 y = 0.5
    textMesh.lookAt(camera.position);
    group.add(textMesh);

    // 总次数的标题
    // const titleGeometry = new TextGeometry("总次数", {
    //   font: font,
    //   size: 0.2,
    //   height: 0.05,
    // });
    // titleGeometry.computeBoundingBox();
    // titleGeometry.center(); // 居中标题

    // const titleMesh = new THREE.Mesh(titleGeometry, textMaterial);
    // titleGeometry.lookAt(camera.position);
    // titleMesh.position.set(0, 1.5, 0); // 调整位置
    // scene.add(titleMesh);
  });
  scene.add(group);

  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };

  animate();
};

const handleResize = () => {
  if (camera && renderer && container.value) {
    camera.aspect = container.value.clientWidth / container.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  }
};

onMounted(async () => {
  await getdolphinInfo();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (renderer) {
    renderer.dispose();
  }
  if (controls) {
    controls.dispose();
  }
});
</script>

<style scoped lang="scss">
.contetn_left-top {
  font-family: "AlibabaPuHuiTi-2-65-Medium";
  .w-full {
    width: 100%;
  }
  .container {
    width: 100%;
    height: 150px;
    z-index: 10;
  }
  .pie {
    z-index: 10;
  }
  .total-value {
    position: absolute;
    // 剧中展示
    left: 50%;
    transform: translateX(-50%);
    z-index: 11;
    top: 0px;
  }
  .pie-bg {
    background-image: url("@/assets/img/big-data/ditu.png");
    background-size: 45% 70%;
    background-repeat: no-repeat;
    background-position: 50% 100%;
  }
  .legend {
    width: 100%;
    .legend-color {
      display: flex;
      align-items: center;
      .legend-icon1 {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #ffc53d;
      }
      .legend-icon2 {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #1890ff;
      }
      .legend-color-item {
        .legend-text {
          margin-left: 8px;
          margin-right: 15px;
          color: #8cafd8;
        }
        .legend-value {
          color: #fff;
        }
      }
    }
  }
}
</style>
