import { useState, useEffect } from 'react';
import { ThemeMode } from '../types/index.ts';

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>('system');

  useEffect(() => {
    const storedTheme = localStorage.getItem('vibex-theme') as ThemeMode | null;
    const initialTheme = storedTheme || 'system';
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(isDark ? 'dark' : 'light');

    if (theme === 'system') {
        localStorage.removeItem('vibex-theme');
    } else {
        localStorage.setItem('vibex-theme', theme);
    }
  }, [theme]);

  return { theme, setTheme };
};