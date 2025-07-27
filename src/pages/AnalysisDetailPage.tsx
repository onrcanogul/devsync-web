import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress,
  Divider,
  useTheme,
  alpha,
  Button
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  GitHub as GitHubIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Circle as CircleIcon,
  BugReport as BugReportIcon,
  Code as CodeIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  Lightbulb as LightbulbIcon,
  Assignment as AssignmentIcon,
  Extension as ExtensionIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { getRepositoryAnalysis } from '../services/mockData';

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface IssueDetails {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'warning';
  message?: string;
  title?: string;
  description?: string;
  file: string;
  line?: number;
  recommendation?: string;
}

interface KeyFinding {
  title: string;
  analysis: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
}

interface Dependency {
  name: string;
  version: string;
  usage: string;
  warning?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: alpha(color, 0.1),
              color: color,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" color="text.primary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          {value}%
        </Typography>
      </Stack>
    </Paper>
  );
};

const IssueItem: React.FC<{ issue: IssueDetails }> = ({ issue }) => {
  const theme = useTheme();
  const severityColors: Record<IssueDetails['severity'], string> = {
    critical: theme.palette.error.dark,
    high: theme.palette.error.main,
    medium: theme.palette.warning.main,
    low: theme.palette.success.main,
    info: theme.palette.info.main,
    warning: theme.palette.warning.main
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <BugReportIcon sx={{ color: severityColors[issue.severity] }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            {issue.message || issue.title}
          </Typography>
          {issue.description && (
            <Typography variant="body2" color="text.secondary" paragraph>
              {issue.description}
            </Typography>
          )}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {issue.file}
              {issue.line && `:${issue.line}`}
            </Typography>
            <Chip
              label={issue.severity}
              size="small"
              sx={{
                bgcolor: alpha(severityColors[issue.severity], 0.1),
                color: severityColors[issue.severity],
                textTransform: 'capitalize'
              }}
            />
          </Stack>
          {issue.recommendation && (
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              💡 {issue.recommendation}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

interface ImpactType {
  impact: 'high' | 'medium' | 'low';
}

const ImpactChip: React.FC<ImpactType> = ({ impact }) => {
  const theme = useTheme();
  const colors: Record<ImpactType['impact'], string> = {
    high: theme.palette.error.main,
    medium: theme.palette.warning.main,
    low: theme.palette.success.main
  };
  
  return (
    <Chip
      label={impact}
      size="small"
      sx={{
        bgcolor: alpha(colors[impact], 0.1),
        color: colors[impact],
        textTransform: 'capitalize'
      }}
    />
  );
};

const FindingCard: React.FC<{ finding: KeyFinding }> = ({ finding }) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          {finding.title}
        </Typography>
        <ImpactChip impact={finding.impact} />
      </Box>
      <Typography variant="body2" paragraph>
        {finding.analysis}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.primary.main }}>
        <LightbulbIcon fontSize="small" />
        <Typography variant="body2" color="inherit">
          {finding.recommendation}
        </Typography>
      </Box>
    </Paper>
  );
};

const DependencyList: React.FC<{ title: string; dependencies: Dependency[] }> = ({ title, dependencies }) => {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      <Stack spacing={1}>
        {dependencies.map((dep) => (
          <Box
            key={dep.name}
            sx={{
              p: 2,
              bgcolor: 'background.default',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <ExtensionIcon sx={{ color: theme.palette.primary.main }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2">
                {dep.name} <Typography component="span" color="text.secondary">({dep.version})</Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {dep.usage}
              </Typography>
            </Box>
            {dep.warning && (
              <Chip
                label={dep.warning}
                size="small"
                color="warning"
                sx={{ ml: 'auto' }}
              />
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

const PatternList: React.FC<{ title: string; patterns: string[]; isGood: boolean }> = ({ title, patterns, isGood }) => {
  const theme = useTheme();
  const Icon = isGood ? TrendingUpIcon : TrendingDownIcon;
  const color = isGood ? theme.palette.success.main : theme.palette.warning.main;
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Icon sx={{ color }} />
        <Typography variant="subtitle1" color={color}>
          {title}
        </Typography>
      </Box>
      <Stack spacing={1}>
        {patterns.map((pattern, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              bgcolor: 'background.default',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2">
              {pattern}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

const AnalysisDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { repoId } = useParams();
  const analysis = getRepositoryAnalysis(Number(repoId));

  if (!analysis) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Repository bulunamadı
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/analysis')}
          sx={{ mt: 2 }}
        >
          Geri Dön
        </Button>
      </Box>
    );
  }

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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={() => navigate('/analysis')}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {analysis.name}
              </Typography>
              <Tooltip title={`Status: ${analysis.status}`}>
                {getStatusIcon(analysis.status)}
              </Tooltip>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {analysis.description}
            </Typography>
          </Box>
          <Tooltip title="GitHub'da Görüntüle">
            <IconButton
              href={analysis.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Code Quality"
            value={analysis.metrics.codeQuality}
            icon={<CodeIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Test Coverage"
            value={analysis.metrics.coverage}
            icon={<CheckCircleIcon />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Performance"
            value={analysis.metrics.performance}
            icon={<SpeedIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Security"
            value={analysis.metrics.security}
            icon={<SecurityIcon />}
            color={theme.palette.error.main}
          />
        </Grid>
      </Grid>

      {/* Detailed Analysis */}
      <Grid container spacing={3}>
        {/* Code Quality */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Code Quality Issues
            </Typography>
            <Stack spacing={2}>
              {Object.entries(analysis.detailedMetrics.codeQuality.details).map(([category, data]) => (
                <Box key={category}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                      {category}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {data.score}%
                    </Typography>
                  </Box>
                  <Stack spacing={1}>
                    {data.issues.map((issue, index) => (
                      <IssueItem key={index} issue={issue} />
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Security */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Security Issues
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                {Object.entries(analysis.detailedMetrics.security.vulnerabilities).map(([severity, count]) => (
                  <Grid item xs={6} sm={3} key={severity}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: 'background.default',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {count}
                      </Typography>
                      <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                        {severity}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Stack spacing={2}>
              {analysis.detailedMetrics.security.details.map((issue, index) => (
                <IssueItem key={index} issue={issue} />
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Test Coverage */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Test Coverage
            </Typography>
            <Stack spacing={3}>
              {Object.entries(analysis.detailedMetrics.coverage.details).map(([type, data]) => (
                <Box key={type}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                      {type} Tests
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {data.percentage}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={data.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: theme.palette.success.main,
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {data.covered} / {data.total} lines covered
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Performance */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Stack spacing={3}>
              {Object.entries(analysis.detailedMetrics.performance.details).map(([metric, data]) => (
                <Box key={metric}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                      {metric.split(/(?=[A-Z])/).join(' ')}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {data.score}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                      {data.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      (threshold: {data.threshold})
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Recent Analyses */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <TimelineIcon />
              <Typography variant="h6">
                Recent Analyses
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {analysis.recentAnalyses.map((analysis, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      {new Date(analysis.date).toLocaleDateString()}
                    </Typography>
                    <Stack spacing={1}>
                      {Object.entries(analysis.metrics).map(([metric, value]) => (
                        <Box key={metric} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                            {metric.split(/(?=[A-Z])/).join(' ')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {value}%
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Context Analysis */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <AssignmentIcon />
          <Typography variant="h6">
            Context Analysis
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="body1">
              {analysis.detailedMetrics.contextAnalysis.summary}
            </Typography>
          </Paper>
        </Box>

        <Grid container spacing={3}>
          {/* Key Findings */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Key Findings
            </Typography>
            <Grid container spacing={2}>
              {analysis.detailedMetrics.contextAnalysis.keyFindings.map((finding, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <FindingCard finding={finding} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Dependencies */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Dependencies
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DependencyList
                  title="Direct Dependencies"
                  dependencies={analysis.detailedMetrics.contextAnalysis.dependencies.direct}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DependencyList
                  title="Dev Dependencies"
                  dependencies={analysis.detailedMetrics.contextAnalysis.dependencies.dev}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Code Patterns */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Code Patterns
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <PatternList
                  title="Good Practices"
                  patterns={analysis.detailedMetrics.contextAnalysis.codePatterns.good}
                  isGood={true}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <PatternList
                  title="Areas for Improvement"
                  patterns={analysis.detailedMetrics.contextAnalysis.codePatterns.needsImprovement}
                  isGood={false}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AnalysisDetailPage; 