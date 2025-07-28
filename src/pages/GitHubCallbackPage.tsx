import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { authService } from '../services/authService';
import axios from 'axios';

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
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log('GitHub callback params:', {
          code,
          error,
          errorDescription,
          fullUrl: window.location.href
        });

        if (error || errorDescription) {
          throw new Error(errorDescription || 'GitHub authorization failed');
        }

        if (!code) {
          throw new Error('GitHub authorization code not found');
        }

        await authService.handleGitHubCallback(code);
        
        navigate('/', { replace: true });
      } catch (err) {
        console.error('GitHub callback error:', err);
        if (axios.isAxiosError(err)) {
          setError(`GitHub ile giriş yapılırken bir hata oluştu: ${err.response?.data?.message || err.message}`);
        } else if (err instanceof Error) {
          setError(`GitHub ile giriş yapılırken bir hata oluştu: ${err.message}`);
        } else {
          setError('GitHub ile giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
        }
      }
    };

    handleCallback();
  }, [location, navigate]);

  const handleRetry = () => {
    window.location.href = authService.getGitHubOAuthURL();
  };

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
        <>
          <Alert severity="error" sx={{ maxWidth: 400 }}>
            {error}
          </Alert>
          <Button variant="contained" color="primary" onClick={handleRetry}>
            Tekrar Dene
          </Button>
        </>
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