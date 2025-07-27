import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Link
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  BugReport as BugReportIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
  CallSplit as CallSplitIcon,
  Commit as CommitIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Circle as CircleIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { getConnectedRepositories } from '../services/mockData';

const MetricProgress: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const theme = useTheme();
  const color = value >= 90 ? theme.palette.success.main :
                value >= 70 ? theme.palette.warning.main :
                theme.palette.error.main;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {value}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 6,
          borderRadius: 3,
          bgcolor: alpha(color, 0.1),
          '& .MuiLinearProgress-bar': {
            bgcolor: color,
            borderRadius: 3,
          },
        }}
      />
    </Box>
  );
};

const AnalysisPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const repositories = getConnectedRepositories();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'error':
        return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return <CircleIcon sx={{ color: theme.palette.grey[500] }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
          Repository Analizleri
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Webhook ile bağlı repository'lerin analiz sonuçları
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {repositories.map((repo) => (
          <Grid item xs={12} key={repo.id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                },
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
              }}
              onClick={() => navigate(`/analysis/${repo.id}`)}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="h6">
                          {repo.name}
                        </Typography>
                        <Tooltip title={`Status: ${repo.status}`}>
                          {getStatusIcon(repo.status)}
                        </Tooltip>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {repo.description}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Metrics */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricProgress value={repo.metrics.codeQuality} label="Code Quality" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricProgress value={repo.metrics.coverage} label="Test Coverage" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricProgress value={repo.metrics.performance} label="Performance" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <MetricProgress value={repo.metrics.security} label="Security" />
                    </Grid>
                  </Grid>

                  {/* Stats */}
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CommitIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {repo.recentCommits} commits
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CallSplitIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {repo.openPRs} open PRs
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CodeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {repo.language}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Son analiz: {new Date(repo.lastAnalysis).toLocaleDateString()}
                    </Typography>
                  </Stack>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Detaylı Analiz">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/analysis/${repo.id}`);
                      }}
                      sx={{
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <LaunchIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="GitHub'da Görüntüle">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(repo.html_url, '_blank');
                      }}
                      sx={{
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <GitHubIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AnalysisPage; 