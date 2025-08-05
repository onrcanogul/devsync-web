import { useState, useEffect } from 'react';
import { createTheme, Theme } from '@mui/material';

type ThemeMode = 'light' | 'dark';

const THEME_MODE_KEY = 'theme-mode';

export const useTheme = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem(THEME_MODE_KEY);
    return (savedMode as ThemeMode) || 'dark';
  });

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366F1',
      },
      background: {
        default: mode === 'dark' ? '#0F172A' : '#F8FAFC',
        paper: mode === 'dark' ? '#1E293B' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#F8FAFC' : '#1E293B',
        secondary: mode === 'dark' ? '#94A3B8' : '#64748B',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&.Mui-selected': {
              backgroundColor: mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              color: '#6366F1',
              '&:hover': {
                backgroundColor: mode === 'dark' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.25)',
              },
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: 'inherit',
          },
        },
      },
    },
  });

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
    document.documentElement.style.colorScheme = mode;
  }, [theme, mode]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    localStorage.setItem(THEME_MODE_KEY, newMode);
    setMode(newMode);
  };

  return { theme, mode, toggleTheme };
};