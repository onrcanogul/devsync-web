import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Stack,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  GitHub as GitHubIcon,
  Sort as SortIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { UserRepositories } from '../components/UserRepositories';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

type SortOption = 'updated' | 'stars' | 'name';

const RepositoriesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <Box>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 3,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <GitHubIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              GitHub Repositories
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and explore your GitHub repositories
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2
        }}
      >
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <TextField
            placeholder="Search repositories..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 2, minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="sort-by-label">Sort by</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              startAdornment={
                <InputAdornment position="start">
                  <SortIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="updated">Last updated</MenuItem>
              <MenuItem value="stars">Most stars</MenuItem>
              <MenuItem value="name">Name</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ flex: 1 }} />

          <Tooltip title="Filter options">
            <IconButton 
              size="small"
              sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.03)
                }
              }}
            >
              <FilterIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* User Info */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Logged in as:
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {currentUser.username}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ({currentUser.email})
        </Typography>
      </Paper>

      {/* Repositories List */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 2 }}>
          <UserRepositories 
            username={currentUser.username}
            searchQuery={searchQuery}
            sortBy={sortBy}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default RepositoriesPage; 