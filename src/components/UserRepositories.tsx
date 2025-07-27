import React, { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Link,
    CircularProgress,
    Alert,
    Stack,
    IconButton,
    Tooltip,
    useTheme,
    alpha
} from '@mui/material';
import {
    Star as StarIcon,
    AccountTree as ForkIcon,
    Code as CodeIcon,
    Circle as CircleIcon,
    GitHub as GitHubIcon,
    History as HistoryIcon,
    Lock as LockIcon,
    Public as PublicIcon,
    Link as LinkIcon,
    LinkOff as LinkOffIcon
} from '@mui/icons-material';
import { RepositoryFromApi } from '../types/repositoryFromApi';
import { githubRepositoryService } from '../services/githubRepositoryService';

interface UserRepositoriesProps {
    username: string;
    searchQuery?: string;
    sortBy?: 'updated' | 'stars' | 'name';
}

const languageColors: { [key: string]: string } = {
    TypeScript: '#3178C6',
    JavaScript: '#F7DF1E',
    Python: '#3776AB',
    Java: '#B07219',
    'C#': '#178600',
    PHP: '#4F5D95',
    Ruby: '#CC342D',
    Go: '#00ADD8',
    Rust: '#DEA584',
    HTML: '#E34C26',
    CSS: '#563D7C',
    Shell: '#89E051'
};

export const UserRepositories: React.FC<UserRepositoriesProps> = ({ 
    username,
    searchQuery = '',
    sortBy = 'updated'
}) => {
    const theme = useTheme();
    const [repositories, setRepositories] = useState<RepositoryFromApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await githubRepositoryService.getUserRepositories(username);
                setRepositories(data);
            } catch (err) {
                setError('Repositories yüklenirken bir hata oluştu.');
                console.error('Error fetching repositories:', err);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchRepositories();
        }
    }, [username]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Dün güncellendi';
        if (diffDays < 7) return `${diffDays} gün önce güncellendi`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce güncellendi`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce güncellendi`;
        return `${Math.floor(diffDays / 365)} yıl önce güncellendi`;
    };

    const filteredAndSortedRepositories = useMemo(() => {
        let result = [...repositories];

        // Arama filtrelemesi
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(repo => 
                repo.name.toLowerCase().includes(query) ||
                (repo.description?.toLowerCase().includes(query)) ||
                (repo.language?.toLowerCase().includes(query))
            );
        }

        // Sıralama
        result.sort((a, b) => {
            switch (sortBy) {
                case 'updated':
                    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                case 'stars':
                    return b.stargazers_count - a.stargazers_count;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        return result;
    }, [repositories, searchQuery, sortBy]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (filteredAndSortedRepositories.length === 0) {
        return (
            <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                minHeight="200px"
                gap={2}
            >
                <GitHubIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                <Typography color="text.secondary" variant="body1">
                    {searchQuery 
                        ? 'Arama kriterlerine uygun repository bulunamadı.' 
                        : 'Henüz repository bulunmuyor.'}
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={2}>
            {filteredAndSortedRepositories.map((repo) => (
                <Grid item xs={12} key={repo.id}>
                    <Card 
                        sx={{ 
                            height: '100%',
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: 'none',
                            '&:hover': {
                                borderColor: theme.palette.primary.main,
                                backgroundColor: alpha(theme.palette.primary.main, 0.03)
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Typography variant="h6" component="div">
                                            <Link
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                color="inherit"
                                                underline="hover"
                                                sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}
                                            >
                                                {repo.private ? <LockIcon fontSize="small" /> : <PublicIcon fontSize="small" />}
                                                {repo.name}
                                            </Link>
                                        </Typography>
                                        {repo.fork && (
                                            <Chip 
                                                size="small" 
                                                label="Fork"
                                                icon={<ForkIcon sx={{ fontSize: 16 }} />}
                                                sx={{ 
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: theme.palette.primary.main
                                                }}
                                            />
                                        )}
                                        {repo.is_connected && (
                                            <Tooltip title="DevSync'e Bağlı">
                                                <Chip 
                                                    size="small" 
                                                    label="Bağlı"
                                                    icon={<LinkIcon sx={{ fontSize: 16 }} />}
                                                    sx={{ 
                                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                                        color: theme.palette.success.main,
                                                        '& .MuiChip-icon': {
                                                            color: theme.palette.success.main
                                                        }
                                                    }}
                                                />
                                            </Tooltip>
                                        )}
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 2 }}
                                    >
                                        {repo.description || 'No description available'}
                                    </Typography>

                                    <Stack direction="row" spacing={3} alignItems="center">
                                        {repo.language && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <CircleIcon 
                                                    sx={{ 
                                                        fontSize: 12,
                                                        color: languageColors[repo.language] || theme.palette.grey[500]
                                                    }} 
                                                />
                                                <Typography variant="body2" color="text.secondary">
                                                    {repo.language}
                                                </Typography>
                                            </Box>
                                        )}

                                        {repo.stargazers_count > 0 && (
                                            <Link
                                                href={`${repo.html_url}/stargazers`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                color="inherit"
                                                underline="hover"
                                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                            >
                                                <StarIcon sx={{ fontSize: 16 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {repo.stargazers_count}
                                                </Typography>
                                            </Link>
                                        )}

                                        {repo.forks_count > 0 && (
                                            <Link
                                                href={`${repo.html_url}/network/members`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                color="inherit"
                                                underline="hover"
                                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                            >
                                                <ForkIcon sx={{ fontSize: 16 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {repo.forks_count}
                                                </Typography>
                                            </Link>
                                        )}

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <HistoryIcon sx={{ fontSize: 16 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(repo.updated_at)}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {!repo.is_connected && (
                                        <Tooltip title="DevSync'e Bağla">
                                            <IconButton
                                                size="small"
                                                onClick={() => {/* Bağlama fonksiyonu eklenecek */}}
                                                sx={{ 
                                                    color: theme.palette.text.secondary,
                                                    '&:hover': {
                                                        color: theme.palette.success.main
                                                    }
                                                }}
                                            >
                                                <LinkIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="GitHub'da Görüntüle">
                                        <IconButton
                                            size="small"
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ 
                                                color: theme.palette.text.secondary,
                                                '&:hover': {
                                                    color: theme.palette.primary.main
                                                }
                                            }}
                                        >
                                            <GitHubIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}; 