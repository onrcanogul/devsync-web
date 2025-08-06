import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Box, 
  useTheme as useMuiTheme,
  Stack,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { authService } from '../services/authService';

interface NavbarProps {
  onThemeToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onThemeToggle }) => {
  const muiTheme = useMuiTheme();
  const { mode } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const currentUser = authService.getCurrentUser();

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Change Theme">
            <IconButton 
              onClick={onThemeToggle} 
              sx={{ 
                color: mode === 'dark' ? 'text.primary' : 'text.secondary',
                transition: 'transform 0.2s',
                '&:hover': {
                  bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  transform: 'rotate(30deg)',
                },
              }}
              size="large"
            >
              <ColorLensIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Account settings">
            <IconButton
              onClick={handleProfileClick}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar 
                src={currentUser?.avatarUrl}
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: muiTheme.palette.primary.main
                }}
              >
                <PersonIcon sx={{ fontSize: 20 }} />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Stack>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
              mt: 1.5,
              width: 200,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleClose}>
            <Avatar src={currentUser?.avatarUrl} />
            {currentUser?.username || 'User'}
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => navigate('/settings')}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;