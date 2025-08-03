import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Circle as CircleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Commit as CommitIcon,
} from '@mui/icons-material';
import { getPullRequestNodes } from '../services/analysisService';
import { PullRequestNode } from '../types/analysis';

const ITEMS_PER_PAGE = 15;

const AnalysisPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pullRequestNodes, setPullRequestNodes] = useState<PullRequestNode[]>([]);

  // Get current page from URL or default to 1
  const currentPage = parseInt(new URLSearchParams(location.search).get('page') || '1', 10);

  useEffect(() => {
    const fetchPullRequestNodes = async () => {
      try {
        setLoading(true);
        setError(null);
        const nodes = await getPullRequestNodes();
        if (!nodes || nodes.length === 0) {
          setError('No pull request nodes found');
          return;
        }
        setPullRequestNodes(nodes);
      } catch (error) {
        console.error('Error fetching pull request nodes:', error);
        setError('Failed to fetch pull request nodes');
      } finally {
        setLoading(false);
      }
    };

    fetchPullRequestNodes();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(pullRequestNodes.length / ITEMS_PER_PAGE);
  const validPage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const paginatedNodes = pullRequestNodes.slice(
    (validPage - 1) * ITEMS_PER_PAGE,
    validPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/analysis?page=${value}`);
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore <= 30) return theme.palette.success.main;
    if (riskScore <= 70) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getRiskIcon = (riskScore: number) => {
    if (riskScore <= 30) return <CheckCircleIcon fontSize="small" />;
    if (riskScore <= 70) return <WarningIcon fontSize="small" />;
    return <ErrorIcon fontSize="small" />;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
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

  if (pullRequestNodes.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No pull request nodes available.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Pull Request Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analysis results of your pull requests
          </Typography>
        </Box>
        {totalPages > 1 && (
          <Typography variant="body2" color="text.secondary">
            Page {validPage} of {totalPages}
          </Typography>
        )}
      </Box>

      <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
        {paginatedNodes.map((node) => (
          <ListItem
            key={node.id}
            component="div"
            sx={{
              py: 2,
              px: 3,
              borderBottom: `1px solid ${theme.palette.divider}`,
              '&:last-child': {
                borderBottom: 'none',
              },
              cursor: 'pointer !important',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.03),
              },
            }}
            onClick={() => navigate(`/analysis/${node.id}`)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
              {/* Commit Icon */}
              <CommitIcon sx={{ color: 'text.secondary', fontSize: 20 }} />

              {/* Main Content */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {node.headCommitMessage}
                  </Typography>
                  {node.analysis && (
                    <Tooltip title={`Risk Score: ${node.analysis.riskScore}`}>
                      <Box sx={{ color: getRiskColor(node.analysis.riskScore) }}>
                        {getRiskIcon(node.analysis.riskScore)}
                      </Box>
                    </Tooltip>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Repository Name */}
                  <Typography variant="caption" color="text.secondary">
                    {node.repository?.name}
                  </Typography>

                  {/* Branch */}
                  <Typography variant="caption" color="text.secondary">
                    • {node.branch}
                  </Typography>

                  {/* Author */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      • by {node.pusher}
                    </Typography>
                  </Box>

                  {/* Commit Hash */}
                  <Tooltip title="Commit Hash">
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontFamily: 'monospace',
                        color: 'text.secondary',
                      }}
                    >
                      • {node.headCommitSha.substring(0, 7)}
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>

              {/* GitHub Link */}
              {node.repository?.htmlUrl && (
                <Tooltip title="View on GitHub">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(node.repository.htmlUrl, '_blank');
                    }}
                    sx={{ color: 'text.secondary' }}
                  >
                    <GitHubIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </ListItem>
        ))}
      </List>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={validPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};

export default AnalysisPage;