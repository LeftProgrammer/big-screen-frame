/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			/*
			 * 保持别名的使用仅限于开发期间，避免将别名泄漏到生成的 d.ts 文件中。
			 */
		},
	},
	build: {
		lib: {
			name: 'JingheLanhai', // 修改为你的库的名称
			entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)), // 修改为库的入口文件
			formats: ['es', 'cjs', 'umd'],
			fileName: (format) => {
				switch (format) {
					case 'es':
						return 'index.mjs';
					case 'cjs':
						return 'index.cjs';
					default:
						return 'index.js';
				}
			},
		},
		minify: false, // 如果需要压缩生产环境的输出，可以将其设置为 true
		rollupOptions: {
			// 将外部依赖排除在打包之外
			external: ['vue', 'axios', 'dayjs', 'lodash-es', 'pinia'],
			output: {
				banner: `
				/**
				 *  Copyright ${new Date(Date.now()).getFullYear()} Jinghe Lanhai 
				 *  @license MIT
				**/
				`,
				exports: 'named', // 命名导出
				globals: {
					vue: 'Vue',
					axios: 'axios',
					pinia: 'Pinia',
					dayjs: 'dayjs',
					'lodash-es': '_'
				},
			},
		},
	},
	test: {
		environment: 'jsdom', // jsdom 环境下运行测试，适合与 Vue 相关的测试
	},
});
