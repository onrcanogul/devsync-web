import { useState, useMemo, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'devsync-theme-preference';

export const useTheme = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // İlk yüklemede localStorage'dan tema tercihini al
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    // Eğer localStorage'da tema yoksa, sistem tercihini kontrol et
    if (!savedTheme && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    // localStorage'da tema varsa onu kullan, yoksa light tema
    return (savedTheme as ThemeMode) || 'light';
  });

  // Tema değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  // Sistem teması değiştiğinde temayı güncelle (eğer localStorage'da tema yoksa)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return {
    theme,
    toggleTheme,
    mode,
  };
}; 