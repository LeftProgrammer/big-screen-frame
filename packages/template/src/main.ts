import { createApp } from 'vue'
import { createPinia } from 'pinia'

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



const app = createApp(App)
registerEcharts(app)
app.use(createPinia())
app.use(router)

app.mount('#app')
