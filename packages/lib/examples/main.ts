import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { ThemeManager } from '@lib/core/theme';
import '@lib/styles/index.scss';
import './styles/index.scss';

// 初始化主题管理器
const themeManager = new ThemeManager({
  enableTransition: true,
  enableElementPlus: true
});

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount('#app');
