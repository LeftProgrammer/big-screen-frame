import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import { ThemeManager } from '@lib/core/theme';
import { pinia } from './store';
import './utils/color';

// 导入样式文件
// 首先导入 Element Plus 的基础样式
import 'element-plus/dist/index.css';
// 然后导入 Element Plus 的暗黑模式变量
import 'element-plus/theme-chalk/dark/css-vars.css';
// 最后导入我们自己的样式，这样可以在需要时覆盖 Element Plus 的样式
import '@lib/styles/index.scss';
import './styles/index.scss';

// 初始化主题管理器
const themeManager = new ThemeManager({
  enableTransition: true,
  enableElementPlus: true
});

// 根据系统主题设置默认主题
themeManager.setTheme('system');

// 创建应用实例
const app = createApp(App);

// 注册插件
app.use(router);
app.use(ElementPlus);
app.use(pinia);

// 挂载应用
app.mount('#app');
