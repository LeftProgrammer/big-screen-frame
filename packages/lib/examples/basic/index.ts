import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 导入示例组件
import App from './App.vue'

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(ElementPlus)

// 挂载应用
app.mount('#app')
