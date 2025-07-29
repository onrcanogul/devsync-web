import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Chip,
  Pagination,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Code as CodeIcon,
  Commit as CommitIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Launch as LaunchIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { getAnalysisData } from '../services/mockData';

type LanguageColorType = {
  [key: string]: string;
};

const languageColors: LanguageColorType = {
  TypeScript: '#2b7489',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  PowerShell: '#012456',
  Vue: '#41b883',
  React: '#61dafb',
  Angular: '#dd1b16',
  default: '#6e768166'
};

const LanguageDisplay: React.FC<{ language: string }> = ({ language }) => {
  const color = languageColors[language] || languageColors.default;
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          bgcolor: color,
        }}
      />
      <Typography variant="body2" color="text.secondary">
        {language}
      </Typography>
    </Box>
  );
};

const ITEMS_PER_PAGE = 10;

const AnalysisPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { repositories } = getAnalysisData();

  // Get current page from URL or default to 1
  const currentPage = parseInt(new URLSearchParams(location.search).get('page') || '1', 10);

  // Combine and sort all commits by date
  const allCommits = repositories.flatMap(repo => ({
    id: repo.id,
    repository: repo.repository,
    headCommitMessage: repo.headCommitMessage,
    headCommitSha: repo.headCommitSha,
    pusher: repo.pusher,
    branch: repo.branch,
    analysis: repo.analysis,
    lastAnalysis: repo.lastAnalysis
  })).sort((a, b) => new Date(b.lastAnalysis).getTime() - new Date(a.lastAnalysis).getTime());

  // Calculate pagination
  const totalPages = Math.ceil(allCommits.length / ITEMS_PER_PAGE);
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedCommits = allCommits.slice(
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

  const getRiskLabel = (riskScore: number) => {
    if (riskScore <= 30) return 'Low Risk';
    if (riskScore <= 70) return 'Medium Risk';
    return 'High Risk';
  };

  const getRiskIcon = (riskScore: number) => {
    if (riskScore <= 30) return <CheckCircleIcon fontSize="small" />;
    if (riskScore <= 70) return <WarningIcon fontSize="small" />;
    return <ErrorIcon fontSize="small" />;
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Commit Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analysis results of recent commits
          </Typography>
        </Box>
        {totalPages > 1 && (
          <Typography variant="body2" color="text.secondary">
            Page {validPage} of {totalPages}
          </Typography>
        )}
      </Box>

      <Grid container spacing={3}>
        {paginatedCommits.map((commit) => (
          <Grid item xs={12} key={commit.id}>
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
              onClick={() => navigate(`/analysis/${commit.id}`)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
                  {/* Repository Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {commit.repository.name}
                    </Typography>
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        bgcolor: 'text.disabled',
                      }}
                    />
                    <LanguageDisplay language={commit.repository.language} />
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        bgcolor: 'text.disabled',
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(commit.lastAnalysis).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>

                  {/* Commit Message */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {commit.headCommitMessage}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {commit.headCommitSha.substring(0, 7)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        pushed to {commit.branch} by {commit.pusher}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Risk Score */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      icon={getRiskIcon(commit.analysis.riskScore)}
                      label={`${getRiskLabel(commit.analysis.riskScore)} (${commit.analysis.riskScore})`}
                      size="small"
                      sx={{
                        bgcolor: alpha(getRiskColor(commit.analysis.riskScore), 0.1),
                        color: getRiskColor(commit.analysis.riskScore),
                        '& .MuiChip-icon': {
                          color: 'inherit',
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Detailed Analysis">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/analysis/${commit.id}`);
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
                  <Tooltip title="View on GitHub">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(commit.repository.htmlUrl, '_blank');
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

      {totalPages > 1 && (
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={validPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: '1rem',
              },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Showing {((validPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(validPage * ITEMS_PER_PAGE, allCommits.length)} of {allCommits.length} commits
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AnalysisPage; 