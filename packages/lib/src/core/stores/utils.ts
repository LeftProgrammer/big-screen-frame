// utils.ts
export function saveToLocalStorage<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  export function getFromLocalStorage<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  
  export function removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }
  