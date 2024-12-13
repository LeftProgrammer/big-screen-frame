<template>
  <el-form ref="formRef" :model="formData" :rules="rules" class="login-form" size="large">
    <el-form-item prop="username">
      <el-input
        v-model="formData.username"
        :prefix-icon="User"
        placeholder="请输入用户名"
        clearable
        @keyup.enter="handleSubmit"
      />
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        v-model="formData.password"
        :prefix-icon="Lock"
        type="password"
        placeholder="请输入密码"
        show-password
        clearable
        @keyup.enter="handleSubmit"
      />
    </el-form-item>

    <div class="form-options">
      <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
      <el-link type="primary" :underline="false">忘记密码？</el-link>
    </div>

    <el-form-item>
      <el-button type="primary" :loading="loading" class="submit-btn" @click="handleSubmit">
        {{ loading ? '登录中...' : '登录' }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import { useAuth } from '@lib/application/auth';
import type { LoginParams } from '../types/auth.types';

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'error', error: any): void;
}>();

const auth = useAuth();
const formRef = ref<FormInstance>();
const loading = ref(false);
const rememberMe = ref(false);

// 表单数据
const formData = reactive<LoginParams>({
  username: '',
  password: ''
});

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
};

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    await auth.login(formData);

    if (rememberMe.value) {
      // 记住密码逻辑
      localStorage.setItem('remembered_username', formData.username);
    }

    ElMessage.success('登录成功');
    emit('success');
  } catch (error: any) {
    emit('error', error);
    ElMessage.error(error.message || '登录失败');
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
