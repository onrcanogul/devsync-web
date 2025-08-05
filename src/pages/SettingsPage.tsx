import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Grid,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { UserSettings } from '../types/settings';
import { useTheme } from '../hooks/useTheme';

const menuItems = [
  { id: 'notifications', icon: <NotificationsIcon />, label: 'Notifications' },
  { id: 'appearance', icon: <PaletteIcon />, label: 'Appearance' },
  { id: 'email', icon: <EmailIcon />, label: 'Email' }
];

const SettingsPage = () => {
  const { mode, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('notifications');
  const [copied, setCopied] = useState<string | null>(null);

  const settings: UserSettings = {
    notifications: {
      pullRequests: true,
      mentions: true,
      issues: false,
      security: true,
    },
    theme: {
      mode: 'dark',
      accentColor: '#6366F1',
    },
    email: {
      daily: true,
      weekly: false,
      mentions: true,
    },
    integrations: {
      github: {
        connected: true,
        username: 'devuser',
        repositories: 25,
        lastSync: new Date().toISOString(),
      },
      jira: {
        connected: false,
      },
      slack: {
        connected: true,
        workspace: 'DevSync Team',
        channels: 3,
      },
    },
    apiKeys: [
      {
        id: '1',
        name: 'Development',
        created: '2024-01-01T00:00:00Z',
        lastUsed: '2024-03-10T00:00:00Z',
        scopes: ['read', 'write'],
      },
      {
        id: '2',
        name: 'Production',
        created: '2024-02-01T00:00:00Z',
        lastUsed: '2024-03-09T00:00:00Z',
        scopes: ['read', 'write', 'admin'],
      },
    ],
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderContent = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 300 }}>
        <Typography variant="h4" color="text.secondary">
          ✨ Coming Soon ✨
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              bgcolor: 'background.paper',
              overflow: 'hidden',
            }}
          >
            <List component="nav">
              {menuItems.map((item) => (
                <ListItemButton
                  key={item.id}
                  selected={activeSection === item.id}
                  onClick={() => setActiveSection(item.id)}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              minHeight: 400,
            }}
          >
            {renderContent()}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;