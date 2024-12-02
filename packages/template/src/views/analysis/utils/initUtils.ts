import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { Water } from 'three/examples/jsm/objects/Water';

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";


var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

export const initSkyAndWater = (scene: THREE.Scene, renderer: THREE.WebGLRenderer) => {
    let water: Water;
    const sky = new Sky();
    let sun = new THREE.Vector3(0, 5, 0).normalize().multiplyScalar(10000);

    const seaBackground = () => {
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

        water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load(
                "static/threeModel/waternormals.jpg",
                function (texture: THREE.Texture) {
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

    const parameters = {
        elevation: 4,
        azimuth: 180,
    };

    // Create PMREMGenerator only if renderer.compile exists
    let pmremGenerator: THREE.PMREMGenerator | undefined;
    if (typeof renderer.compile === 'function') {
        pmremGenerator = new THREE.PMREMGenerator(renderer);
    }
    const sceneEnv = new THREE.Scene();
    let renderTarget: THREE.WebGLRenderTarget | undefined;

    function updateSun() {
        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);

        sun.setFromSphericalCoords(1000, phi, theta);

        sky.material.uniforms["sunPosition"].value.copy(sun);
        water.material.uniforms["sunDirection"].value.copy(sun).normalize();

        // Only update environment if PMREMGenerator is available
        if (pmremGenerator) {
            if (renderTarget !== undefined) renderTarget.dispose();
            sceneEnv.add(sky);
            renderTarget = pmremGenerator.fromScene(sceneEnv);
            scene.add(sky);
            scene.environment = renderTarget.texture;
        }
    }

    seaBackground();
    setSkyBox();
    updateSun();

    return {
        waterObject: water,
        skyObject: sky,
        updateSunFunction: updateSun
    };
};

export const updateSunPosition = (sky: Sky, water: Water, sun: THREE.Vector3) => {
    sky.material.uniforms["sunPosition"].value.copy(sun);
    water.material.uniforms["sunDirection"].value.copy(sun).normalize();
};


// 初始化模型边框函数
export const initComposer = (scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer, sceneWidth: number, sceneHeight: number) => {

    // 创建效果合成器时设置像素比
    const pixelRatio = window.devicePixelRatio;
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(pixelRatio);

    // // 设置渲染器的像素比
    renderer.setPixelRatio(pixelRatio);

    const renderPass = new RenderPass(scene, camera);

    // 创建轮廓线通道
    const outlinePass = new OutlinePass(
        new THREE.Vector2(sceneWidth, sceneHeight),
        scene,
        camera
    );

    // 增加轮廓线的清晰度
    // 设置轮廓线的强度
    outlinePass.edgeStrength = 5;
    // 设置轮廓线的发光效果
    outlinePass.edgeGlow = 0.5;
    // 设置轮廓线的粗细
    outlinePass.edgeThickness = 3;
    // 设置轮廓线的脉冲周期
    outlinePass.pulsePeriod = 1;
    // 设置可见边缘的颜色为蓝色
    outlinePass.visibleEdgeColor.set("#3254FF");
    // 设置隐藏边缘的颜色为深灰色
    outlinePass.hiddenEdgeColor.set("#190a05");
    // 禁用模式纹理
    outlinePass.usePatternTexture = false;
    // 更新渲染器尺寸和像素比
    renderer.setSize(sceneWidth, sceneHeight);
    renderer.setPixelRatio(pixelRatio);

    // 更新合成器尺寸和像素比
    composer.setSize(sceneWidth, sceneHeight);
    composer.setPixelRatio(pixelRatio);


    composer.addPass(renderPass);
    composer.addPass(outlinePass);

    return {
        composer,
        outlinePass
    };
}





// 鼠标移入
// 处理鼠标移动事件
export const handleMouseMove = (event: MouseEvent, scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
    const rect = renderer?.domElement?.getBoundingClientRect();
    if (!rect) return;
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // 获取所有可点击对象
    const clickableObjects = scene.children.filter(
        (obj) =>
            obj.userData.modelData ||
            (obj instanceof THREE.Group &&
                obj.children.some((child) => child.userData.modelData))
    );

    const intersects = raycaster.intersectObjects(clickableObjects, true);
    return { intersects, renderer };
}

// 存储需要持续高亮的对象
var persistentHighlightObjects: THREE.Object3D[] = [];
// 存储鼠标悬停高亮的对象
var hoverHighlightObject: THREE.Object3D | null = null;

// 设置轮廓线
export const setOutline = (intersects: THREE.Intersection[], renderer: THREE.WebGLRenderer, outlinePass: OutlinePass) => {
    if (intersects.length > 0) {
        const intersection = intersects.find((item) => {
            const object = item.object;
            return (
                object.name.includes("hailan") ||
                object.parent?.name.includes("fengji")
            );
        });

        if (intersection) {
            let selectedObject = intersection.object;

            // 如果是风机的子对象，选择整个风机组
            if (selectedObject.parent?.name.includes("fengji")) {
                selectedObject = selectedObject.parent;
            }

            // 更新悬停对象
            hoverHighlightObject = selectedObject;

            // 合并持久高亮对象和当前悬停对象
            const allHighlightObjects = [...persistentHighlightObjects];
            if (hoverHighlightObject && !persistentHighlightObjects.includes(hoverHighlightObject)) {
                allHighlightObjects.push(hoverHighlightObject);
            }

            outlinePass.selectedObjects = allHighlightObjects;
            // 获取轮廓线灯光效果 闪动的效果
            console.log("outlinePass.pulsePeriod", outlinePass.pulsePeriod);

            renderer.domElement.style.cursor = "pointer";
        } else {
            // 如果没有有效的交集，只显示持久高亮对象
            outlinePass.selectedObjects = persistentHighlightObjects;
            hoverHighlightObject = null;
            renderer.domElement.style.cursor = "default";
        }
    } else {
        // 鼠标没有指向任何对象时，只显示持久高亮对象
        outlinePass.selectedObjects = persistentHighlightObjects;
        hoverHighlightObject = null;
        renderer.domElement.style.cursor = "default";
    }
}

// 组合鼠标移动和轮廓线设置
export const onMouseMove = (event: MouseEvent, scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer, outlinePass: OutlinePass) => {
    const { intersects, renderer: rendererRef } = handleMouseMove(event, scene, camera, renderer);

    // 如果 persistentHighlightObjects 为空，则初始化持久高亮对象
    if (persistentHighlightObjects.length === 0) {
        const highlightObjects = scene.children.filter((obj) => obj.userData?.lineHeight);
        persistentHighlightObjects = highlightObjects;
        console.log("Initial persistent highlight objects:", highlightObjects);
    }

    if (intersects) {
        setOutline(intersects, rendererRef, outlinePass);
    }
}

// 添加一个方法来添加持久高亮对象
export const addPersistentHighlight = (object: THREE.Object3D) => {
    if (!persistentHighlightObjects.includes(object)) {
        persistentHighlightObjects.push(object);
    }
}

// 添加一个方法来移除持久高亮对象
export const removePersistentHighlight = (object: THREE.Object3D) => {
    const index = persistentHighlightObjects.indexOf(object);
    if (index > -1) {
        persistentHighlightObjects.splice(index, 1);
    }
}