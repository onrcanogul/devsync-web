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
    alpha,
    Snackbar,
    tooltipClasses,
    TooltipProps,
    styled,
    Theme
} from '@mui/material';
import {
    Star as StarIcon,
    AccountTree as ForkIcon,
    Circle as CircleIcon,
    GitHub as GitHubIcon,
    Lock as LockIcon,
    Public as PublicIcon,
    Link as LinkIcon,
} from '@mui/icons-material';
import { RepositoryFromApi } from '../types/repositoryFromApi';
import { githubRepositoryService } from '../services/githubRepositoryService';
import { repositoryService } from '../services/repositoryService';

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
const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }: { theme: Theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#1a1a1a',
        maxWidth: 300,
        padding: theme.spacing(1.5),
        borderRadius: theme.spacing(1),
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#1a1a1a'
    }
}));

export const UserRepositories: React.FC<UserRepositoriesProps> = ({ 
    username,
    searchQuery = '',
    sortBy = 'updated'
}) => {
    const theme = useTheme();
    const [repositories, setRepositories] = useState<RepositoryFromApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const reposData = await githubRepositoryService.getUserRepositories(username);
                setRepositories(reposData);
            } catch (err: any) {
                if (err.message === 'Session expired. Please login again.') {
                    setError('Your session has expired. Redirecting to login page...');
                } else {
                    setError('Error loading repositories. Please try again later.');
                }
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchData();
        }
    }, [username]);

    const handleConnectRepository = async (repo: RepositoryFromApi) => {
        try {
            const [owner, repoName] = repo.full_name.split('/');
            await repositoryService.addWebhook(owner, repoName);
            
            setRepositories(prevRepos => 
                prevRepos.map(r => 
                    r.id === repo.id ? { ...r, hasTargetWebhook: true } : r
                )
            );

            setSnackbar({
                open: true,
                message: 'Repository successfully connected to DevSync',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error connecting repository to DevSync',
                severity: 'error'
            });
            console.error('Error connecting repository:', error);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) return 'Updated today';
        if (diffDays === 1) return 'Updated yesterday';
        if (diffDays < 7) return `Updated ${diffDays} days ago`;
        if (diffDays < 30) return `Updated ${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `Updated ${Math.floor(diffDays / 30)} months ago`;
        return `Updated ${Math.floor(diffDays / 365)} years ago`;
    };

    const filteredAndSortedRepositories = useMemo(() => {
        let result = [...repositories];

        // Search filtering
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(repo => 
                repo.name.toLowerCase().includes(query) ||
                (repo.description?.toLowerCase().includes(query)) ||
                (repo.language?.toLowerCase().includes(query))
            );
        }

        // Sorting
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
                        ? 'No repositories found matching your search criteria.' 
                        : 'No repositories found.'}
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Grid container spacing={2}>
                {filteredAndSortedRepositories.map(repo => (
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
                                                    sx={{ height: 24 }}
                                                />
                                            )}
                                            {repo.hasTargetWebhook && (
                                                <CustomTooltip 
                                                    title={
                                                        <Box>
                                                            <Typography 
                                                                variant="subtitle2" 
                                                                sx={{ 
                                                                    color: '#fff',
                                                                    fontWeight: 500,
                                                                    mb: 1
                                                                }}
                                                            >
                                                                Connected to DevSync
                                                            </Typography>
                                                            <Typography 
                                                                variant="caption"
                                                                sx={{ 
                                                                    color: '#8b949e',
                                                                    display: 'block',
                                                                    lineHeight: 1.4
                                                                }}
                                                            >
                                                                Note: If you remove the webhook from GitHub, the changes will be reflected in DevSync on the next day.
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    arrow
                                                    placement="top"
                                                >
                                                    <Chip
                                                        size="small"
                                                        label="Connected to DevSync"
                                                        icon={<LinkIcon sx={{ fontSize: 16 }} />}
                                                        color="primary"
                                                        sx={{ height: 24 }}
                                                    />
                                                </CustomTooltip>
                                            )}
                                        </Box>
                                        {repo.description && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {repo.description}
                                            </Typography>
                                        )}
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            {repo.language && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <CircleIcon sx={{ fontSize: 12, color: languageColors[repo.language] || 'grey.500' }} />
                                                    <Typography variant="body2">{repo.language}</Typography>
                                                </Box>
                                            )}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <StarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2">{repo.stargazers_count}</Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(repo.updated_at)}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {!repo.hasTargetWebhook && (
                                            <Tooltip title="Connect to DevSync">
                                                <IconButton
                                                    onClick={() => handleConnectRepository(repo)}
                                                    size="small"
                                                    sx={{ 
                                                        color: theme.palette.primary.main,
                                                        '&:hover': {
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                                        }
                                                    }}
                                                >
                                                    <LinkIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <Tooltip title="View on GitHub">
                                            <IconButton
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                size="small"
                                                sx={{ 
                                                    color: 'text.secondary',
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
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
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}; 