import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Avatar } from '@mui/material';
import { PullRequestNode } from '../types/analysis';
import { useNavigate } from 'react-router-dom';

interface AnalysisCardProps {
  node: PullRequestNode;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ node }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/analysis/${node.repoId}`);
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6
        }
      }} 
      onClick={handleClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {node.createdBy && (
            <Avatar src={node.createdBy.avatarUrl} alt={node.createdBy.username} />
          )}
          <Box>
            <Typography variant="h6" component="div">
              {node.headCommitMessage}
            </Typography>
            <Typography color="textSecondary">
              by {node.pusher} on {node.branch}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {node.analysis.technicalComment}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Commit: {node.headCommitSha.substring(0, 7)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {node.solves.length > 0 && (
              <Chip 
                size="small" 
                label={`Solves: ${node.solves.length}`} 
                color="primary" 
                variant="outlined" 
              />
            )}
            <Chip 
              size="small" 
              label={`Risk: ${node.analysis.riskScore}`} 
              color={node.analysis.riskScore > 5 ? 'error' : 'success'} 
              variant="outlined" 
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}; 