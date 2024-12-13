<template>
  <div class="example-container">
    <h2>基础登录示例</h2>
    <div class="demo-section">
      <el-card class="demo-card">
        <template #header>
          <div class="card-header">
            <span>默认登录页面</span>
          </div>
        </template>
        <LoginPage
          :config="{
            title: '系统登录',
            subtitle: '基础登录示例',
            logo: '/logo.png',
            footer: ' 2024 Example Company'
          }"
        />
      </el-card>

      <el-card class="demo-card">
        <template #header>
          <div class="card-header">
            <span>登录状态</span>
          </div>
        </template>
        <div class="status-info">
          <p>
            <el-tag :type="isLoggedIn ? 'success' : 'info'">
              {{ isLoggedIn ? '已登录' : '未登录' }}
            </el-tag>
          </p>
          <template v-if="isLoggedIn">
            <p>用户名: {{ userInfo?.username }}</p>
            <p>角色: {{ userInfo?.roles?.join(', ') }}</p>
            <el-button type="primary" @click="handleLogout">登出</el-button>
          </template>
        </div>
      </el-card>
    </div>

    <div class="code-section">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="Template" name="template">
          <pre><code class="language-vue">{{ templateCode }}</code></pre>
        </el-tab-pane>
        <el-tab-pane label="Script" name="script">
          <pre><code class="language-typescript">{{ scriptCode }}</code></pre>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth, LoginPage } from '@lib/application/auth';
import { ElMessage } from 'element-plus';

const auth = useAuth();
const activeTab = ref('template');

const { isLoggedIn, userInfo } = auth;

const handleLogout = async () => {
  try {
    await auth.logout();
    ElMessage.success('登出成功');
  } catch (error) {
    ElMessage.error('登出失败');
  }
};

const templateCode = `
<template>
  <!-- 使用默认登录页面 -->
  <LoginPage
    :config="{
      title: '系统登录',
      subtitle: '基础登录示例',
      logo: '/logo.png',
      footer: ' 2024 Example Company'
    }"
  />

  <!-- 显示登录状态 -->
  <div class="status-info">
    <p>
      <el-tag :type="isLoggedIn ? 'success' : 'info'">
        {{ isLoggedIn ? '已登录' : '未登录' }}
      </el-tag>
    </p>
    <template v-if="isLoggedIn">
      <p>用户名: {{ userInfo?.username }}</p>
      <p>角色: {{ userInfo?.roles?.join(', ') }}</p>
      <el-button type="primary" @click="handleLogout">登出</el-button>
    </template>
  </div>
</template>
`.trim();

const scriptCode = `
import { ref } from 'vue';
import { useAuth, LoginPage } from '@lib/application/auth';
import { ElMessage } from 'element-plus';

const auth = useAuth();
const activeTab = ref('template');

const { isLoggedIn, userInfo } = auth;

const handleLogout = async () => {
  try {
    await auth.logout();
    ElMessage.success('登出成功');
  } catch (error) {
    ElMessage.error('登出失败');
  }
};
`.trim();
</script>

<style scoped>
.example-container {
  padding: 20px;
}

.demo-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.demo-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-info {
  padding: 20px;
}

.code-section {
  margin-top: 20px;
}

pre {
  margin: 0;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

code {
  font-family:
    Monaco,
    Consolas,
    Courier New,
    monospace;
}
</style>
