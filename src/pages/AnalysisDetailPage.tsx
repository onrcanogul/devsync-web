import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Avatar, 
  Chip, 
  Tabs, 
  Tab, 
  Link,
  Divider,
  Card,
  CardContent,
  IconButton,
  Badge,
  Stack,
} from '@mui/material';
import { 
  GitHub, 
  OpenInNew, 
  Assessment, 
  Architecture, 
  Code, 
  Commit as CommitIcon,
  BugReport,
  CheckCircle,
  Link as LinkIcon,
} from '@mui/icons-material';
import { PullRequestNode } from '../types/analysis';
import { getContextGraph } from '../services/analysisService';
import { ContextGraphVisualizer } from '../components/ContextGraphVisualizer';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analysis-tabpanel-${index}`}
      aria-labelledby={`analysis-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AnalysisCard: React.FC<{
  title: string;
  content: string;
  icon: React.ReactNode;
}> = ({ title, content, icon }) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {icon}
        <Typography variant="h6" component="h3">
          {title}
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
        {content}
      </Typography>
    </CardContent>
  </Card>
);

export const AnalysisDetailPage: React.FC = () => {
  const { repoId } = useParams<{ repoId: string }>();
  const [data, setData] = useState<PullRequestNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const nodes = await getContextGraph(Number(repoId));
        setData(nodes);
      } catch (err) {
        setError('Failed to fetch analysis data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (repoId) {
      fetchData();
    }
  }, [repoId]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getGitHubLinks = (node: PullRequestNode) => {
    // Use the repository's HTML URL as the base URL
    const baseUrl = node.repository.htmlUrl;
    
    return {
      repo: baseUrl,
      branch: `${baseUrl}/tree/${node.branch}`,
      commit: `${baseUrl}/commit/${node.headCommitSha}`,
      pr: (prId: number) => `${baseUrl}/pull/${prId}`,
    };
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 10 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error || !data.length) {
    return (
      <Container maxWidth="xl" sx={{ mt: 10 }}>
        <Typography color="error">{error || 'No data found'}</Typography>
      </Container>
    );
  }

  const currentNode = data[0];
  const githubLinks = getGitHubLinks(currentNode);

  return (
    <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Analysis Details" />
          <Tab label="Context Graph" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Stack spacing={3}>
          {/* Header Card */}
          <Paper elevation={1} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              {/* Left side - Repository info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                <Avatar 
                  src={currentNode.createdBy?.avatarUrl} 
                  sx={{ width: 64, height: 64 }}
                >
                  <GitHub sx={{ width: 40, height: 40 }} />
                </Avatar>
                <Box>
                  <Link
                    href={githubLinks.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    <Typography variant="h5">{currentNode.repository.fullName}</Typography>
                    <OpenInNew sx={{ fontSize: 20 }} />
                  </Link>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Chip 
                      size="small" 
                      icon={<CommitIcon />} 
                      label={`${currentNode.commitCount} commits`}
                    />
                    <Link
                      href={githubLinks.branch}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textDecoration: 'none' }}
                    >
                      <Chip 
                        size="small" 
                        icon={<LinkIcon />}
                        label={currentNode.branch}
                        clickable
                      />
                    </Link>
                    {currentNode.repository.language && (
                      <Chip 
                        size="small" 
                        label={currentNode.repository.language}
                        color="secondary"
                      />
                    )}
                    <Chip 
                      size="small" 
                      label={currentNode.repository.visibility}
                      color={currentNode.repository.visibility === 'public' ? 'success' : 'warning'}
                    />
                  </Box>
                  {currentNode.repository.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mt: 1 }}
                    >
                      {currentNode.repository.description}
                    </Typography>
                  )}
                </Box>
              </Box>
              
              {/* Right side - Risk score */}
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="overline" display="block">Risk Score</Typography>
                <Chip
                  label={currentNode.analysis.riskScore}
                  color={currentNode.analysis.riskScore > 5 ? 'error' : 'success'}
                  icon={currentNode.analysis.riskScore > 5 ? <BugReport /> : <CheckCircle />}
                  sx={{ fontSize: '1.2rem', padding: '16px' }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Commit Info */}
            <Box>
              <Typography variant="h6" gutterBottom>
                {currentNode.headCommitMessage}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <Typography variant="body2">
                  by {currentNode.pusher}
                </Typography>
                <Divider orientation="vertical" flexItem />
                <Link
                  href={githubLinks.commit}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    color: 'inherit',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  <CommitIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">
                    {currentNode.headCommitSha.substring(0, 7)}
                  </Typography>
                  <OpenInNew sx={{ fontSize: 14 }} />
                </Link>
              </Box>
            </Box>
          </Paper>

          {/* Analysis Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <AnalysisCard
              title="Technical Analysis"
              content={currentNode.analysis.technicalComment}
              icon={<Code color="primary" />}
            />
            <AnalysisCard
              title="Functional Analysis"
              content={currentNode.analysis.functionalComment}
              icon={<Assessment color="primary" />}
            />
            <AnalysisCard
              title="Architectural Analysis"
              content={currentNode.analysis.architecturalComment}
              icon={<Architecture color="primary" />}
            />
          </Box>

          {/* Commits Section */}
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CommitIcon />
              Commits
            </Typography>
            <Stack spacing={2}>
              {currentNode.commits.map((commit) => (
                <Paper key={commit.hash} variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {commit.message}
                    </Typography>
                    <Link
                      href={`${githubLinks.repo}/commit/${commit.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        color: 'text.secondary',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      <Typography variant="caption">
                        {commit.hash.substring(0, 7)}
                      </Typography>
                      <OpenInNew sx={{ fontSize: 12 }} />
                    </Link>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {commit.analysis.technicalComment}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>

          {/* Related PRs Section */}
          {currentNode.solves.length > 0 && (
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkIcon />
                Related Pull Requests
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {currentNode.solves.map((prId) => (
                  <Link
                    key={prId}
                    href={githubLinks.pr(prId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: 'none' }}
                  >
                    <Chip 
                      label={`#${prId}`} 
                      color="primary" 
                      variant="outlined"
                      icon={<OpenInNew sx={{ fontSize: 14 }} />}
                      clickable
                    />
                  </Link>
                ))}
              </Box>
            </Paper>
          )}
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper elevation={1} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Context Graph
          </Typography>
          <ContextGraphVisualizer nodes={data} />
        </Paper>
      </TabPanel>
    </Container>
  );
}; 