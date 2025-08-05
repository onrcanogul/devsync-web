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
  IconButton,
  TextField,
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
  Delete as DeleteIcon,
  Add as AddIcon,
  ContentCopy as ContentCopyIcon,
  Palette as PaletteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Chat as ChatIcon,
  TaskAlt as TaskIcon,
} from '@mui/icons-material';
import { UserSettings } from '../types/settings';
import { useTheme } from '../hooks/useTheme';

const menuItems = [
  { id: 'notifications', icon: <NotificationsIcon />, label: 'Notifications' },
  { id: 'appearance', icon: <PaletteIcon />, label: 'Appearance' },
  { id: 'email', icon: <EmailIcon />, label: 'Email' },
  { id: 'integrations', icon: <GitHubIcon />, label: 'Integrations' },
  { id: 'api', icon: <KeyIcon />, label: 'API Keys' },
];

const SettingsPage = () => {
  const { mode, accentColor, toggleTheme, changeAccentColor } = useTheme();
  const [activeSection, setActiveSection] = useState('notifications');
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
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
                Tema
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
                Accent Color
              </Typography>
              <Stack direction="row" spacing={2}>
                {[
                  { color: '#6366F1', name: 'Purple' },
                  { color: '#10B981', name: 'Green' },
                  { color: '#F59E0B', name: 'Orange' },
                  { color: '#EF4444', name: 'Red' },
                ].map((item) => (
                  <Box
                    key={item.color}
                    onClick={() => changeAccentColor(item.color as any)}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: item.color,
                      cursor: 'pointer',
                      border: accentColor === item.color ? '3px solid white' : 'none',
                      boxShadow: accentColor === item.color ? '0 0 0 2px ' + item.color : 'none',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                      position: 'relative',
                      '&::after': accentColor === item.color ? {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        opacity: 0.3,
                      } : {},
                    }}
                  />
                ))}
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                This color will be used in buttons, selected items, and highlighted elements
              </Typography>
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