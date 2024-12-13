<template>
  <div class="auth-examples">
    <h1>认证模块示例</h1>
    <p class="description">
      这里展示了认证模块的各种使用示例，包括基础登录、自定义认证和权限控制等功能。
    </p>
    <div class="examples-nav">
      <router-link to="/application/auth/basic" class="nav-item">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><Key /></el-icon>
              <span>基础登录示例</span>
            </div>
          </template>
          <p>展示默认登录页面的使用方法和登录状态管理。</p>
        </el-card>
      </router-link>

      <router-link to="/application/auth/custom" class="nav-item">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><SetUp /></el-icon>
              <span>自定义认证示例</span>
            </div>
          </template>
          <p>演示如何自定义认证服务和集成第三方登录。</p>
        </el-card>
      </router-link>

      <router-link to="/application/auth/permission" class="nav-item">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><UserFilled /></el-icon>
              <span>权限控制示例</span>
            </div>
          </template>
          <p>展示如何使用权限和角色控制来管理访问权限。</p>
        </el-card>
      </router-link>
    </div>

    <div class="example-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Key, SetUp, UserFilled } from '@element-plus/icons-vue';
</script>

<style lang="scss" scoped>
.auth-examples {
  padding: 20px;

  h1 {
    margin-bottom: 16px;
    font-size: 28px;
    font-weight: 600;
  }

  .description {
    margin-bottom: 24px;
    color: var(--el-text-color-secondary);
  }

  .examples-nav {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 32px;

    .nav-item {
      text-decoration: none;
      color: inherit;

      &:hover {
        .el-card {
          transform: translateY(-2px);
          box-shadow: var(--el-box-shadow-light);
        }
      }

      .el-card {
        transition: all 0.3s ease;
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 8px;

        .el-icon {
          font-size: 18px;
        }
      }

      p {
        margin: 0;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .example-content {
    margin-top: 32px;
    padding: 24px;
    background-color: var(--el-bg-color);
    border-radius: var(--el-border-radius-base);
    box-shadow: var(--el-box-shadow-light);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
