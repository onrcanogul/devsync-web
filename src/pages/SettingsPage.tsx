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
  { id: 'notifications', icon: <NotificationsIcon />, label: 'Bildirimler' },
  { id: 'appearance', icon: <PaletteIcon />, label: 'Görünüm' },
  { id: 'email', icon: <EmailIcon />, label: 'E-posta' },
  { id: 'integrations', icon: <GitHubIcon />, label: 'Entegrasyonlar' },
  { id: 'api', icon: <KeyIcon />, label: 'API Anahtarları' },
];

const SettingsPage = () => {
  const { mode, accentColor, toggleTheme, changeAccentColor } = useTheme();
  const [activeSection, setActiveSection] = useState('notifications');
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Mock data
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
              Bildirim Tercihleri
            </Typography>
            <FormControlLabel
              control={<Switch checked={settings.notifications.pullRequests} />}
              label="Pull Request bildirimleri"
            />
            <FormControlLabel
              control={<Switch checked={settings.notifications.mentions} />}
              label="Mention bildirimleri"
            />
            <FormControlLabel
              control={<Switch checked={settings.notifications.issues} />}
              label="Issue bildirimleri"
            />
            <FormControlLabel
              control={<Switch checked={settings.notifications.security} />}
              label="Güvenlik uyarıları"
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
                  Açık
                </Button>
                <Button
                  variant={mode === 'dark' ? 'contained' : 'outlined'}
                  onClick={toggleTheme}
                  sx={{ minWidth: 120 }}
                >
                  Koyu
                </Button>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Vurgu Rengi
              </Typography>
              <Stack direction="row" spacing={2}>
                {[
                  { color: '#6366F1', name: 'Mor' },
                  { color: '#10B981', name: 'Yeşil' },
                  { color: '#F59E0B', name: 'Turuncu' },
                  { color: '#EF4444', name: 'Kırmızı' },
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
                Bu renk butonlarda, seçili öğelerde ve vurgulanmış elemanlarda kullanılacak
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Önizleme
              </Typography>
              <Stack spacing={2}>
                <Button variant="contained">
                  Örnek Buton
                </Button>
                <Button variant="outlined">
                  Örnek Buton
                </Button>
                <Chip label="Örnek Chip" color="primary" />
                <Alert severity="info">
                  Örnek bilgi mesajı
                </Alert>
              </Stack>
            </Box>
          </Stack>
        );

      case 'email':
        return (
          <Stack spacing={3}>
            <Typography variant="subtitle2" gutterBottom>
              E-posta Bildirimleri
            </Typography>
            <FormControlLabel
              control={<Switch checked={settings.email.daily} />}
              label="Günlük özet"
            />
            <FormControlLabel
              control={<Switch checked={settings.email.weekly} />}
              label="Haftalık özet"
            />
            <FormControlLabel
              control={<Switch checked={settings.email.mentions} />}
              label="Mention bildirimleri"
            />
          </Stack>
        );

      case 'integrations':
        return (
          <Stack spacing={4}>
            {/* GitHub */}
            <Paper
              variant="outlined"
              sx={{ p: 3, borderRadius: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GitHubIcon sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">
                    GitHub
                  </Typography>
                  {settings.integrations.github.connected && (
                    <Typography variant="caption" color="text.secondary">
                      {settings.integrations.github.username} • {settings.integrations.github.repositories} repositories
                    </Typography>
                  )}
                </Box>
                {settings.integrations.github.connected ? (
                  <Button variant="outlined" color="error" size="small">
                    Bağlantıyı Kes
                  </Button>
                ) : (
                  <Button variant="contained" size="small">
                    Bağlan
                  </Button>
                )}
              </Box>
              {settings.integrations.github.connected && (
                <Typography variant="caption" color="text.secondary">
                  Son senkronizasyon: {new Date(settings.integrations.github.lastSync).toLocaleString()}
                </Typography>
              )}
            </Paper>

            {/* Jira */}
            <Paper
              variant="outlined"
              sx={{ p: 3, borderRadius: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TaskIcon sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">
                    Jira
                  </Typography>
                  {settings.integrations.jira.connected && settings.integrations.jira.workspace && (
                    <Typography variant="caption" color="text.secondary">
                      {settings.integrations.jira.workspace}
                    </Typography>
                  )}
                </Box>
                {settings.integrations.jira.connected ? (
                  <Button variant="outlined" color="error" size="small">
                    Bağlantıyı Kes
                  </Button>
                ) : (
                  <Button variant="contained" size="small">
                    Bağlan
                  </Button>
                )}
              </Box>
            </Paper>

            <Paper
              variant="outlined"
              sx={{ p: 3, borderRadius: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChatIcon sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">
                    Slack
                  </Typography>
                  {settings.integrations.slack.connected && settings.integrations.slack.workspace && (
                    <Typography variant="caption" color="text.secondary">
                      {settings.integrations.slack.workspace} • {settings.integrations.slack.channels} channels
                    </Typography>
                  )}
                </Box>
                {settings.integrations.slack.connected ? (
                  <Button variant="outlined" color="error" size="small">
                    Bağlantıyı Kes
                  </Button>
                ) : (
                  <Button variant="contained" size="small">
                    Bağlan
                  </Button>
                )}
              </Box>
            </Paper>
          </Stack>
        );

      case 'api':
        return (
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2">
                API Anahtarları
              </Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                size="small"
              >
                Yeni API Anahtarı
              </Button>
            </Box>

            <Stack spacing={2}>
              {settings.apiKeys.map((key) => (
                <Paper
                  key={key.id}
                  variant="outlined"
                  sx={{ p: 3, borderRadius: 2 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">
                        {key.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Oluşturulma: {new Date(key.created).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      type={showApiKey === key.id ? 'text' : 'password'}
                      value="sk_test_51NbgYAK8z1234567890"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => setShowApiKey(showApiKey === key.id ? null : key.id)}
                            >
                              {showApiKey === key.id ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleCopy('sk_test_51NbgYAK8z1234567890', key.id)}
                            >
                              <ContentCopyIcon />
                            </IconButton>
                          </>
                        ),
                      }}
                    />
                    {copied === key.id && (
                      <Chip
                        label="Kopyalandı!"
                        color="success"
                        size="small"
                      />
                    )}
                  </Box>

                  <Stack direction="row" spacing={1}>
                    {key.scopes.map((scope) => (
                      <Chip
                        key={scope}
                        label={scope}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
        Ayarlar
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