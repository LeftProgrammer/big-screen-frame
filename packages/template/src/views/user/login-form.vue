<template>
  <div class="login-container">
    <div class="background-animation"></div>
    <div class="login-box">
      <div class="login-header">
        <div class="login-title">广西钦州海上风电场EPC</div>
        <div class="login-subtitle">总承包项目管理系统</div>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="username">用户名</label>
          <input
            type="text"
            id="username"
            v-model="userInfo.username"
            required
          />
          <div class="input-focus-effect"></div>
        </div>
        <div class="input-group">
          <label for="password">密码</label>
          <input
            type="password"
            id="password"
            v-model="userInfo.password"
            required
          />
          <div class="input-focus-effect"></div>
        </div>
        <button
          type="submit"
          class="login-button"
          :class="{ loading: isLoading }"
        >
          <span v-if="!isLoading">登录系统</span>
          <span v-else class="loading-spinner"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import { useUserStore } from "@/utils/userStore";
import { useRouter } from "vue-router";


const router = useRouter();
const userStore = useUserStore();

const isLoading = ref(false);
const userInfo = ref({
  captcha: "12312",
  checkKey: 1729243663645,
  password: "jh@12345",
  remember_me: true,
  username: "admin",
});


const handleLogin = async () => {
  isLoading.value = true;
  const res = await userStore.login(userInfo.value);
  console.log("登录结果", res);
  if (res.code == 200) {
    isLoading.value = false;
    router.push("/analysis");
  }
};
</script>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: transparent;
  overflow: hidden;
  position: relative;
  width: 25vw;
}
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 35%,
      rgba(4, 78, 144, 0.5) 0%,
      transparent 25%
    ),
    radial-gradient(
      circle at 75% 44%,
      rgba(4, 78, 144, 0.5) 0%,
      transparent 20%
    );
  filter: blur(60px);
  opacity: 0.5;
  animation: pulse 8s infinite alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

.login-box {
  background: rgba(13, 23, 33, 0.8);
  border-radius: 10px;
  padding: 40px;
  width: 400px;
  box-shadow: 0 0 20px rgba(0, 123, 255, 0.3);
  z-index: 1;
  animation: fadeIn 1s;
  position: relative;
  overflow: hidden;
}

.login-box::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    transparent,
    rgba(24, 144, 255, 0.1),
    transparent 30%
  );
  animation: rotate 4s linear infinite;
}

.login-box::after {
  content: "";
  position: absolute;
  inset: 3px;
  background: rgba(13, 23, 33, 0.8);
  border-radius: 7px;
  z-index: -1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 24px;
  color: #fff;
  margin-bottom: 10px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
}

.login-subtitle {
  font-size: 16px;
  color: #4a90e2;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 20px;
  position: relative;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #4a90e2;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
  color: #fff;
  border-radius: 4px;
  transition: all 0.3s;
  position: relative;
  z-index: 1;
}

.input-focus-effect {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #1890ff;
  transition: all 0.3s;
}

input:focus + .input-focus-effect {
  width: 100%;
  left: 0;
}

.login-button {
  background: linear-gradient(45deg, #1890ff, #4a90e2);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.login-button::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 60%
  );
  transform: scale(0);
  transition: transform 0.3s;
}

.login-button:hover::before {
  transform: scale(1);
}

.login-button:active {
  transform: scale(0.98);
}

.login-button.loading {
  opacity: 0.8;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top: 2px solid transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.system-info {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.info-item {
  display: flex;
  align-items: center;
  color: #4a90e2;
  font-size: 14px;
}

.info-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  background-size: contain;
  background-repeat: no-repeat;
}

.data-stream {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.data-particle {
  position: absolute;
  background-color: #1890ff;
  border-radius: 50%;
  opacity: 0.6;
  animation: floatUp 3s linear infinite;
}

@keyframes floatUp {
  0% {
    transform: translateY(100vh);
    opacity: 0.6;
  }
  100% {
    transform: translateY(-20px);
    opacity: 0;
  }
}

.network-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.network-lines line {
  stroke-dasharray: 5, 5;
}
</style>
