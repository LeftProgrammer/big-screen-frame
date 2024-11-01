// index.ts
import { createPinia } from 'pinia';
import { useAuthStore } from './authStore';
import { useGlobalStore } from './globalStore';

const pinia = createPinia();

export { pinia, useAuthStore, useGlobalStore };
