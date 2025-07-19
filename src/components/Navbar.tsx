import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, useTheme, Box } from '@mui/material';
import { Brightness4, Brightness7, GitHub } from '@mui/icons-material';

interface NavbarProps {
  onThemeToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onThemeToggle }) => {
  const theme = useTheme();

  return (
    <AppBar 
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: 'blur(8px)',
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.9)'
          : 'rgba(255, 255, 255, 0.9)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GitHub sx={{ fontSize: 24 }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #fff 30%, #e0e0e0 90%)'
                : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            DevSync Analysis
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton 
          color="inherit" 
          onClick={onThemeToggle}
          sx={{
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'rotate(180deg)',
            },
          }}
        >
          {theme.palette.mode === 'dark' ? (
            <Brightness7 sx={{ color: '#FFD700' }} />
          ) : (
            <Brightness4 sx={{ color: '#1976d2' }} />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}; 