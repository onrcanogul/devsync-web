import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  InputAdornment,
  TextField,
  Stack,
  Button,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  TrendingUp as TrendingUpIcon,
  BugReport as BugReportIcon,
  Speed as SpeedIcon,
  Code as CodeIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAnalysisData } from '../services/mockData';

// Chart component imports would go here
// import { LineChart, BarChart } from 'recharts';

const StatusChip = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return { bg: '#10B98115', color: '#10B981' };
      case 'in_progress':
        return { bg: '#6366F115', color: '#6366F1' };
      case 'queued':
        return { bg: '#F59E0B15', color: '#F59E0B' };
      default:
        return { bg: '#6B728015', color: '#6B7280' };
    }
  };

  const { bg, color } = getStatusColor();

  return (
    <Chip
      label={status.replace('_', ' ')}
      sx={{
        bgcolor: bg,
        color: color,
        textTransform: 'capitalize',
        fontWeight: 500,
      }}
      size="small"
    />
  );
};

const MetricCard = ({ title, value, icon, color }: any) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      height: '100%',
      bgcolor: 'background.paper',
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box
        sx={{
          p: 1,
          borderRadius: 2,
          bgcolor: `${color}15`,
          color: color,
          mr: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </Box>
    <Typography variant="h4" fontWeight="bold">
      {typeof value === 'number' ? value.toFixed(1) : value}
    </Typography>
  </Paper>
);

const RepositoryAnalysis = ({ repo }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/analysis/${repo.id}`);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent card click when clicking menu
    setAnchorEl(event.currentTarget);
  };

  return (
    <Paper
      elevation={0}
      onClick={handleCardClick}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'background.default',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            {repo.name}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <StatusChip status={repo.status} />
            <Typography variant="caption" color="text.secondary">
              Son analiz: {new Date(repo.lastAnalysis).toLocaleDateString()}
            </Typography>
          </Stack>
        </Box>
        <IconButton
          size="small"
          onClick={handleMenuClick}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: 2, 
        mb: 3 
      }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            Kod Kalitesi
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flex: 1, mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={repo.metrics.codeQuality}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#6366F115',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#6366F1',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
            <Typography variant="body2" fontWeight="medium">
              {repo.metrics.codeQuality}%
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            Test Kapsamı
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flex: 1, mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={repo.metrics.coverage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#10B98115',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#10B981',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
            <Typography variant="body2" fontWeight="medium">
              {repo.metrics.coverage}%
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            Performans
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flex: 1, mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={repo.metrics.performance}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#F59E0B15',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#F59E0B',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
            <Typography variant="body2" fontWeight="medium">
              {repo.metrics.performance}%
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Chip
          icon={<BugReportIcon sx={{ color: '#EF4444 !important' }} />}
          label={`${repo.issues.high} Kritik`}
          variant="outlined"
          sx={{ borderColor: '#EF444440', color: '#EF4444' }}
        />
        <Chip
          icon={<BugReportIcon sx={{ color: '#F59E0B !important' }} />}
          label={`${repo.issues.medium} Orta`}
          variant="outlined"
          sx={{ borderColor: '#F59E0B40', color: '#F59E0B' }}
        />
        <Chip
          icon={<BugReportIcon sx={{ color: '#10B981 !important' }} />}
          label={`${repo.issues.low} Düşük`}
          variant="outlined"
          sx={{ borderColor: '#10B98140', color: '#10B981' }}
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        onClick={(e) => e.stopPropagation()} // Prevent card click when clicking menu items
        PaperProps={{
          elevation: 0,
          sx: {
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <RefreshIcon sx={{ mr: 2, fontSize: 20 }} />
          Yeniden Analiz Et
        </MenuItem>
        <MenuItem onClick={() => {
          setAnchorEl(null);
          navigate(`/analysis/${repo.id}`);
        }}>
          <CodeIcon sx={{ mr: 2, fontSize: 20 }} />
          Detaylı Rapor
        </MenuItem>
      </Menu>
    </Paper>
  );
};

const AnalysisPage = () => {
  const [data, setData] = useState<any>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setData(getAnalysisData());
  }, []);

  if (!data) return <LinearProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Kod Analizleri
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            sx={{ bgcolor: '#6366F1', '&:hover': { bgcolor: '#4F46E5' } }}
          >
            Tümünü Yenile
          </Button>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)'
        },
        gap: 3,
        mb: 4
      }}>
        <MetricCard
          title="Ortalama Kod Kalitesi"
          value={85.4}
          icon={<CodeIcon />}
          color="#6366F1"
        />
        <MetricCard
          title="Test Kapsamı"
          value={76.8}
          icon={<SpeedIcon />}
          color="#10B981"
        />
        <MetricCard
          title="Toplam Issue"
          value={data.repositories.reduce((acc: number, repo: any) => 
            acc + repo.issues.high + repo.issues.medium + repo.issues.low, 0
          )}
          icon={<BugReportIcon />}
          color="#F59E0B"
        />
        <MetricCard
          title="Performans Skoru"
          value={92.3}
          icon={<TrendingUpIcon />}
          color="#EC4899"
        />
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Repository ara..."
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 300,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
            },
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          sx={{ color: 'text.primary', borderColor: 'divider' }}
        >
          Filtrele
        </Button>
      </Box>

      <Stack spacing={2}>
        {data.repositories.map((repo: any) => (
          <RepositoryAnalysis key={repo.id} repo={repo} />
        ))}
      </Stack>

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
            mt: 1.5,
            minWidth: 200,
          },
        }}
      >
        <MenuItem>Tüm Repolar</MenuItem>
        <MenuItem>Sadece Kritik Sorunlar</MenuItem>
        <MenuItem>Son 7 Gün</MenuItem>
        <MenuItem>Son 30 Gün</MenuItem>
      </Menu>
    </Box>
  );
};

export default AnalysisPage; 