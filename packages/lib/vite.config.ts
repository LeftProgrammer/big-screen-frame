/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      outputDir: 'types'
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'types/auto-imports.d.ts'
    }),
    Components({
      dirs: ['src/components'],
      dts: 'types/components.d.ts'
    })
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        core: resolve(__dirname, 'src/core/index.ts'),
        components: resolve(__dirname, 'src/components/index.ts'),
        application: resolve(__dirname, 'src/application/index.ts')
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['vue', 'element-plus', 'echarts', 'pinia', 'vue-router'],
      output: {
        preserveModules: true,
        preserveModuleRoot: 'src',
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          'echarts': 'echarts'
        }
      }
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
