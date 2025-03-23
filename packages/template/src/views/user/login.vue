<template>
  <div class="login-container">
    <div class="rolling-display-container">
    </div>
    <div class="wave-canvas">
      <wavesBg :top="350"></wavesBg>
    </div>
    <div class="login-form">
      <loginForm></loginForm>
    </div>
  </div>
</template>

<script setup>
import wavesBg from "./waves.vue";
import loginForm from "./login-form.vue";
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  .login-form {
    position: absolute;
    top: 0;
    right: 10%;
    color: #fff;
  }
  .rolling-display-container {
    position: absolute;
    top: 300px;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99999;
    .RollingDisplay {
      // border-radius: 8px;
      background-color: #fff;
      // box-shadow: inset 0 0 10px 4px rgba(0, 0, 0, 0.5);
    }
  }
  .wave-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
}
</style>
