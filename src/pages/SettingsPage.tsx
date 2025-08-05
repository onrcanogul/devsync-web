import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Stack,
  Button,
  Chip,
  Alert,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Grid,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  GitHub as GitHubIcon,
  Key as KeyIcon,
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
    switch (activeSection) {
      case 'notifications':
        return (
          <Stack spacing={3}>
            <Typography variant="subtitle2" gutterBottom>
              Notification Preferences
            </Typography>
            <FormControlLabel
              control={<Switch checked={settings.notifications.pullRequests} />}
              label="Pull Request notifications"
            />
            <FormControlLabel
              control={<Switch checked={settings.notifications.mentions} />}
              label="Mention notifications"
            />
            <FormControlLabel
              control={<Switch checked={settings.notifications.issues} />}
              label="Issue notifications"
            />
            <FormControlLabel
              control={<Switch checked={settings.notifications.security} />}
              label="Security alerts"
            />
          </Stack>
        );

      case 'appearance':
        return (
          <Stack spacing={4}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Theme
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant={mode === 'light' ? 'contained' : 'outlined'}
                  onClick={toggleTheme}
                  sx={{ minWidth: 120 }}
                >
                  Light
                </Button>
                <Button
                  variant={mode === 'dark' ? 'contained' : 'outlined'}
                  onClick={toggleTheme}
                  sx={{ minWidth: 120 }}
                >
                  Dark
                </Button>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Preview
              </Typography>
              <Stack spacing={2}>
                <Button variant="contained">
                  Sample Button
                </Button>
                <Button variant="outlined">
                  Sample Button
                </Button>
                <Chip label="Sample Chip" color="primary" />
                <Alert severity="info">
                  Sample information message
                </Alert>
              </Stack>
            </Box>
          </Stack>
        );

      case 'email':
        return (
          <Stack spacing={3}>
            <Typography variant="subtitle2" gutterBottom>
              Email Notifications
            </Typography>
            <FormControlLabel
              control={<Switch checked={settings.email.daily} />}
              label="Daily summary"
            />
            <FormControlLabel
              control={<Switch checked={settings.email.weekly} />}
              label="Weekly summary"
            />
            <FormControlLabel
              control={<Switch checked={settings.email.mentions} />}
              label="Mention notifications"
            />
          </Stack>
        );
      default:
        return null;
    }
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