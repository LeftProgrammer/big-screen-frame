// theme-switcher.ts
class ThemeSwitcher {
    static defaultTheme = 'light-theme';
  
    static initTheme() {
      const savedTheme = localStorage.getItem('theme') || ThemeSwitcher.defaultTheme;
      document.documentElement.className = savedTheme;
    }
  
    static toggleTheme() {
      const currentTheme = document.documentElement.className;
      const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
      ThemeSwitcher.setTheme(newTheme);
    }
  
    static setTheme(theme: 'light-theme' | 'dark-theme') {
      document.documentElement.className = theme;
      localStorage.setItem('theme', theme);
    }
  }
  
  export default ThemeSwitcher;
  