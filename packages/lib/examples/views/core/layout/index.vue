<template>
  <div class="example-page">
    <div class="page-header">
      <h1>布局系统</h1>
      <p>提供灵活的布局和缩放能力，轻松适应不同尺寸的大屏设备。</p>
    </div>

    <div class="page-content">
      <el-card class="example-card">
        <template #header>
          <div class="card-header">
            <span>基础布局</span>
          </div>
        </template>
        <div class="card-content">
          <!-- 示例内容 -->
          <div>布局示例内容</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
console.log('布局系统页面加载成功');
</script>

<style scoped lang="scss">
.example-page {
  .page-header {
    margin-bottom: var(--bsf-spacing-lg);
    padding: var(--bsf-spacing-lg);
    background-color: var(--bsf-bg-color-base);
    border-radius: var(--bsf-radius-base);

    h1 {
      font-size: var(--bsf-font-size-xl);
      color: var(--bsf-text-color-primary);
      margin: 0 0 var(--bsf-spacing-sm);
      font-weight: 600;
    }

    p {
      font-size: var(--bsf-font-size-base);
      color: var(--bsf-text-color-secondary);
      margin: 0;
      line-height: 1.6;
    }
  }

  .example-card {
    background-color: var(--bsf-bg-color-base);
    border: 1px solid var(--bsf-border-color-light);
    border-radius: var(--bsf-radius-base);
    margin-bottom: var(--bsf-spacing-lg);

    :deep(.el-card__header) {
      padding: var(--bsf-spacing-md) var(--bsf-spacing-lg);
      border-bottom: 1px solid var(--bsf-border-color-light);
      background-color: var(--bsf-bg-color-base);
    }

    :deep(.el-card__body) {
      padding: var(--bsf-spacing-lg);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-size: var(--bsf-font-size-md);
        color: var(--bsf-text-color-primary);
        font-weight: 600;
      }
    }

    .card-content {
      color: var(--bsf-text-color-regular);
      font-size: var(--bsf-font-size-base);
      line-height: 1.6;
    }
  }
}
</style>
