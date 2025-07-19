import React from 'react';
import { Paper, TextField, Box, Typography, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

interface FilterPanelProps {
  repositoryName: string;
  onRepositoryNameChange: (value: string) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  repositoryName,
  onRepositoryNameChange,
}) => {
  return (
    <Paper 
      sx={{ 
        p: 3,
        position: 'sticky',
        top: 80,
        borderRadius: 2,
        background: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
      }}
      elevation={2}
    >
      <Box>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Filters
        </Typography>
        <TextField
          fullWidth
          label="Repository Name"
          value={repositoryName}
          onChange={(e) => onRepositoryNameChange(e.target.value)}
          placeholder="e.g., facebook/react"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
        {repositoryName && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mt: 1, fontSize: '0.75rem' }}
          >
            Showing results for "{repositoryName}"
          </Typography>
        )}
      </Box>
    </Paper>
  );
}; 