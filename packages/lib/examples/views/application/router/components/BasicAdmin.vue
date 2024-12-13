<template>
  <div class="basic-admin">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>管理面板</h2>
        </div>
      </template>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" width="180" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'warning'">
              {{ row.status === 'active' ? '活跃' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" align="center">
          <template #default>
            <el-button type="primary" link>编辑</el-button>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
const tableData = [
  {
    id: 1,
    name: '测试项目 1',
    status: 'active',
    created: '2023-12-13 10:00:00'
  },
  {
    id: 2,
    name: '测试项目 2',
    status: 'inactive',
    created: '2023-12-13 11:00:00'
  },
  {
    id: 3,
    name: '测试项目 3',
    status: 'active',
    created: '2023-12-13 12:00:00'
  }
];
</script>

<style scoped>
.basic-admin {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  margin: 0;
  font-weight: 500;
  color: var(--el-text-color-primary);
}
</style>
