import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import dts from 'vite-plugin-dts';

// 设置 NODE_ENV
process.env.NODE_ENV = 'production';

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      },
      template: {
        compilerOptions: {
          mode: 'module',
          hoistStatic: true
        }
      }
    }),
    // Element Plus 按需引入
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: false, // 禁用自动生成 dts
      imports: ['vue', '@vueuse/core']
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: false // 禁用自动生成 dts
    }),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      outDir: 'types',
      compilerOptions: {
        declarationDir: './types',
        emitDeclarationOnly: true
      },
      beforeWriteFile: (filePath, content) => {
        return {
          filePath: filePath,
          content: content
        };
      },
      afterBuild: () => {
        // 类型构建完成后的回调
        console.log('Types generated successfully!');
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@styles': resolve(__dirname, './src/styles'),
      '@lib': resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          '@use "@/styles/base/variables.scss" as *; @use "@/styles/base/mixins.scss" as *;',
        charset: false
      }
    },
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    postcss: {
      plugins: []
    },
    devSourcemap: true,
    extract: {
      filename: 'style.css'
    }
  },
  build: {
    cssCodeSplit: false, // 不拆分 CSS
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true, // 构建前清空目标目录
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        core: resolve(__dirname, 'src/core/index.ts'),
        components: resolve(__dirname, 'src/components/index.ts'),
        application: resolve(__dirname, 'src/application/index.ts')
      }
    },
    rollupOptions: {
      external: ['vue', '@vueuse/core', 'element-plus', /^lodash-es/],
      output: [
        {
          format: 'es',
          dir: 'dist/es',
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
          preserveModules: true,
          preserveModulesRoot: 'src'
        },
        {
          format: 'cjs',
          dir: 'dist/lib',
          entryFileNames: '[name].cjs',
          chunkFileNames: 'chunks/[name]-[hash].cjs',
          assetFileNames: 'assets/[name]-[hash][extname]',
          preserveModules: true,
          preserveModulesRoot: 'src'
        }
      ]
    }
  },
  esbuild: {
    drop: ['console', 'debugger'],
    pure: ['console.log'],
    legalComments: 'none'
  },
  optimizeDeps: {
    include: ['vue', '@vueuse/core'],
    exclude: ['element-plus']
  },
  cacheDir: 'node_modules/.vite'
});
