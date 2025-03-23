<template>
  <el-form ref="formRef" :model="formData" :rules="rules" class="login-form" size="large">
    <el-form-item prop="username">
      <el-input
        v-model="formData.username"
        :prefix-icon="configObj.icons.username"
        :placeholder="configObj.fields.username.placeholder"
        clearable
        @keyup.enter="handleLogin"
      />
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        v-model="formData.password"
        :prefix-icon="configObj.icons.password"
        type="password"
        :placeholder="configObj.fields.password.placeholder"
        show-password
        clearable
        @keyup.enter="handleLogin"
      />
    </el-form-item>

    <div class="form-options">
      <el-checkbox v-model="rememberMe">{{ configObj.rememberMeText }}</el-checkbox>
      <el-link type="primary" :underline="false">忘记密码？</el-link>
    </div>

    <el-form-item>
      <el-button type="primary" :loading="loading" class="submit-btn" @click="handleLogin">
        {{ loading ? '登录中...' : configObj.submitText }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, defineComponent } from 'vue';
import { ElMessage } from 'element-plus';
import { useAuth } from '../composables/useAuth';
import type { LoginFormConfig, LoginFormIcons } from '../types/component-types';
import type { Component } from 'vue';

// 对组件进行定义，以支持其他组件的导入
defineComponent({
  name: 'LoginForm',
});

// 接收自定义配置
const props = defineProps<{
  config?: LoginFormConfig;
}>();

// 定义事件
const emit = defineEmits<{
  success: [];
  error: [error: Error];
}>();

// 默认图标组件
const defaultIcons: LoginFormIcons = {
  username: null as unknown as Component,
  password: null as unknown as Component,
};

// 合并配置 - 使用不同的变量名，避免模板引用错误
const configObj = reactive({
  title: props.config?.title ?? '用户登录',
  fields: {
    username: {
      label: props.config?.fields?.username?.label ?? '用户名',
      placeholder: props.config?.fields?.username?.placeholder ?? '请输入用户名',
    },
    password: {
      label: props.config?.fields?.password?.label ?? '密码',
      placeholder: props.config?.fields?.password?.placeholder ?? '请输入密码',
    },
  },
  submitText: props.config?.submitText ?? '登录',
  icons: { ...defaultIcons, ...props.config?.icons },
  showRememberMe: props.config?.showRememberMe !== undefined ? props.config?.showRememberMe : true,
  rememberMeText: props.config?.rememberMeText ?? '记住我',
});

// 表单数据和校验
const formRef = ref();
const formData = ref({
  username: '',
  password: '',
});
const rememberMe = ref(false);
const loading = ref(false);

// 初始化认证逻辑 - 使用异步API
const auth = useAuth();

// 表单校验规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

// 尝试从本地存储中恢复用户名
onMounted(() => {
  const rememberedUsername = localStorage.getItem('remembered_username');
  if (rememberedUsername) {
    formData.value.username = rememberedUsername;
    rememberMe.value = true;
  }
});

// 处理登录
const handleLogin = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    try {
      // 尝试登录，捕获所有响应
      await auth.login(formData.value.username, formData.value.password);
      
      // 标准成功路径
      if (rememberMe.value) {
        localStorage.setItem('remembered_username', formData.value.username);
      } else {
        localStorage.removeItem('remembered_username');
      }
      
      ElMessage.success('登录成功');
      emit('success');
    } catch (loginError: any) {
      // 特殊情况处理：如果错误或错误消息包含"登录成功"字样
      if (
        (loginError && loginError.message === '登录成功') || 
        (loginError && loginError.success === true) ||
        (typeof loginError === 'object' && loginError && 'message' in loginError && loginError.message === '登录成功')
      ) {
        console.log('检测到异常登录成功状态，已自动处理', loginError);
        
        if (rememberMe.value) {
          localStorage.setItem('remembered_username', formData.value.username);
        }
        
        ElMessage.success('登录成功');
        emit('success');
        return;
      }
      
      // 真正的错误
      console.error('登录失败:', loginError);
      emit('error', loginError instanceof Error ? loginError : new Error(typeof loginError === 'string' ? loginError : JSON.stringify(loginError)));
      ElMessage.error(loginError.message || '登录失败');
    }
  } catch (formError: any) {
    // 表单验证错误
    console.error('表单验证失败:', formError);
    ElMessage.error('请正确填写登录信息');
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-form {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  padding: 20px;

  :deep(.el-input) {
    --el-input-height: 44px;

    .el-input__wrapper {
      box-shadow: 0 0 0 1px var(--el-border-color) inset;

      &:hover {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .submit-btn {
    width: 100%;
    height: 44px;
    font-size: 16px;
  }
}
</style>
