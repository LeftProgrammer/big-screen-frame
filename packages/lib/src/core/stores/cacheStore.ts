// store/cacheStore.ts
import { defineStore } from 'pinia';

// 缓存管理 Store
export const useCacheStore = defineStore('cacheStore', {
  state: () => ({
    cachedData: {} as Record<string, { data: any; timestamp: number }>,
  }),
  actions: {
    setCache(key: string, data: any, ttl = 60000) {
      this.cachedData[key] = { data, timestamp: Date.now() + ttl };
    },
    getCache(key: string) {
      const cache = this.cachedData[key];
      if (cache && Date.now() < cache.timestamp) {
        return cache.data;
      }
      return null;
    },
    clearCache(key: string) {
      delete this.cachedData[key];
    },
  },
});