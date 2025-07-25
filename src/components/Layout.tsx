import React, { useState } from 'react';
import { Box, useTheme as useMuiTheme } from '@mui/material';
import { Navbar } from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const muiTheme = useMuiTheme();
  const { toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: `linear-gradient(135deg, ${muiTheme.palette.background.default} 0%, ${muiTheme.palette.background.paper} 100%)`,
      }}
    >
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Navbar onThemeToggle={toggleTheme} />
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            p: 3,
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 