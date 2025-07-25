import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
  Chip,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Storage as StorageIcon,
  Code as CodeIcon,
  RateReview as RateReviewIcon,
  Star as StarIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { getDashboardData } from '../services/mockData';

const StatCard = ({ title, value, icon, color }: any) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      height: '100%',
      bgcolor: 'background.paper',
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box
        sx={{
          p: 1,
          borderRadius: 2,
          bgcolor: `${color}15`,
          color: color,
          mr: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </Box>
    <Typography variant="h4" fontWeight="bold">
      {value.toLocaleString()}
    </Typography>
  </Paper>
);

const DashboardPage = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setData(getDashboardData());
  }, []);

  if (!data) return <LinearProgress />;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
        Dashboard
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          <StatCard
            title="Toplam Repository"
            value={data.stats.totalRepositories}
            icon={<StorageIcon />}
            color="#6366F1"
          />
          <StatCard
            title="Aktif Projeler"
            value={data.stats.activeProjects}
            icon={<TrendingUpIcon />}
            color="#10B981"
          />
          <StatCard
            title="Toplam Commit"
            value={data.stats.totalCommits}
            icon={<CodeIcon />}
            color="#F59E0B"
          />
          <StatCard
            title="Code Reviews"
            value={data.stats.codeReviews}
            icon={<RateReviewIcon />}
            color="#EC4899"
          />
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
          {/* Recent Activities */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Son Aktiviteler
            </Typography>
            <Stack spacing={2}>
              {data.recentActivities.map((activity: any) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.default',
                  }}
                >
                  <Avatar src={activity.user.avatar} sx={{ mr: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {activity.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.repository} • {new Date(activity.timestamp).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={activity.type}
                    sx={{
                      bgcolor: 
                        activity.type === 'commit' ? '#10B98115' :
                        activity.type === 'pull_request' ? '#6366F115' :
                        activity.type === 'issue' ? '#F59E0B15' :
                        '#EC489915',
                      color:
                        activity.type === 'commit' ? '#10B981' :
                        activity.type === 'pull_request' ? '#6366F1' :
                        activity.type === 'issue' ? '#F59E0B' :
                        '#EC4899',
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Popular Repositories */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Popüler Repolar
            </Typography>
            <Stack spacing={2}>
              {data.popularRepositories.map((repo: any) => (
                <Box
                  key={repo.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.default',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
                      {repo.name}
                    </Typography>
                    <Tooltip title="Star">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StarIcon sx={{ fontSize: 16, color: '#F59E0B', mr: 0.5 }} />
                        <Typography variant="caption">{repo.stars}</Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    {repo.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircleIcon sx={{ fontSize: 12, mr: 0.5, color: 
                      repo.language === 'TypeScript' ? '#3178C6' :
                      repo.language === 'Python' ? '#3776AB' :
                      repo.language === 'Java' ? '#B07219' :
                      '#4B5563'
                    }} />
                    <Typography variant="caption" color="text.secondary">
                      {repo.language}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage; 