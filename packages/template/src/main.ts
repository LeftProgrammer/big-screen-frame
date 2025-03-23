import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 引入lib包核心功能
import { $http, $auth, $layout, $theme, $utils, $components } from '@jinghe/jinghe-lanhai'
import type { AxiosRequestConfig } from 'axios'

import App from './App.vue'
import router from './router'

import '@/assets/css/main.scss'
import '@/assets/css/tailwind.css'
import '@/assets/css/variable.scss';

/** init domain config */
import './config/UtilVar.ts'

import '../public/static/font/font.css';
import '../public/static/font/iconFont.css';

import {registerEcharts} from "@/plugins/echarts"
//不使用mock 请注释掉
// import { mockXHR } from "@/mock/index";
// mockXHR()

// 初始化HTTP配置
import UtilVar from "./config/UtilVar";
try {
  // 尝试使用新API
  $http.setBaseURL(UtilVar.baseUrl);
  $http.setTimeout(10000);
  $http.setWithCredentials(true);
  
  // 添加token请求拦截器
  $http.addRequestInterceptor(
    (config: AxiosRequestConfig) => {
      // 获取token (临时使用本地的useUserStore)
      const token = localStorage.getItem('ACCESS_TOKEN');
      if (token) {
        config.headers = config.headers || {};
        config.headers['X-Access-Token'] = token;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
} catch(e) {
  console.error('HTTP模块初始化失败，请检查库版本', e);
}

const app = createApp(App)
registerEcharts(app)
app.use(createPinia())
app.use(router)

app.mount('#app')
