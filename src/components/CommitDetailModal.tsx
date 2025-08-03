import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Avatar,
  Stack,
  Link,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Code as CodeIcon,
  BugReport as BugReportIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import { CommitNode, CommitAnalysisNode, RepositoryNode } from '../types/analysis';

interface CommitDetailModalProps {
  open: boolean;
  onClose: () => void;
  commit: {
    hash: string;
    message: string;
    date: string;
    author: {
      name: string;
      avatar: string;
    };
    type: 'feature' | 'bugfix' | 'refactor' | 'other';
    stats: {
      changedFiles: number;
      additions: number;
      deletions: number;
    };
    analysis: string;
    repository: RepositoryNode;
  };
}

interface ImpactMetricProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const ImpactMetric: React.FC<ImpactMetricProps> = ({ title, value, icon, color }) => (
  <Box sx={{ textAlign: 'center', p: 2 }}>
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 2,
        bgcolor: `${color}15`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        mb: 1,
      }}
    >
      {icon}
    </Box>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h6" fontWeight="bold">
      {value}
    </Typography>
  </Box>
);

const CommitDetailModal: React.FC<CommitDetailModalProps> = ({ open, onClose, commit }) => {
  if (!commit) return null;

  const getTypeColor = () => {
    switch (commit.type) {
      case 'feature':
        return { bg: '#10B98115', color: '#10B981' };
      case 'bugfix':
        return { bg: '#EF444415', color: '#EF4444' };
      case 'refactor':
        return { bg: '#6366F115', color: '#6366F1' };
      default:
        return { bg: '#F59E0B15', color: '#F59E0B' };
    }
  };

  const { bg, color } = getTypeColor();

  const commitUrl = commit.repository?.htmlUrl 
    ? `${commit.repository.htmlUrl}/commit/${commit.hash}`
    : undefined;

  const repoUrl = commit.repository?.htmlUrl;
  const repoName = commit.repository?.fullName || 'Unknown Repository';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Commit Detayları
            </Typography>
            {commitUrl && (
              <Link 
                href={commitUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <GitHubIcon sx={{ fontSize: 20 }} />
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                  {commit.hash.substring(0, 7)}
                </Typography>
              </Link>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {new Date(commit.date).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">•</Typography>
            {repoUrl ? (
              <Link
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <Typography variant="caption">
                  {repoName}
                </Typography>
              </Link>
            ) : (
              <Typography variant="caption" color="text.secondary">
                {repoName}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar src={commit.author.avatar} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {commit.author.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {commit.message}
              </Typography>
            </Box>
            <Chip
              label={commit.type}
              size="small"
              sx={{
                bgcolor: bg,
                color: color,
                textTransform: 'capitalize',
                fontWeight: 500,
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={3}>
            <Box sx={{ display: 'flex', flex: 1 }}>
              <ImpactMetric
                title="Değişen Dosyalar"
                value={commit.stats.changedFiles}
                icon={<CodeIcon />}
                color="#6366F1"
              />
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: 'flex', flex: 1 }}>
              <ImpactMetric
                title="Eklenen Satırlar"
                value={`+${commit.stats.additions}`}
                icon={<AddIcon />}
                color="#10B981"
              />
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: 'flex', flex: 1 }}>
              <ImpactMetric
                title="Silinen Satırlar"
                value={`-${commit.stats.deletions}`}
                icon={<RemoveIcon />}
                color="#EF4444"
              />
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: 'flex', flex: 1 }}>
              <ImpactMetric
                title="Etki Skoru"
                value={((commit.stats.additions + commit.stats.deletions) / 10).toFixed(1)}
                icon={<SpeedIcon />}
                color="#F59E0B"
              />
            </Box>
          </Grid>
        </Grid>

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

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Teknik Detaylar
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BugReportIcon sx={{ color: '#EF4444' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Potansiyel Riskler
                </Typography>
                <Typography variant="body1">
                  {commit.type === 'bugfix' ? 'Düşük risk - Hata düzeltmesi' : 'Orta risk - Yeni özellik'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MemoryIcon sx={{ color: '#6366F1' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Performans Etkisi
                </Typography>
                <Typography variant="body1">
                  {commit.stats.changedFiles > 10 ? 'Yüksek etki - Kapsamlı değişiklik' : 'Düşük etki - Minimal değişiklik'}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CommitDetailModal; 