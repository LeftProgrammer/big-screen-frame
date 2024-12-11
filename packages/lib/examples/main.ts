import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import { ThemeManager } from '@lib/core/theme';
import './utils/color';

// 导入样式文件
import '@lib/styles/index.scss';
import './styles/index.scss';
// Element Plus 暗黑模式变量必须在其他样式之后导入
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'element-plus/dist/index.css';

// 初始化主题管理器
const themeManager = new ThemeManager({
  enableTransition: true,
  enableElementPlus: true
});

// 根据系统主题设置默认主题
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = prefersDark ? 'dark' : 'light';

// 设置主题和 Element Plus 暗黑模式
themeManager.setTheme(theme);
document.documentElement.classList.toggle('dark', prefersDark);
document.documentElement.setAttribute('data-theme', theme);

const app = createApp(App);

// 使用插件
app.use(router);
app.use(ElementPlus);

// 挂载应用
app.mount('#app');
