<template>
  <div class="login-container">
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
