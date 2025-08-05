import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  LinearProgress,
  Divider,
  Chip,
  Avatar,
  Stack,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Code as CodeIcon,
  BugReport as BugReportIcon,
  Architecture as ArchitectureIcon,
  Functions as FunctionsIcon,
} from '@mui/icons-material';
import { getUserPullRequestNodes } from '../services/analysisService';
import { PullRequestNode } from '../types/analysis';
import { authService } from '../services/authService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pullRequestNodes, setPullRequestNodes] = useState<PullRequestNode[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          setError('User not found');
          return;
        }

        const nodes = await getUserPullRequestNodes(currentUser.username);
        setPullRequestNodes(nodes);
      } catch (error) {
        
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Risk score functionality temporarily removed
  /*
  const getRiskColor = (riskScore: number) => {
    if (riskScore <= 30) return '#10B981';
    if (riskScore <= 70) return '#F59E0B';
    return '#EF4444';
  };

  const getRiskIcon = (riskScore: number) => {
    if (riskScore <= 30) return <CheckCircleIcon />;
    if (riskScore <= 70) return <WarningIcon />;
    return <ErrorIcon />;
  };

  const calculateAverageRisk = () => {
    if (pullRequestNodes.length === 0) return 0;
    const totalRisk = pullRequestNodes.reduce((acc, node) => acc + (node.analysis?.riskScore || 0), 0);
    return Math.round(totalRisk / pullRequestNodes.length);
  };
  */

  const getRepositoryStats = () => {
    const stats = new Map<string, number>();
    pullRequestNodes.forEach(node => {
      const repoName = node.repository.name;
      stats.set(repoName, (stats.get(repoName) || 0) + 1);
    });
    return Array.from(stats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const averageRisk = calculateAverageRisk();
  const repoStats = getRepositoryStats();

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Pull Request Analytics Dashboard
        </Typography>
        <Chip
          icon={<TrendingUpIcon />}
          label="Risk Score: Coming Soon"
          color="default"
        />
      </Box>

      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              bgcolor: 'background.paper',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" fontWeight="bold">
                {pullRequestNodes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Pull Requests
              </Typography>
            </Box>
            <CodeIcon
              sx={{
                position: 'absolute',
                right: -10,
                bottom: -10,
                fontSize: 100,
                color: 'rgba(0,0,0,0.03)',
                transform: 'rotate(-15deg)',
              }}
            />
          </Paper>
        </Grid>

        
        <Grid item xs={12} md={9}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              bgcolor: 'background.paper',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Risk Score
            </Typography>
            <Typography variant="h4" color="text.secondary" sx={{ mt: 2 }}>
              Coming Soon
            </Typography>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      
      <Grid container spacing={3}>
        
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Top Repositories
            </Typography>
            <Stack spacing={2}>
              {repoStats.map(([repo, count]) => (
                <Box key={repo}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{repo}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {count} PRs
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(count / pullRequestNodes.length) * 100}
                    sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)' }}
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Pull Requests
            </Typography>
            <Stack spacing={2}>
              {pullRequestNodes.slice(0, 5).map((node) => (
                <Box
                  key={node.id}
                  sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => navigate(`/analysis/${node.id}`)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {/* Risk score avatar temporarily removed 
                    <Avatar
                      sx={{
                        bgcolor: getRiskColor(node.analysis?.riskScore || 0),
                        width: 32,
                        height: 32,
                      }}
                    >
                      {getRiskIcon(node.analysis?.riskScore || 0)}
                    </Avatar>
                    */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {node.repository.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={node.branch}
                          sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)' }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {node.headCommitMessage}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          by {node.pusher}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          • {node.commitCount} commits
                        </Typography>
                      </Box>
                    </Box>
                    {node.repository.htmlUrl && (
                      <Tooltip title="View on GitHub">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(node.repository.htmlUrl, '_blank');
                          }}
                        >
                          <GitHubIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;