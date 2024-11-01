// globalStore.ts
import { defineStore } from 'pinia';
import { saveToLocalStorage, getFromLocalStorage } from './utils';

interface Route {
  path: string;
  name: string;
  meta?: Record<string, any>;
}

interface GlobalState {
  routes: Route[];
  theme: string;
  sidebarOpen: boolean;
}

export const useGlobalStore = defineStore('globalStore', {
  state: (): GlobalState => ({
    routes: getFromLocalStorage<Route[]>('routes') || [],
    theme: getFromLocalStorage<string>('theme') || 'light',
    sidebarOpen: true,
  }),

  actions: {
    setTheme(newTheme: string) {
      this.theme = newTheme;
      saveToLocalStorage('theme', newTheme);
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },

    addRoute(route: Route) {
      if (!this.routes.find(r => r.path === route.path)) {
        this.routes.push(route);
        saveToLocalStorage('routes', this.routes);
      }
    },

    resetRoutes() {
      this.routes = [];
      saveToLocalStorage('routes', this.routes);
    },
  },
});
