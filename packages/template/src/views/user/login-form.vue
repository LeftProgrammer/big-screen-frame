<template>
  <div class="login-container">
    <!-- <div class="background-animation"></div> -->
    <div class="login-box">
      <div class="login-header">
        <div class="login-title">欢迎登录</div>
        <!-- <div class="login-subtitle">总承包项目管理系统</div> -->
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group input-username">
          <!-- <label for="username">用户名</label> -->
          <div class="input-username-box">
            <input
              type="text"
              id="username"
              v-model="userInfo.username"
              required
              placeholder="请输入用户名"
            />
          </div>
        </div>
        <div class="input-group input-password">
          <!-- <label for="password">密码</label> -->
          <div class="input-password-box">
            <div class="password-input-wrapper" style="position: relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="userInfo.password"
                required
                placeholder="请输入密码"
              />
              <i
                class="password-toggle"
                @click="showPassword = !showPassword"
                style="
                  position: absolute;
                  right: 10px;
                  top: 50%;
                  transform: translateY(-50%);
                  cursor: pointer;
                "
              >
                {{ showPassword ? "👁️" : "👁️‍🗨️" }}
              </i>
            </div>
          </div>
        </div>
        <!-- 记住我 -->
        <!-- <div class="remember-me">
          <input
            type="checkbox"
            id="remember-me"
            style="accent-color: #1890ff"
          />
          <label for="remember-me">记住密码</label>
        </div> -->
        <button
          type="submit"
          class="login-button"
          :class="{ loading: isLoading }"
        >
          <span v-if="!isLoading">登 录</span>
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
import { ElMessage } from 'element-plus'

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
const showPassword = ref(false);
const changePasswordType = () => {
  console.log("changePasswordType");
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  console.log("外部-handleLogin");
  isLoading.value = true;
  
  try {
    const res = await userStore.login(userInfo.value);
    console.log("登录结果", res);
    
    // 使用更灵活的成功判断
    if (res && (res.code == 200 || res.success === true)) {
      ElMessage.success('登录成功');
      router.push("/analysis");
    } else {
      // 处理API返回失败的情况
      const errorMsg = res?.message || '登录失败，请检查用户名和密码';
      ElMessage.error(errorMsg);
    }
  } catch (error) {
    // 处理代码异常的情况
    console.error('登录过程发生错误:', error);
    ElMessage.error(error?.message || '登录失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
input:focus {
  background-color: #1150e5;
}
.password-toggle {
  cursor: pointer;
  color: #fff;
  z-index: 999;
}
.input-username-box {
  position: relative;
}
input#username {
  padding: 10px 10px 10px 40px;
}
input#password {
  padding: 10px 10px 10px 40px;
}
.input-username-box::before {
  content: "";
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-image: url("../../assets/img/big-data/username.png");
  background-size: contain;
  background-repeat: no-repeat;
  width: 20px;
  height: 20px;
  z-index: 999;
}
.input-password-box::before {
  content: "";
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-image: url("../../assets/img/big-data/password.png");
  background-size: contain;
  background-repeat: no-repeat;
  width: 20px;
  height: 20px;
  z-index: 999;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: transparent;
  overflow: hidden;
  position: relative;
}

.login-box {
  border-radius: 10px;
  padding: 60px 20%;
  width: 500px;
  /* box-shadow: 0 0 20px rgba(0, 123, 255, 0.3); */
  height: 430px;
  z-index: 1;
  animation: fadeIn 1s;
  position: relative;
  overflow: hidden;
  background-image: url("@/assets/img/big-data/login-form-bg.png");
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
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
  margin-bottom: 50px;
}

.login-title {
  font-family: "AlibabaPuHuiTi-2-65-Medium";
  font-weight: normal;
  font-size: 28px;
  color: #ffffff;
  line-height: 33px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  position: relative;
}
.login-title::before {
  content: "";
  position: absolute;
  bottom: -10px;
  width: 72px;
  height: 2px;
  background: linear-gradient(180deg, #2d6fdf 0%, #052d70 100%);
  left: 50%;
  transform: translateX(-50%);
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
  position: relative;
  margin-bottom: 15px;
}

.input-password {
  margin-bottom: 50px;
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

.login-button {
  background: #2176ff;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 26px;
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
