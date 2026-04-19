import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'user-theme';
  isDark = signal<boolean>(false);

  constructor() {
    this.loadTheme();
  }

  toggleTheme() {
    this.isDark.set(!this.isDark());
    this.applyTheme();
    localStorage.setItem(this.THEME_KEY, this.isDark() ? 'dark' : 'light');
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      this.isDark.set(savedTheme === 'dark');
    } else {
      this.isDark.set(prefersDark);
    }
    this.applyTheme();
  }

  private applyTheme() {
    const theme = this.isDark() ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    // Also apply a transition effect
    document.documentElement.classList.add('theme-transition');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
  }
}
