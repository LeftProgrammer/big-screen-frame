<template>
  <div class="example-container">
    <h2>权限控制示例</h2>
    <div class="demo-section">
      <el-card class="demo-card">
        <template #header>
          <div class="card-header">
            <span>权限检查</span>
          </div>
        </template>
        <div class="demo-content">
          <el-form :model="formData" label-width="100px">
            <el-form-item label="权限">
              <el-select v-model="formData.permission" multiple>
                <el-option label="查看" value="view" />
                <el-option label="编辑" value="edit" />
                <el-option label="删除" value="delete" />
                <el-option label="管理" value="admin" />
              </el-select>
            </el-form-item>

            <el-form-item label="角色">
              <el-select v-model="formData.role" multiple>
                <el-option label="管理员" value="admin" />
                <el-option label="编辑者" value="editor" />
                <el-option label="访客" value="visitor" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleLogin"> 登录 </el-button>
              <el-button @click="handleLogout"> 登出 </el-button>
            </el-form-item>
          </el-form>

          <el-divider>权限演示</el-divider>

          <div class="permission-demo">
            <el-button v-if="hasPermission('view')" type="primary" plain> 查看按钮 </el-button>
            <el-button v-if="hasPermission('edit')" type="success" plain> 编辑按钮 </el-button>
            <el-button v-if="hasPermission('delete')" type="danger" plain> 删除按钮 </el-button>
            <el-button v-if="hasRole('admin')" type="warning" plain> 管理员按钮 </el-button>
          </div>
        </div>
      </el-card>

      <el-card class="demo-card">
        <template #header>
          <div class="card-header">
            <span>权限状态</span>
          </div>
        </template>
        <div class="demo-content">
          <p>当前登录状态：</p>
          <el-tag :type="isLoggedIn ? 'success' : 'info'" class="mb-2">
            {{ isLoggedIn ? '已登录' : '未登录' }}
          </el-tag>

          <template v-if="isLoggedIn">
            <p class="mt-4">用户信息：</p>
            <ul>
              <li>用户名：{{ userInfo?.username }}</li>
              <li>角色：{{ userInfo?.roles?.join(', ') }}</li>
              <li>权限：{{ userInfo?.permissions?.join(', ') }}</li>
            </ul>
          </template>

          <el-divider>权限检查</el-divider>
          <div class="permission-check">
            <p>权限状态：</p>
            <ul>
              <li>
                <el-tag :type="hasViewPermission ? 'success' : 'info'" class="mb-2">
                  查看权限: {{ hasViewPermission ? '有' : '无' }}
                </el-tag>
              </li>
              <li>
                <el-tag :type="hasAdminRole ? 'success' : 'info'" class="mb-2">
                  管理员角色: {{ hasAdminRole ? '是' : '否' }}
                </el-tag>
              </li>
            </ul>
          </div>
        </div>
      </el-card>

      <el-card class="demo-card">
        <template #header>
          <div class="card-header">
            <span>使用示例</span>
          </div>
        </template>
        <div class="demo-content">
          <p>权限检查示例代码：</p>
          <pre><code>{{ checkCode }}</code></pre>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuth } from '@lib/application/auth';
import { ElMessage } from 'element-plus';

const auth = useAuth();

// 登录状态
const isLoggedIn = computed(() => auth.isLoggedIn.value);
const userInfo = computed(() => auth.userInfo.value);

// 表单数据
const formData = ref({
  permission: [] as string[],
  role: [] as string[]
});

// 权限检查
const hasPermission = (permission: string) => {
  return auth.hasPermission(permission);
};

const hasRole = (role: string) => {
  return auth.hasRole(role);
};

// 登录处理
const handleLogin = async () => {
  try {
    await auth.login({
      username: 'admin',
      password: 'password'
    });
    ElMessage.success('登录成功');
  } catch (error) {
    ElMessage.error('登录失败');
  }
};

// 登出处理
const handleLogout = async () => {
  try {
    await auth.logout();
    ElMessage.success('登出成功');
  } catch (error) {
    ElMessage.error('登出失败');
  }
};

// 计算属性
const hasViewPermission = computed(() => hasPermission('view'));
const hasAdminRole = computed(() => hasRole('admin'));

// 示例代码
const checkCode = `
// 检查单个权限
if (auth.hasPermission('edit')) {
  // 有编辑权限
}

// 检查多个权限
if (auth.hasPermission(['view', 'edit'])) {
  // 同时具有查看和编辑权限
}

// 检查角色
if (auth.hasRole('admin')) {
  // 是管理员
}
`.trim();
</script>

<style scoped>
.example-container {
  padding: 20px;
}

.demo-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.demo-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo-content {
  padding: 20px 0;
}

.permission-demo {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

pre {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}

code {
  font-family: Monaco, monospace;
  font-size: 14px;
}

.mt-4 {
  margin-top: 1rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 0.5rem;
}
</style>
