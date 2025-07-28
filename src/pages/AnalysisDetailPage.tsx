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
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  GitHub as GitHubIcon,
  Commit as CommitIcon,
  Code as CodeIcon,
  BugReport as BugReportIcon,
  Architecture as ArchitectureIcon
} from '@mui/icons-material';
import { PullRequestNode } from '../types/analysis';

interface RiskScoreChipProps {
  score: number;
}

const RiskScoreChip: React.FC<RiskScoreChipProps> = ({ score }) => {
  const theme = useTheme();
  const getColor = () => {
    if (score <= 30) return theme.palette.success.main;
    if (score <= 70) return theme.palette.warning.main;
    return theme.palette.error.main;
  };
  
  return (
    <Chip
      label={`Risk Score: ${score}%`}
      size="small"
      sx={{
        bgcolor: alpha(getColor(), 0.1),
        color: getColor(),
      }}
    />
  );
};

const CommentSection: React.FC<{
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, content, icon, color }) => {
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: alpha(color, 0.1),
            color: color,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6">
          {title}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
        {content}
      </Typography>
    </Paper>
  );
};

const AnalysisDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { repoId } = useParams();
  
  // TODO: Bu veriyi API'den alacağız
  const analysis: PullRequestNode = {
    id: 1,
    branch: "feature/auth",
    pusher: "onrcanogul",
    headCommitMessage: "Add authentication system",
    headCommitSha: "abc123",
    commitCount: 5,
    commits: [],
    analysis: {
      id: "1",
      technicalComment: "Bu PR'da authentication sistemi için gerekli temel yapı kurulmuş. JWT tabanlı token yönetimi ve gerekli middleware'ler eklenmiş. Kod kalitesi genel olarak iyi, ancak error handling kısmında bazı eksiklikler var.",
      functionalComment: "Authentication akışı endüstri standartlarına uygun şekilde implemente edilmiş. Kullanıcı deneyimi açısından başarılı bir implementasyon. Password reset ve email verification gibi özellikler ileriki aşamalarda eklenebilir.",
      architecturalComment: "Sistem modüler bir yapıda tasarlanmış ve SOLID prensiplerine uygun. Authentication logic service katmanında izole edilmiş durumda. İleride yeni auth provider'lar eklemek kolay olacak şekilde tasarlanmış.",
      riskScore: 25
    },
    createdBy: {
      githubId: 123,
      username: "onrcanogul",
      avatarUrl: "https://avatars.githubusercontent.com/u/123",
      email: "onrcanogul@gmail.com",
      userType: "User"
    },
    solves: [1, 2],
    repository: {
      id: 1,
      name: "auth-service",
      fullName: "onrcanogul/auth-service",
      htmlUrl: "https://github.com/onrcanogul/auth-service",
      visibility: "public",
      language: "TypeScript",
      description: "Authentication service with OAuth2 support",
      defaultBranch: "main",
      ownerLogin: "onrcanogul",
      ownerId: 123
    }
  };

  if (!analysis) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Analysis bulunamadı
        </Typography>
        <IconButton
          onClick={() => navigate('/analysis')}
          sx={{ mt: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
    );
  }

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
                {analysis.repository.name}
              </Typography>
              <RiskScoreChip score={analysis.analysis.riskScore} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {analysis.repository.description}
            </Typography>
          </Box>
          <Tooltip title="GitHub'da Görüntüle">
            <IconButton
              href={analysis.repository.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* PR Info */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CommitIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2">
              {analysis.commitCount} commits
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2">
              Branch: {analysis.branch}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              by {analysis.createdBy?.username}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Analysis Comments */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CommentSection
            title="Technical Analysis"
            content={analysis.analysis.technicalComment}
            icon={<CodeIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12}>
          <CommentSection
            title="Functional Analysis"
            content={analysis.analysis.functionalComment}
            icon={<BugReportIcon />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12}>
          <CommentSection
            title="Architectural Analysis"
            content={analysis.analysis.architecturalComment}
            icon={<ArchitectureIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalysisDetailPage; 