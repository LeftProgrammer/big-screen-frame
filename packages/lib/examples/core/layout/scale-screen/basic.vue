<!-- 基础缩放布局示例 -->
<template>
  <div class="scale-screen-basic-demo">
    <scale-screen :width="1920" :height="1080">
      <div class="content">
        <h1>Scale Screen Basic Demo</h1>
        <p>这是一个基础的大屏缩放布局示例</p>
        <div class="demo-box">
          <div v-for="i in 4" :key="i" class="item">Box {{ i }}</div>
        </div>
      </div>
    </scale-screen>
  </div>
</template>

<script setup lang="ts">
import { ScaleScreen } from '../../../../src/core/layout';
</script>

<style lang="scss" scoped>
.scale-screen-basic-demo {
  width: 100vw;
  height: 100vh;
  background: #000;

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    color: #fff;

    h1 {
      margin-bottom: 40px;
    }

    .demo-box {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      width: 100%;
      max-width: 1200px;

      .item {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
      }
    }
  }
}
</style>
