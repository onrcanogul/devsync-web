import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { authService } from '../services/authService';

const GitHubCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL'den code parametresini al
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (!code) {
          throw new Error('GitHub authorization code not found');
        }

        // GitHub code ile token al
        await authService.handleGitHubCallback(code);
        
        // Başarılı giriş sonrası ana sayfaya yönlendir
        navigate('/', { replace: true });
      } catch (err) {
        console.error('GitHub callback error:', err);
        setError('GitHub ile giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <Box 
      sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      {error ? (
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {error}
        </Alert>
      ) : (
        <>
          <CircularProgress size={48} />
          <Typography variant="h6" color="text.secondary">
            GitHub ile giriş yapılıyor...
          </Typography>
        </>
      )}
    </Box>
  );
};

export default GitHubCallbackPage; 