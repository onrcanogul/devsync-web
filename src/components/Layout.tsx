import React, { useState } from 'react';
import { Box, useTheme as useMuiTheme } from '@mui/material';
import { Navbar } from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  onThemeToggle: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onThemeToggle }) => {
  const muiTheme = useMuiTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
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
        <Navbar onThemeToggle={onThemeToggle} />
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