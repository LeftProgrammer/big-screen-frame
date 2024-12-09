<template>
  <div class="app">
    <VScreenBox :width="1920" :height="1080">
      <div class="content">
        <h1>Scale Screen Example</h1>
        <div class="demo-box">
          <div class="item" v-for="i in 4" :key="i">
            Box {{ i }}
          </div>
        </div>
      </div>
    </VScreenBox>
  </div>
</template>

<script lang="ts" setup>
import { VScreenBox } from '../src/core/layout'
</script>

<style lang="scss" scoped>
@use '@/styles/base/variables' as *;

.app {
  width: 100vw;
  height: 100vh;
  background-color: $background-color-base;

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    color: $text-primary;
    font-size: $font-size-large;

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
