import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Chip,
  LinearProgress,
  Stack,
  IconButton,
  Tooltip,
  Button,
  Divider,
  Avatar,
  Grid,
} from '@mui/material';
import {
  Commit as CommitIcon,
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  BugReport as BugReportIcon,
  Speed as SpeedIcon,
  Code as CodeIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CommitDetailModal from '../components/CommitDetailModal';
import CommitFilterPanel, { CommitFilters } from '../components/CommitFilterPanel';

const CommitAnalysis = ({ commit }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Paper
        elevation={0}
        onClick={() => setIsModalOpen(true)}
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'background.default',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar src={commit.author.avatar} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {commit.message}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {commit.author.name} • {new Date(commit.date).toLocaleDateString()}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={commit.type}
            sx={{
              minWidth: 'auto',
              bgcolor: 
                commit.type === 'feature' ? '#10B98115' :
                commit.type === 'bugfix' ? '#EF444415' :
                commit.type === 'refactor' ? '#6366F115' :
                '#F59E0B15',
              color:
                commit.type === 'feature' ? '#10B981' :
                commit.type === 'bugfix' ? '#EF4444' :
                commit.type === 'refactor' ? '#6366F1' :
                '#F59E0B',
            }}
          />
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
          },
          gap: 2 
        }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Değişen Dosyalar
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {commit.stats.changedFiles}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Eklenen Satırlar
            </Typography>
            <Typography variant="h6" sx={{ color: '#10B981', fontWeight: 600 }}>
              +{commit.stats.additions}
            </Typography>
          </Box>
          <Box sx={{ 
            gridColumn: { 
              xs: 'span 2',
              sm: 'auto'
            }
          }}>
            <Typography variant="caption" color="text.secondary">
              Silinen Satırlar
            </Typography>
            <Typography variant="h6" sx={{ color: '#EF4444', fontWeight: 600 }}>
              -{commit.stats.deletions}
            </Typography>
          </Box>
        </Box>

        {commit.analysis && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Commit Analizi
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {commit.analysis}
            </Typography>
          </Box>
        )}
      </Paper>

      <CommitDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        commit={commit}
      />
    </>
  );
};

const AnalysisDetailPage = () => {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CommitFilters>({
    search: '',
    types: [],
    authors: [],
    dateRange: [1, 90],
    impactScore: [0, 100],
    onlyWithAnalysis: false,
  });

  // Mock data for demonstration
  const repoDetails = {
    name: 'frontend-app',
    description: 'Modern web uygulaması frontend kodu',
    metrics: {
      codeQuality: 85,
      coverage: 76,
      performance: 92,
    },
    commits: [
      {
        id: 1,
        message: 'Authentication sistemi güncellendi',
        type: 'feature',
        author: {
          name: 'Ahmet Yılmaz',
          avatar: 'https://ui-avatars.com/api/?name=AY&background=random',
        },
        date: '2024-03-10',
        stats: {
          changedFiles: 12,
          additions: 345,
          deletions: 123,
        },
        analysis: 'Bu commit ile authentication sistemi JWT tabanlı yapıya geçirildi. Güvenlik iyileştirmeleri ve performans optimizasyonları yapıldı.',
      },
      {
        id: 2,
        message: 'API entegrasyonu hataları giderildi',
        type: 'bugfix',
        author: {
          name: 'Mehmet Demir',
          avatar: 'https://ui-avatars.com/api/?name=MD&background=random',
        },
        date: '2024-03-09',
        stats: {
          changedFiles: 5,
          additions: 67,
          deletions: 45,
        },
        analysis: 'API çağrılarındaki hata yönetimi iyileştirildi. Error boundary ve retry mekanizmaları eklendi.',
      },
      {
        id: 3,
        message: 'Component mimarisi yeniden düzenlendi',
        type: 'refactor',
        author: {
          name: 'Ayşe Kaya',
          avatar: 'https://ui-avatars.com/api/?name=AK&background=random',
        },
        date: '2024-03-08',
        stats: {
          changedFiles: 25,
          additions: 578,
          deletions: 489,
        },
        analysis: 'Component yapısı atomic design prensipleri doğrultusunda yeniden düzenlendi. Kod tekrarı azaltıldı ve maintainability artırıldı.',
      },
    ],
  };

  const uniqueAuthors = Array.from(
    new Set(repoDetails.commits.map(commit => commit.author.name))
  ).map(name => {
    const author = repoDetails.commits.find(c => c.author.name === name)!.author;
    return { name: author.name, avatar: author.avatar };
  });

  const getImpactScore = (commit: any) => {
    return Math.round(
      ((commit.stats.additions + commit.stats.deletions) / 10) +
      (commit.stats.changedFiles * 5)
    );
  };

  const filteredCommits = repoDetails.commits.filter(commit => {
    // Arama filtresi
    if (filters.search && !commit.message.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Tip filtresi
    if (filters.types.length > 0 && !filters.types.includes(commit.type)) {
      return false;
    }

    // Yazar filtresi
    if (filters.authors.length > 0 && !filters.authors.includes(commit.author.name)) {
      return false;
    }

    // Tarih filtresi
    const commitDate = new Date(commit.date);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - commitDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < filters.dateRange[0] || daysDiff > filters.dateRange[1]) {
      return false;
    }

    // Etki skoru filtresi
    const impactScore = getImpactScore(commit);
    if (impactScore < filters.impactScore[0] || impactScore > filters.impactScore[1]) {
      return false;
    }

    // AI analizi filtresi
    if (filters.onlyWithAnalysis && !commit.analysis) {
      return false;
    }

    return true;
  });

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <LinearProgress />;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2, 
        mb: 4 
      }}>
        <IconButton 
          onClick={() => navigate('/analysis')}
          sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {repoDetails.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {repoDetails.description}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<CommitIcon />}
          sx={{ 
            bgcolor: '#6366F1', 
            '&:hover': { bgcolor: '#4F46E5' },
            alignSelf: { xs: 'stretch', sm: 'auto' },
          }}
        >
          Yeni Analiz
        </Button>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 2,
        mb: 4
      }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: '#6366F115',
                color: '#6366F1',
                mr: 2,
              }}
            >
              <CodeIcon />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Kod Kalitesi
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold">
            {repoDetails.metrics.codeQuality}%
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: '#10B98115',
                color: '#10B981',
                mr: 2,
              }}
            >
              <SpeedIcon />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Test Kapsamı
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold">
            {repoDetails.metrics.coverage}%
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: '#F59E0B15',
                color: '#F59E0B',
                mr: 2,
              }}
            >
              <TrendingUpIcon />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Performans
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold">
            {repoDetails.metrics.performance}%
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ mb: 4 }}>
        <CommitFilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          authors={uniqueAuthors}
          onReset={() => setFilters({
            search: '',
            types: [],
            authors: [],
            dateRange: [1, 90],
            impactScore: [0, 100],
            onlyWithAnalysis: false,
          })}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Commit Analizleri
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {repoDetails.commits.length} commit gösteriliyor
        </Typography>
      </Box>

      <Stack spacing={2}>
        {repoDetails.commits.map((commit) => (
          <CommitAnalysis key={commit.id} commit={commit} />
        ))}
      </Stack>
    </Box>
  );
};

export default AnalysisDetailPage; 