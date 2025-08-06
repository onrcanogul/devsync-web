import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { CommitAnalysisList } from '../components/CommitAnalysisList';
import {
  ArrowBack as ArrowBackIcon,
  GitHub as GitHubIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Code as CodeIcon,
  Architecture as ArchitectureIcon,
  Functions as FunctionsIcon,
} from '@mui/icons-material';
import { getPullRequestNodeById } from '../services/analysisService';
import { PullRequestNode } from '../types/analysis';

const AnalysisDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [node, setNode] = useState<PullRequestNode | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getPullRequestNodeById(parseInt(id));
        setNode(data);
      } catch (error) {
        
        setError('Failed to fetch analysis details');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

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
    if (riskScore <= 30) return <CheckCircleIcon />;
    if (riskScore <= 70) return <WarningIcon />;
    return <ErrorIcon />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !node) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Analysis not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={() => navigate('/analysis')}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {node.repository.name}
              </Typography>
              <Chip
                label={node.branch}
                size="small"
                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {node.repository.description}
            </Typography>
          </Box>
          <Tooltip title="View on GitHub">
            <IconButton
              href={node.repository.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Box>

        
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                {node.headCommitMessage}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  by {node.pusher}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  •
                </Typography>
                <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                  {node.headCommitSha.substring(0, 7)}
                </Typography>
              </Box>
            </Box>
            {node.analysis && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Tooltip title={`Risk Score: ${node.analysis.riskScore}`}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: getRiskColor(node.analysis.riskScore),
                    mb: node.analysis.riskReason ? 1 : 0
                  }}>
                    {getRiskIcon(node.analysis.riskScore)}
                    <Typography variant="h6">
                      {getRiskLabel(node.analysis.riskScore)}
                    </Typography>
                  </Box>
                </Tooltip>
                {node.analysis.riskReason && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      maxWidth: '400px',
                      textAlign: 'right',
                      lineHeight: 1.3
                    }}
                  >
                    {node.analysis.riskReason}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {node.analysis && (
          <>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                >
                  <CodeIcon />
                </Box>
                <Typography variant="h6">Technical Analysis</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {node.analysis.technicalComment}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                  }}
                >
                  <FunctionsIcon />
                </Box>
                <Typography variant="h6">Functional Analysis</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {node.analysis.functionalComment}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                  }}
                >
                  <ArchitectureIcon />
                </Box>
                <Typography variant="h6">Architectural Analysis</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {node.analysis.architecturalComment}
              </Typography>
            </Paper>
          </>
          
        )}
        {node.commits && node.commits.length > 0 && (
          <CommitAnalysisList commits={node.commits} />
        )}
      </Box>
    </Box>
  );
};

export default AnalysisDetailPage;