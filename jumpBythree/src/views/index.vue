<template>
  <div class="Wrap" @mousedown="mousedown" @mouseup="mouseup">
    <canvas id="game"></canvas>
  </div>
</template>
<script setup>
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { Cube, Player } from "@/utils/gameItems.js";
const store = ref(0);
const gameScene = ref(null);
const gameCamera = ref(null);
const strength = ref(null);
const strengthTimer = ref(null);
const isRun = ref(false);
const gameDirection = ref("right");
const cubeInfo = reactive({ x: 0, z: 0, long: 0, width: 0 });
const gamePlayer = reactive({
  role: null,
  x: 0,
  y: 0,
  z: 0,
});

const mousedown = (e) => {
  if(e.button!==0)return
  if (isRun.value) return;
  strengthTimer.value = setInterval(() => {
    strength.value += 20;

    gamePlayer.role.scale.y -= 0.05;
    gamePlayer.role.position.y -= 1.1;
    if (strength.value >= 350) {
      strength.value = 350;
      gamePlayer.role.scale.y = 0.1;
      gamePlayer.role.position.y = 55;
    }
  }, 100);
};
const mouseup = (e) => {
  if(e.button!==0)return
  if (isRun.value) return;
  clearInterval(strengthTimer.value);
  gamePlayer.role.scale.y = 1;
  gamePlayer.role.position.y = 75;
  if (strength.value < 30) {
    strength.value = 0;
  } else {
    movePlayer();
  }
};
const movePlayer = () => {
  isRun.value = true;
  let playerRunObj = {
    duration: 1,
    keyframes: { y: [75, 120, 75] },
    onComplete: () => {
      gamePlayer.x = gamePlayer.role.position.x;
      gamePlayer.z = gamePlayer.role.position.z;
      isRun.value = false;
      // 力度清0
      strength.value = 0;
      // 先判断一下是否还在平台上
      if (
        gamePlayer.x < cubeInfo.x + cubeInfo.long / 2 &&
        gamePlayer.x > cubeInfo.x - cubeInfo.long / 2 &&
        gamePlayer.z < cubeInfo.z + cubeInfo.width / 2 &&
        gamePlayer.z > cubeInfo.z - cubeInfo.width / 2
      ) {
        createCube();
        store.value++;
        console.log("得分：" + store.value);
      } else {
        gsap.to(gamePlayer.role.position, {
          y: -50,
          duration: 1,
          onComplete: () => {
            gamePlayer.role.visible = false;
            let rePlay = confirm("重新开始");
            if (rePlay) {
              location.reload();
            }
          },
        });
        gsap.to(gamePlayer.role.rotation, { z: -1.5, duration: 1 });
        console.log("得分：" + store.value);
      }
    },
    onUpdate: () => {
      // 移动摄像机
      gameCamera.value.position.x = gamePlayer.role.position.x - 250;
      gameCamera.value.position.z = gamePlayer.role.position.z + 250;
    },
  };

  if (gameDirection.value === "right") {
    playerRunObj.x = strength.value + gamePlayer.x;
  } else {
    playerRunObj.z = strength.value + gamePlayer.z;
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

  gameScene.value.add(cube);
  gsap.fromTo(cube.scale, { y: 0.6 }, { y: 1 });
  cubeInfo.x = distanceX;
  cubeInfo.z = distanceZ;
  cubeInfo.long = cubeX;
  cubeInfo.width = cubeZ;
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
  // const axes = new THREE.AxesHelper(50000);
  // scene.add(axes);
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
