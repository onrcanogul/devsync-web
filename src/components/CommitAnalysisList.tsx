import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  Chip,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Code as CodeIcon,
  Architecture as ArchitectureIcon,
  Functions as FunctionsIcon,
} from '@mui/icons-material';
import { CommitNode } from '../types/analysis';

interface CommitAnalysisListProps {
  commits: CommitNode[];
}

export const CommitAnalysisList: React.FC<CommitAnalysisListProps> = ({ commits }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange = (commitHash: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? commitHash : false);
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
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Commit Analysis ({commits.length})
        </Typography>
      </Box>
      <Divider />
      {commits.map((commit) => (
        <Accordion
          key={commit.hash}
          expanded={expanded === commit.hash}
          onChange={handleAccordionChange(commit.hash)}
          disableGutters
          elevation={0}
          sx={{
            '&:not(:last-child)': {
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            '&:before': {
              display: 'none',
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              px: 3,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.03),
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Typography
                sx={{
                  flex: 1,
                  fontFamily: 'monospace',
                  color: theme.palette.text.secondary,
                }}
              >
                {commit.hash.substring(0, 7)}
              </Typography>
              <Typography sx={{ flex: 4 }}>{commit.message}</Typography>
              {commit.analysis && (
                <Chip
                  size="small"
                  label={getRiskLabel(commit.analysis.commitRiskScore)}
                  icon={getRiskIcon(commit.analysis.commitRiskScore)}
                  sx={{
                    color: getRiskColor(commit.analysis.commitRiskScore),
                    bgcolor: alpha(getRiskColor(commit.analysis.commitRiskScore), 0.1),
                  }}
                />
              )}
            </Box>
          </AccordionSummary>
          {commit.analysis && (
            <AccordionDetails sx={{ px: 3, py: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CodeIcon fontSize="small" color="primary" />
                    <Typography variant="subtitle1" color="primary">
                      Technical Analysis
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                    {commit.analysis.technicalComment}
                  </Typography>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FunctionsIcon fontSize="small" color="secondary" />
                    <Typography variant="subtitle1" color="secondary">
                      Functional Analysis
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                    {commit.analysis.functionalComment}
                  </Typography>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ArchitectureIcon fontSize="small" color="info" />
                    <Typography variant="subtitle1" color="info">
                      Architectural Analysis
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                    {commit.analysis.architecturalComment}
                  </Typography>
                </Box>
              </Box>
            </AccordionDetails>
          )}
        </Accordion>
      ))}
    </Paper>
  );
};