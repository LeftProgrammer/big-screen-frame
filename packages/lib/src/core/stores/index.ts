// index.ts
import { createPinia } from 'pinia';
import { useThemeStore } from './themeStore';
import { useAuthStore } from './authStore';
import { useGlobalStore } from './globalStore';

const pinia = createPinia();

export { pinia, useThemeStore, useAuthStore, useGlobalStore };
