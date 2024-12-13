<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-content">
        <div class="login-header">
          <img v-if="config?.logo" :src="config.logo" class="logo" alt="Logo" />
          <h2 class="title">{{ config?.title || '系统登录' }}</h2>
          <p v-if="config?.subtitle" class="subtitle">
            {{ config.subtitle }}
          </p>
        </div>

        <login-form @success="handleLoginSuccess" @error="handleLoginError" />

        <div v-if="config?.footer" class="login-footer">
          {{ config.footer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import LoginForm from './LoginForm.vue';

interface LoginPageConfig {
  logo?: string;
  title?: string;
  subtitle?: string;
  footer?: string;
  redirectUrl?: string;
}

const props = defineProps<{
  config?: LoginPageConfig;
}>();

const router = useRouter();

const handleLoginSuccess = () => {
  // 登录成功后跳转
  const redirectUrl = props.config?.redirectUrl || '/';
  router.push(redirectUrl);
};

const handleLoginError = (error: any) => {
  console.error('Login failed:', error);
};
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--el-bg-color);

  .login-container {
    width: 100%;
    max-width: 480px;
    margin: 20px;
    background-color: var(--el-bg-color-overlay);
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);
  }

  .login-content {
    padding: 40px;
  }

  .login-header {
    text-align: center;
    margin-bottom: 40px;

    .logo {
      height: 48px;
      margin-bottom: 24px;
    }

    .title {
      font-size: 28px;
      color: var(--el-text-color-primary);
      margin: 0 0 8px;
    }

    .subtitle {
      font-size: 14px;
      color: var(--el-text-color-secondary);
      margin: 0;
    }
  }

  .login-footer {
    margin-top: 24px;
    text-align: center;
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-page {
    background-color: var(--el-bg-color-overlay);

    .login-container {
      box-shadow: none;
      margin: 0;
    }

    .login-content {
      padding: 20px;
    }
  }
}
</style>
