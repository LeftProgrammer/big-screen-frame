<template>
  <div class="example-container">
    <h2>自定义认证示例</h2>
    <div class="demo-section">
      <el-card class="demo-card">
        <template #header>
          <div class="card-header">
            <span>自定义认证服务</span>
          </div>
        </template>
        <div class="demo-content">
          <el-form :model="formData" label-width="100px">
            <el-form-item label="认证类型">
              <el-select v-model="formData.authType">
                <el-option label="JWT" value="jwt" />
                <el-option label="OAuth" value="oauth" />
                <el-option label="SSO" value="sso" />
              </el-select>
            </el-form-item>

            <el-form-item label="Token同步">
              <el-switch v-model="formData.enableSync" />
            </el-form-item>

            <el-form-item label="公开API">
              <el-input
                v-model="formData.publicPath"
                placeholder="/api/public"
                @keyup.enter="addPublicPath"
              >
                <template #append>
                  <el-button @click="addPublicPath">添加</el-button>
                </template>
              </el-input>
              <div class="path-tags">
                <el-tag v-for="path in publicPaths" :key="path" closable @close="removePath(path)">
                  {{ path }}
                </el-tag>
              </div>
            </el-form-item>
          </el-form>

          <el-divider>认证配置预览</el-divider>
          <pre><code>{{ configPreview }}</code></pre>
        </div>
      </el-card>

      <el-card class="demo-card">
        <template #header>
          <div class="card-header">
            <span>自定义登录表单</span>
          </div>
        </template>
        <div class="demo-content">
          <el-form :model="loginForm" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="loginForm.username" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="loginForm.password" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleLogin">登录</el-button>
              <el-button @click="handleThirdPartyLogin('sso')">SSO登录</el-button>
              <el-button @click="handleLogout">登出</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>

    <div class="code-section">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="自定义服务" name="service">
          <pre><code class="language-typescript">{{ serviceCode }}</code></pre>
        </el-tab-pane>
        <el-tab-pane label="使用示例" name="usage">
          <pre><code class="language-typescript">{{ usageCode }}</code></pre>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuth } from '@lib/application/auth';
import { ElMessage } from 'element-plus';

const auth = useAuth();

const isLoggedIn = computed(() => auth.isLoggedIn.value);
const userInfo = computed(() => auth.userInfo.value);

const loginForm = ref({
  username: '',
  password: ''
});

const handleLogin = async () => {
  try {
    await auth.login({
      username: loginForm.value.username,
      password: loginForm.value.password
    });
    ElMessage.success('登录成功');
  } catch (error) {
    ElMessage.error('登录失败');
  }
};

const handleLogout = async () => {
  try {
    await auth.logout();
    ElMessage.success('登出成功');
  } catch (error) {
    ElMessage.error('登出失败');
  }
};

const activeTab = ref('service');
const formData = ref({
  authType: 'jwt',
  enableSync: false,
  publicPath: ''
});
const publicPaths = ref<string[]>([]);
const addPublicPath = () => {
  if (formData.value.publicPath) {
    publicPaths.value.push(formData.value.publicPath);
    formData.value.publicPath = '';
  }
};
const removePath = (path: string) => {
  publicPaths.value = publicPaths.value.filter(p => p !== path);
};
const handleThirdPartyLogin = async (provider: string) => {
  try {
    await auth.thirdPartyLogin(provider, { code: 'mock_code' });
    ElMessage.success('第三方登录成功');
  } catch (error: any) {
    ElMessage.error(error.message || '第三方登录失败');
  }
};
const configPreview = computed(() => {
  return JSON.stringify(
    {
      customServices: { authService: 'CustomAuthService' },
      tokenSync: {
        enabled: formData.value.enableSync,
        method: 'broadcastChannel'
      },
      request: {
        publicPaths: publicPaths.value
      },
      thirdParty: {
        providers: ['sso']
      }
    },
    null,
    2
  );
});
const serviceCode = `
// 自定义认证服务
class CustomAuthService implements IAuthService {
  constructor(private config: AuthConfig) {}

  async login(params: LoginParams) {
    // 实现自定义登录逻辑
  }

  async logout() {
    // 实现自定义登出逻辑
  }

  async refreshToken() {
    // 实现自定义Token刷新逻辑
  }

  async getCurrentUser() {
    // 实现获取用户信息逻辑
    return {
      id: 1,
      username: 'custom_user',
      roles: ['admin']
    };
  }

  checkAuth() {
    return true;
  }
}
`.trim();
const usageCode = `
// 使用自定义认证服务
const auth = useAuth({
  customServices: {
    authService: CustomAuthService
  },
  tokenSync: {
    enabled: true,
    method: 'broadcastChannel'
  },
  request: {
    publicPaths: ['/api/public']
  },
  thirdParty: {
    providers: ['sso'],
    async handleCallback(provider, params) {
      // 处理第三方登录
    }
  }
});

// 使用认证服务
await auth.login({ username, password });
await auth.thirdPartyLogin('sso', { code });
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

.demo-content {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.path-tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.code-section {
  margin-top: 20px;
}

pre {
  margin: 0;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
  overflow-x: auto;
}

code {
  font-family:
    Monaco,
    Consolas,
    Courier New,
    monospace;
}
</style>
