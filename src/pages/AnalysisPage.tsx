import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Skeleton } from '@mui/material';
import { AnalysisCard } from '../components/AnalysisCard';
import { FilterPanel } from '../components/FilterPanel';
import { getContextGraph } from '../services/analysisService';
import { PullRequestNode } from '../types/analysis';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const AnalysisPage: React.FC = () => {
  const [nodes, setNodes] = useState<PullRequestNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repositoryName, setRepositoryName] = useState('');

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // For now, we're using a hardcoded repoId. In a real app, this would come from the repository selection
        const data = await getContextGraph(1022561644);
        setNodes(data);
      } catch (err) {
        setError('Failed to fetch analyses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} variant="rectangular" height={200} sx={{ mb: 2 }} />
      ));
    }

    if (error) {
      return (
        <Typography color="error" align="center">
          {error}
        </Typography>
      );
    }

    if (nodes.length === 0) {
      return (
        <Typography align="center" color="textSecondary">
          No analyses found.
        </Typography>
      );
    }

    return nodes.map((node) => (
      <AnalysisCard key={node.id} node={node} />
    ));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {isLargeScreen && (
          <Box sx={{ width: '25%', minWidth: 250 }}>
            <FilterPanel
              repositoryName={repositoryName}
              onRepositoryNameChange={setRepositoryName}
            />
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          {!isLargeScreen && (
            <Box mb={3}>
              <FilterPanel
                repositoryName={repositoryName}
                onRepositoryNameChange={setRepositoryName}
              />
            </Box>
          )}
          {renderContent()}
        </Box>
      </Box>
    </Container>
  );
}; 