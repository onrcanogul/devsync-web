import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Link, Avatar } from '@mui/material';
import { GitHub, Schedule, Commit } from '@mui/icons-material';
import { AnalysisResult } from '../types/analysis';

interface AnalysisCardProps {
  analysis: AnalysisResult;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  const [owner, repo] = analysis.repositoryName.split('/');
  const timeAgo = new Date(analysis.analyzedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card 
      sx={{ 
        mb: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[4],
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Avatar
                src={`https://github.com/${owner}.png`}
                sx={{ width: 24, height: 24 }}
              />
              <Link
                href={`https://github.com/${analysis.repositoryName}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                <GitHub sx={{ fontSize: 16 }} />
                <Typography variant="h6" component="span">
                  {owner}/{repo}
                </Typography>
              </Link>
            </Box>
            <Link
              href={`https://github.com/${analysis.repositoryName}/pull/${analysis.pullRequestId}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <Typography color="textSecondary" gutterBottom>
                PR #{analysis.pullRequestId} • {analysis.branchName}
              </Typography>
            </Link>
          </Box>
          <Box sx={{ 
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' },
            display: 'flex',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Chip 
              icon={<Commit sx={{ fontSize: 16 }} />}
              label={`${analysis.commitCount} commits`}
              size="small"
              color="default"
              sx={{ borderRadius: 1 }}
            />
            <Chip 
              label={`${analysis.changedFilesCount} files`}
              size="small"
              color="default"
              sx={{ borderRadius: 1 }}
            />
            <Chip 
              label={`+${analysis.additions} -${analysis.deletions}`}
              size="small"
              color="primary"
              sx={{ borderRadius: 1 }}
            />
          </Box>
          <Box sx={{ flex: '1 1 100%', mt: 1 }}>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              {analysis.aiSummary}
            </Typography>
          </Box>
          <Box sx={{ 
            flex: '1 1 100%',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 1
          }}>
            <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="textSecondary">
              Analyzed {timeAgo}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}; 