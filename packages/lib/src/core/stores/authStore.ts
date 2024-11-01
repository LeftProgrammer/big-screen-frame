// authStore.ts
import { defineStore } from 'pinia';
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from './utils';

export interface User {
  id: string;
  name: string;
  token: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('authStore', {
  state: (): AuthState => ({
    user: getFromLocalStorage<User>('user') || null,
    isAuthenticated: !!getFromLocalStorage<User>('user'),
  }),
  
  actions: {
    login(userData: User) {
      this.user = userData;
      this.isAuthenticated = true;
      saveToLocalStorage('user', userData);
    },
    
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      removeFromLocalStorage('user');
    },

    hasPermission(permission: string): boolean {
      return this.user?.roles.includes(permission) || false;
    },
  },
});
