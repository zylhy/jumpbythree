<template>
  <div class="Wrap" @click="movePlayer">
    <canvas id="game"></canvas>
  </div>
</template>
<script setup>
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { Cube, Player } from "@/utils/gameItems.js";
const gameScene = ref(null);
const gameCamera = ref(null);
const isRun = ref(false);
const gameDirection = ref("right");
const cubeInfo = reactive({ x: 0, z: 0, long: 0, width: 0 });
const gamePlayer = reactive({
  role: null,
  x: 0,
  y: 0,
  z: 0,
});
const movePlayer = () => {
  if (isRun.value) return;
  isRun.value = true;
  let playerRunObj = {
    duration: 1,
    keyframes:{y:[75,120,75]},
    onComplete: () => {
      gamePlayer.x = gamePlayer.role.position.x;
      gamePlayer.z = gamePlayer.role.position.z;
      isRun.value = false;
      createCube();
    },
    onUpdate: () => {
      
      // 移动摄像机
      gameCamera.value.position.x = gamePlayer.role.position.x - 250;
      gameCamera.value.position.z = gamePlayer.role.position.z + 250;
    },
  };



  if (gameDirection.value === "right") {
    playerRunObj.x = 200 + gamePlayer.x;
  } else {
    playerRunObj.z = 200 + gamePlayer.z;
  }
  gsap.to(gamePlayer.role.position, playerRunObj);
};
// 创建几何体
const createCube = () => {
  // 获取一个随机数用于设置距离上一个的距离
  let distance = getRandomInt(100, 300);
  // 判断是否是第一个几何体
  if (
    cubeInfo.x === 0 &&
    cubeInfo.z === 0 &&
    cubeInfo.long === 0 &&
    cubeInfo.width === 0
  ) {
    distance = 0;
  }
  // 获取一个随机数 用于设置宽度或者是长度
  let longOrwidth = getRandomInt(30, 100);
  // 获取一个随机方向
  gameDirection.value = getRandomInt(0, 1) ? "right" : "up";
  let cubeX = gameDirection.value === "right" ? longOrwidth : 100;
  let cubeZ = gameDirection.value === "up" ? longOrwidth : 100;
  const cube = new Cube(cubeX, cubeZ).getCube();
  let distanceX = gameDirection.value === "right" ? distance + cubeInfo.x : cubeInfo.x;
  let distanceZ = gameDirection.value === "up" ? distance + cubeInfo.z : cubeInfo.z;
  cube.position.set(distanceX, 0, distanceZ);
  cubeInfo.x = distanceX;
  cubeInfo.z = distanceZ;
  cubeInfo.long = longOrwidth;
  cubeInfo.width = longOrwidth;
  gameScene.value.add(cube);
};
const initThree = () => {
  // 创建场景
  const scene = new THREE.Scene();
  // 创建相机
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.set(-250, 250, 250);
  camera.lookAt(0, 0, 0);
  gameCamera.value = camera;
  // 获取canvas
  const canvas = document.getElementById("game");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // 创建渲染器
  const render = new THREE.WebGLRenderer({ canvas, antialias: true });
  render.setClearColor(0xd5d9df);
  render.shadowMap.enabled = true;

  //   创建平行光
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(-10, 100, 10);
  scene.add(light);
  const hemLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemLight.position.set(0, 50, 0);
  scene.add(hemLight);

  //   创建坐标系
  const axes = new THREE.AxesHelper(50000);
  scene.add(axes);
  //  创建一个轨道控制器
  // const controls = new OrbitControls(camera, canvas);
  // controls.enableDamping = true;
  gameScene.value = scene;
  createCube();
  createCube();
  // 创建角色
  const player = new Player().getPlayer();
  gamePlayer.role = player;
  player.position.set(0, 75, 0);
  scene.add(player);
  function animation() {
    render.render(scene, camera);
    requestAnimationFrame(animation);
  }
  animation();
};
onMounted(() => {
  initThree();
});
</script>
<style lang="scss" scoped></style>
