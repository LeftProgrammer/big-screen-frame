import type { UserConfig, ConfigEnv } from 'vite';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import dts from 'vite-plugin-dts'

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const isExample = mode === 'development' && command === 'serve'

  return {
    plugins: [
      vue({
        script: {
          defineModel: true,
          propsDestructure: true
        },
        template: {
          compilerOptions: {
            mode: 'module',
            hoistStatic: true,
            prefixIdentifiers: true
          },
          transformAssetUrls: {
            includeAbsolute: false
          }
        },
        // 禁用运行时编译
        isProduction: true,
        reactivityTransform: false
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      ElementPlus(),
      dts({
        include: ['src/**/*.ts', 'src/**/*.vue'],
        exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
        outDir: 'types',
        tsconfigPath: './tsconfig.json',
        clearPureImport: true,
        skipDiagnostics: false,
        rollupTypes: true,
        insertTypesEntry: true,
        staticImport: true,
        copyDtsFiles: true,
        aliasesExclude: [/\.(css|less|sass|scss|styl|stylus|pcss|postcss)$/]
      })
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
      // 禁用运行时编译
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    },
    publicDir: isExample ? "public" : false,
    base: "./",
    server: {
      host: '0.0.0.0',
      port: 8000,
      open: false,
      strictPort: false,
    },
    resolve: {
      alias: {
        "~": resolve(__dirname, "."),
        "@": resolve(__dirname, "src"),
        "components": resolve(__dirname, "src/components"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/base/variables.scss" as *;`,
        },
      },
    },
    root: isExample ? 'examples' : undefined,
    build: isExample ? undefined : {
      outDir: 'dist',
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
        external: ['vue', 'element-plus', 'echarts', 'pinia', '@vueuse/core', 'lodash-es'],
        output: [
          {
            format: 'cjs',
            preserveModules: true,
            preserveModulesRoot: 'src',
            exports: 'named',
            hoistTransitiveImports: false,
            entryFileNames: '[name].cjs',
            chunkFileNames: '[name].cjs',
            assetFileNames: '[name].[ext]',
            globals: {
              vue: 'Vue',
              'element-plus': 'ElementPlus',
              echarts: 'echarts',
              pinia: 'Pinia',
              '@vueuse/core': 'VueUse',
              'lodash-es': '_'
            }
          },
          {
            format: 'es',
            preserveModules: true,
            preserveModulesRoot: 'src',
            exports: 'named',
            hoistTransitiveImports: false,
            entryFileNames: '[name].js',
            chunkFileNames: '[name].js',
            assetFileNames: '[name].[ext]',
            globals: {
              vue: 'Vue',
              'element-plus': 'ElementPlus',
              echarts: 'echarts',
              pinia: 'Pinia',
              '@vueuse/core': 'VueUse',
              'lodash-es': '_'
            }
          }
        ]
      },
      minify: 'esbuild',
      sourcemap: true,
      chunkSizeWarningLimit: 2000
    }
  }
})
