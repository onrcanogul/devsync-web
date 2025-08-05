import { useMemo, useState, useEffect } from 'react';
import { createTheme, Theme } from '@mui/material';

type ThemeMode = 'light' | 'dark';
type AccentColor = '#6366F1' | '#10B981' | '#F59E0B' | '#EF4444';

const THEME_MODE_KEY = 'theme-mode';
const ACCENT_COLOR_KEY = 'accent-color';

export const useTheme = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem(THEME_MODE_KEY);
    return (savedMode as ThemeMode) || 'dark';
  });

  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    const savedColor = localStorage.getItem(ACCENT_COLOR_KEY);
    return (savedColor as AccentColor) || '#6366F1';
  });

  const theme = useMemo(() => {
    // Force theme recreation on mode change
    const baseTheme = createTheme({
      palette: {
        mode,
        primary: {
          main: accentColor,
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
                backgroundColor: mode === 'dark' 
                  ? `${accentColor}15`
                  : `${accentColor}15`,
                color: accentColor,
                '&:hover': {
                  backgroundColor: mode === 'dark'
                    ? `${accentColor}25`
                    : `${accentColor}25`,
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

    return baseTheme;
  }, [mode, accentColor]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem(THEME_MODE_KEY, newMode);
  };

  const changeAccentColor = (color: AccentColor) => {
    setAccentColor(color);
    localStorage.setItem(ACCENT_COLOR_KEY, color);
  };

  useEffect(() => {
    // Update body background color and force theme update
    document.body.style.backgroundColor = theme.palette.background.default;
    document.documentElement.style.colorScheme = mode;
  }, [theme, mode]);

  return { theme, mode, accentColor, toggleTheme, changeAccentColor };
}; 