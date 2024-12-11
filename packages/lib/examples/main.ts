import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css'; // 添加暗色主题变量
import { ThemeManager } from '@lib/core/theme';
import '@lib/styles/index.scss';
import './styles/index.scss';

// 初始化主题管理器
const themeManager = new ThemeManager({
  enableTransition: true,
  enableElementPlus: true
});

// 设置默认主题
themeManager.setTheme('dark');
// 添加暗色主题的class
document.documentElement.classList.add('dark');

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount('#app');
