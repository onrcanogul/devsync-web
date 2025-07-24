import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Brightness4 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onThemeToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onThemeToggle }) => {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={handleTitleClick}
        >
          DevSync
        </Typography>
        <Box>
          <IconButton color="inherit" onClick={onThemeToggle}>
            <Brightness4 />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 