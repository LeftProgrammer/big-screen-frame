<template>
  <div class="basic-login">
    <el-card class="login-card">
      <template #header>
        <h2>登录</h2>
      </template>

      <el-form ref="formRef" :model="formData" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="formData.username" placeholder="用户名" prefix-icon="User" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleLogin"> 登录 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

const formData = reactive({
  username: '',
  password: ''
});

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

const handleLogin = async () => {
  if (!formRef.value) return;

  try {
    loading.value = true;
    await formRef.value.validate();

    // 这里模拟登录成功
    await new Promise(resolve => setTimeout(resolve, 1000));
    ElMessage.success('登录成功');
    router.push('/');
  } catch (error) {
    console.error('登录失败:', error);
    ElMessage.error('登录失败，请检查用户名和密码');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.basic-login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-card :deep(.el-card__header) {
  text-align: center;
  padding: 15px;
}

.login-card :deep(.el-card__body) {
  padding: 30px 20px;
}

h2 {
  margin: 0;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.el-button {
  width: 100%;
}
</style>
