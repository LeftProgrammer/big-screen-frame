import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const initThreeScene = (container) => {
    // 场景创建
    const scene = new THREE.Scene();

    // 在创建场景后设置背景色
    scene.background = null; // 浅灰色背景
    // 添加环境
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


    // 相机设置
    const camera = new THREE.PerspectiveCamera(
        75,
        container.offsetWidth / container.offsetHeight,
        0.1,
        1000
    );

    // 渲染器设置
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    // 初始化基本配置
    renderer.setSize(container.clientWidth, container.clientHeight);
    // debugger
    renderer.setPixelRatio(window.devicePixelRatio);

    // 添加到容器
    container.appendChild(renderer.domElement);

    // 控制器设置
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // 平滑的拖动效果
    controls.dampingFactor = 0.5; // 整平滑因子
    controls.enablePan = true; // 启用平移（左右拖动）
    controls.enableRotate = true; // 启用旋转
    controls.enableZoom = true; // 启用缩放
    controls.panSpeed = 0.5; // 调整平移速度
    controls.rotateSpeed = 0.5; // 调整旋转速度
    controls.zoomSpeed = 1; // 调整缩放速度
    controls.maxPolarAngle = Math.PI * 0.495; // 限制相机仰角，使其不能看到水平面以下
    controls.minPolarAngle = 0; // 限制相机最小角为0，即不能从下方观察

    controls.update();

    return { scene, camera, renderer, controls };
};
