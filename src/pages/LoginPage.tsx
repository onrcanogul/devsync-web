import React from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import { GitHub as GitHubIcon } from '@mui/icons-material';
import { authService } from '../services/authService';
import Logo from '../components/Logo';

const LoginPage = () => {
  const handleGitHubLogin = () => {
    window.location.href = authService.getGitHubOAuthURL();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Stack spacing={4} alignItems="center">
          <Logo />

          <Box>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
              DevSync'e Hoş Geldiniz
            </Typography>
            <Typography variant="body2" color="text.secondary">
              GitHub hesabınızla giriş yapın ve kod analizine başlayın
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<GitHubIcon />}
            onClick={handleGitHubLogin}
            sx={{
              bgcolor: '#24292e',
              '&:hover': {
                bgcolor: '#2c3238',
              },
            }}
          >
            GitHub ile Giriş Yap
          </Button>

          <Box sx={{ width: '100%' }}>
            <Divider>
              <Typography variant="caption" color="text.secondary" sx={{ px: 2 }}>
                Powered by DevSync
              </Typography>
            </Divider>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage; 