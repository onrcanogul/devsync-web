import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Divider,
  useTheme,
  Button,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  GitHub as GitHubIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED_WIDTH = 80;

const menuItems = [
  { title: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { title: 'Analysis', icon: <AnalyticsIcon />, path: '/analysis' },
  { title: 'Repositories', icon: <GitHubIcon />, path: '/repositories' },
  { title: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          overflowX: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'flex-end',
          padding: theme.spacing(2),
          minHeight: 72,
        }}
      >
        {open && (
          <Box 
            sx={{ 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              ml: 1,
            }} 
            onClick={() => navigate('/')}
          >
            <Logo size="small" showText />
          </Box>
        )}
        <IconButton 
          onClick={onToggle}
          sx={{
            ...(open ? {} : { mx: 'auto' }),
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      
      <Divider />

      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                cursor: 'pointer',
                bgcolor: isActive ? 'action.selected' : 'transparent',
                borderRadius: '8px',
                mx: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                px: 2,
                py: 1.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.title}
                  sx={{
                    color: isActive ? 'text.primary' : 'text.secondary',
                    '& .MuiTypography-root': {
                      fontWeight: isActive ? 600 : 400,
                    },
                  }}
                />
              )}
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar; 