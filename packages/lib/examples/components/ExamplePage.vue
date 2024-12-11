<template>
  <div class="example-page">
    <div v-if="title || description" class="page-header">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
    <div class="page-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
}>();
</script>

<style lang="scss" scoped>
.example-page {
  .page-header {
    margin-bottom: 24px;

    h1 {
      font-size: 24px;
      margin: 0 0 12px;
      font-weight: 600;
      color: var(--bsf-text-color-primary);
    }

    p {
      margin: 0;
      line-height: 1.6;
      color: var(--bsf-text-color-secondary);
    }
  }
}

.example-section {
  margin-bottom: 24px;
  padding: 24px;
  background-color: var(--bsf-bg-color-overlay);
  border-radius: 8px;

  h2 {
    font-size: 18px;
    margin: 0 0 16px;
    font-weight: 600;
    color: var(--bsf-text-color-primary);
  }

  p {
    margin: 0 0 16px;
    line-height: 1.6;
    color: var(--bsf-text-color-regular);

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
