import React, { useEffect, useState } from 'react';
import { Container, Typography, Pagination, Box, Skeleton } from '@mui/material';
import { AnalysisCard } from '../components/AnalysisCard';
import { FilterPanel } from '../components/FilterPanel';
import { analysisService } from '../services/analysisService';
import { AnalysisResult } from '../types/analysis';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const PAGE_SIZE = 10;

export const AnalysisPage: React.FC = () => {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [repositoryName, setRepositoryName] = useState('');

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await analysisService.getAnalyses({
          page: page - 1,
          size: PAGE_SIZE,
          repositoryName: repositoryName || undefined,
        });
        setAnalyses(response.data);
        setTotalPages(Math.ceil(response.total / PAGE_SIZE));
      } catch (err) {
        setError('Failed to fetch analyses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [page, repositoryName]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const renderContent = () => {
    if (loading) {
      return Array.from({ length: PAGE_SIZE }).map((_, index) => (
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

    if (analyses.length === 0) {
      return (
        <Typography align="center" color="textSecondary">
          No analyses found.
        </Typography>
      );
    }

    return analyses.map((analysis) => (
      <AnalysisCard key={analysis.id} analysis={analysis} />
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
          {!loading && analyses.length > 0 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}; 