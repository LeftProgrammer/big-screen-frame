import type { UserConfig, ConfigEnv } from 'vite';
import { defineConfig, transformWithEsbuild } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
//https://github.com/element-plus/unplugin-element-plus/blob/HEAD/README.zh-CN.md
import ElementPlus from 'unplugin-element-plus/vite'
import { fileURLToPath } from 'url';
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {

  // const env = loadEnv(mode, process.cwd(), '')
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(command, mode);
  return {
    plugins: [vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus({
      // useSource: true
    }),
    vueDevTools()
    ],
    publicDir: "public",
    base: "./",
    server: {
      host: true, // 监听所有地址，包括局域网和公网地址
      port: 8112, // 指定开发服务器端口号
      open: true, // 启动时自动打开浏览器
      strictPort: false, // 端口被占用时允许自动尝试下一个可用端口
      proxy: {
        // '/api': {
        //   target: 'http://localhost:3000', // 示例代理地址
        //   changeOrigin: true,
        //   rewrite: path => path.replace(/^\/api/, ''),
        // },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)), // @ 符号指向 src 目录，用于简化导入路径
        '@static': fileURLToPath(new URL('./static', import.meta.url)), // 静态资源路径别名
        // "@": resolve(__dirname, "./src"),
        // "components": resolve(__dirname, "./src/components"),
        // "api": resolve(__dirname, "./src/api"),
        '@jinghe/jinghe-lanhai':
          isProduction
            ? '@jinghe/jinghe-lanhai'               // 使用发布版本
            : '@jinghe/jinghe-lanhai/src/index.ts', // 使用本地源码
      },
    },
    css: {
      // css预处理器
      preprocessorOptions: {
        // 这里加载会导致循环使用 报错异常 导致打包错误移到main.ts 加载
        // scss: {
        //   // charset: false,
        //   additionalData: `@import "./src/assets/css/variable.scss";`,
        // },
      },
    },
    build: {
      outDir: 'dist',
      minify: isProduction, // 生产环境开启压缩
    },
    optimizeDeps: {
      exclude: ['@jinghe/jinghe-lanhai'],
    },
    app: {
      config: {
        devtools: true
      }
    }
  }

})