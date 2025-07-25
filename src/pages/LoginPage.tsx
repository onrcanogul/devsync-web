import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Paper, 
  Typography, 
  Stack,
  useTheme
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import MicrosoftIcon from '@mui/icons-material/Window';
import Logo from '../components/Logo';

const LoginPage: React.FC = () => {
  const theme = useTheme();

  const handleGitHubLogin = () => {
    window.location.href = 'https://github.com/login/oauth/authorize?client_id=YOUR_GITHUB_CLIENT_ID&scope=user,repo';
  };

  const handleMicrosoftLogin = () => {
    window.location.href = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=YOUR_MICROSOFT_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI&response_mode=query&scope=user.read';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }
          }}
        >
          <Stack spacing={2.5} width="100%">
            <Button
              variant="contained"
              startIcon={
                <Box
                  sx={{
                    bgcolor: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <GitHubIcon sx={{ fontSize: 16, color: '#24292e' }} />
                </Box>
              }
              onClick={handleGitHubLogin}
              fullWidth
              sx={{
                bgcolor: '#24292e',
                color: 'white',
                py: 2,
                fontSize: '1rem',
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(36, 41, 46, 0.2)',
                '&:hover': {
                  bgcolor: '#2c3238',
                  boxShadow: '0 6px 16px rgba(36, 41, 46, 0.3)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              GitHub ile Devam Et
            </Button>

            <Button
              variant="contained"
              startIcon={
                <Box
                  sx={{
                    bgcolor: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MicrosoftIcon sx={{ fontSize: 16, color: '#2f2f2f' }} />
                </Box>
              }
              onClick={handleMicrosoftLogin}
              fullWidth
              sx={{
                bgcolor: '#2f2f2f',
                color: 'white',
                py: 2,
                fontSize: '1rem',
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(47, 47, 47, 0.2)',
                '&:hover': {
                  bgcolor: '#404040',
                  boxShadow: '0 6px 16px rgba(47, 47, 47, 0.3)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Microsoft ile Devam Et
            </Button>
          </Stack>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mt: 4,
              textAlign: 'center',
              maxWidth: '90%',
              lineHeight: 1.6,
              opacity: 0.8
            }}
          >
            GitHub veya Microsoft hesabınızla giriş yaparak DevSync'in tüm özelliklerinden faydalanabilirsiniz.
          </Typography>
        </Paper>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mt: 4,
            textAlign: 'center',
            opacity: 0.6
          }}
        >
          © {new Date().getFullYear()} DevSync. Tüm hakları saklıdır.
        </Typography>
      </Container>
    </Box>
  );
};

export default LoginPage; 