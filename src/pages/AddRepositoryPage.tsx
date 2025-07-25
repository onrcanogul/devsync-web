import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  Chip,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  ContentCopy as ContentCopyIcon,
  Webhook as WebhookIcon,
  Settings as SettingsIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { repositoryService } from '../services/repositoryService';
import { GitHubRepository, WebhookConfig } from '../types/repository';

const steps = ['Repository Seç', 'Webhook Ayarla', 'Tamamlandı'];

const AddRepositoryPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [repository, setRepository] = useState<GitHubRepository | null>(null);
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await repositoryService.addRepository(searchQuery);
      setRepository(response.repository);
      setWebhookConfig(response.webhook);
      setActiveStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleComplete = () => {
    setActiveStep(2);
  };

  const handleFinish = () => {
    navigate('/repositories');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Repository Ekle
          </Typography>
          <Typography variant="body1" color="text.secondary">
            GitHub repository'nizi ekleyerek kod analizine başlayın
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                GitHub Repository
              </Typography>
              <TextField
                fullWidth
                placeholder="örn: facebook/react"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GitHubIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: loading ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleSearch}
                        disabled={!searchQuery || loading}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mt: 2 }}
                  icon={<ErrorIcon />}
                >
                  {error}
                </Alert>
              )}
            </Box>
          </Stack>
        )}

        {activeStep === 1 && repository && webhookConfig && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Repository Detayları
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                }}
              >
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {repository.full_name}
                    </Typography>
                    <Chip
                      label={repository.private ? 'Private' : 'Public'}
                      size="small"
                      color={repository.private ? 'default' : 'success'}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {repository.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip
                      icon={<GitHubIcon sx={{ fontSize: 16 }} />}
                      label={`${repository.stargazers_count.toLocaleString()} stars`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={repository.language}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Stack>
              </Paper>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Webhook Ayarları
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Repository'nizi DevSync ile entegre etmek için aşağıdaki webhook ayarlarını GitHub'da yapılandırın.
              </Alert>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <WebhookIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Webhook URL"
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {webhookConfig.url}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleCopy(webhookConfig.url, 'url')}
                        >
                          <ContentCopyIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        {copied === 'url' && (
                          <Chip
                            label="Kopyalandı!"
                            size="small"
                            color="success"
                            sx={{ height: 24 }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Content Type"
                    secondary={webhookConfig.content_type}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <GitHubIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Events"
                    secondary={webhookConfig.events.join(', ')}
                  />
                </ListItem>
              </List>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleComplete}
                  startIcon={<CheckIcon />}
                  sx={{
                    bgcolor: '#6366F1',
                    '&:hover': { bgcolor: '#4F46E5' },
                    borderRadius: 2,
                  }}
                >
                  Webhook Ayarlarını Tamamladım
                </Button>
              </Box>
            </Box>
          </Stack>
        )}

        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Repository Başarıyla Eklendi!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              DevSync artık repository'nizdeki değişiklikleri takip edecek ve analiz edecek.
            </Typography>
            <Button
              variant="contained"
              onClick={handleFinish}
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: '#6366F1',
                '&:hover': { bgcolor: '#4F46E5' },
                borderRadius: 2,
              }}
            >
              Repository Listesine Git
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AddRepositoryPage; 