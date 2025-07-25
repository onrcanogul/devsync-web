import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
  const theme = useTheme();
  
  const sizes = {
    small: { icon: 24, text: '1.2rem' },
    medium: { icon: 32, text: '1.5rem' },
    large: { icon: 48, text: '2rem' }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          borderRadius: '12px',
          p: size === 'small' ? 1 : 1.5,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <SyncIcon
          sx={{
            fontSize: sizes[size].icon,
            color: 'white',
            animation: 'spin 4s linear infinite',
            '@keyframes spin': {
              '0%': {
                transform: 'rotate(0deg)',
              },
              '100%': {
                transform: 'rotate(360deg)',
              },
            },
          }}
        />
      </Box>
      {showText && (
        <Typography
          variant="h4"
          sx={{
            fontSize: sizes[size].text,
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-0.5px',
          }}
        >
          DevSync
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 