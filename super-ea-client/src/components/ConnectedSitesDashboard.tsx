import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, TextField, CircularProgress, Chip,
    InputAdornment, Tooltip, IconButton, List, ListItemButton, ListItemIcon, ListItemText,
    Skeleton
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ArticleIcon from '@mui/icons-material/Article';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LanguageIcon from '@mui/icons-material/Language';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

interface SiteInfo {
    id: string;
    name: string;
    table: string;
    total_posts: number;
    status: 'connected' | 'error' | 'refreshing';
    error?: string;
    last_updated?: number;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ConnectedSitesDashboard = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [sites, setSites] = useState<SiteInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingStats, setLoadingStats] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const pollTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        fetchSites(true);
        return () => {
            if (pollTimeoutRef.current) {
                window.clearTimeout(pollTimeoutRef.current);
                pollTimeoutRef.current = null;
            }
        };
    }, []);

    const fetchSites = async (showInitialLoader = false) => {
        if (showInitialLoader) setLoading(true);
        try {
            // Fast initial paint from lightweight endpoint
            const quickRes = await axios.get(`${BACKEND_URL}/sites/quick`);
            setSites(quickRes.data);
            if (showInitialLoader) setLoading(false);

            // Detailed stats are resolved in background
            setLoadingStats(true);
            try {
                const detailedRes = await axios.get(`${BACKEND_URL}/sites/detailed`);
                setSites(detailedRes.data);

                const hasRefreshing = detailedRes.data.some((s: SiteInfo) => s.status === 'refreshing');
                if (pollTimeoutRef.current) {
                    window.clearTimeout(pollTimeoutRef.current);
                    pollTimeoutRef.current = null;
                }
                if (hasRefreshing) {
                    pollTimeoutRef.current = window.setTimeout(() => fetchSites(false), 3000);
                }
            } catch (detailErr) {
                console.error('Detailed stats fetch failed:', detailErr);
            }
        } catch (err) {
            console.error('Failed to fetch sites:', err);
            showToast('Failed to load connected sites', 'error');
        } finally {
            if (showInitialLoader) setLoading(false);
            setLoadingStats(false);
        }
    };

    const handleRefreshSite = async (e: React.MouseEvent, siteId: string) => {
        e.stopPropagation();
        try {
            showToast('Refreshing site stats...', 'info');
            setSites(prev => prev.map(s => s.id === siteId ? { ...s, status: 'refreshing' } : s));
            const res = await axios.post(`${BACKEND_URL}/sites/${siteId}/refresh-stats`);
            setSites(prev => prev.map(s => s.id === siteId ? res.data : s));
            showToast('Site stats updated', 'success');
        } catch (err) {
            console.error('Failed to refresh site:', err);
            showToast('Failed to refresh site', 'error');
        }
    };

    const filteredSites = sites.filter(site =>
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalBlogs = sites.reduce((sum, s) => sum + (s.total_posts > 0 ? s.total_posts : 0), 0);
    const connectedCount = sites.filter(s => s.status === 'connected').length;
    const errorCount = sites.filter(s => s.status === 'error').length;

    return (
        <Box>
            {/* Page Header */}
            <Box sx={{ mb: { xs: 3, md: 5 }, px: { xs: 1, md: 0 } }}>
                <Typography
                    variant="h2"
                    gutterBottom
                    sx={{
                        fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Connected Sites Overview
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{ color: '#64748B', fontSize: { xs: '0.875rem', md: '1rem' } }}
                >
                    Select a site to manage its content, view statistics, and edit blogs.
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 2,
                mb: 4,
            }}>
                {[
                    { label: 'Total Sites', value: sites.length, icon: <LanguageIcon />, color: '#A78BFA', bg: 'rgba(139, 92, 246, 0.08)' },
                    { label: 'Total Blogs', value: totalBlogs, icon: <ArticleIcon />, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)' },
                    { label: 'Connected', value: connectedCount, icon: <CheckCircleIcon />, color: '#22C55E', bg: 'rgba(34, 197, 94, 0.08)' },
                    { label: 'Errors', value: errorCount, icon: <ErrorIcon />, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.08)' },
                ].map((stat, idx) => (
                    <Paper key={idx} className="glass-card" sx={{ p: 2.5, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                p: 1, borderRadius: 1.5, bgcolor: stat.bg, display: 'flex',
                                '& .MuiSvgIcon-root': { fontSize: 20, color: stat.color },
                            }}>
                                {stat.icon}
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#E2E8F0', lineHeight: 1.2 }}>
                                    {loading ? '—' : stat.value}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                                    {stat.label}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </Box>

            {/* Search & Refresh */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                    placeholder="Search sites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
                    sx={{
                        minWidth: 280, flexGrow: { xs: 1, md: 0 },
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(18, 36, 62, 0.4)',
                            borderRadius: 2.5,
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#52525B' }} />
                            </InputAdornment>
                        )
                    }}
                />
                <Tooltip title="Refresh data" arrow>
                    <span>
                        <IconButton
                            onClick={() => fetchSites(false)}
                            disabled={loading || loadingStats}
                            sx={{
                                bgcolor: 'rgba(18, 36, 62, 0.4)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                transition: 'all 0.2s ease',
                                '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.08)', borderColor: 'rgba(139, 92, 246, 0.2)' }
                            }}
                        >
                            <RefreshIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>

            {/* Loading Skeletons */}
            {loading && (
                <Paper className="glass" sx={{ overflow: 'hidden', borderRadius: 3 }}>
                    {Array.from(new Array(3)).map((_, idx) => (
                        <Box key={idx} sx={{ p: 2.5, borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)' }} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton variant="text" width="40%" height={22} sx={{ bgcolor: 'rgba(255,255,255,0.04)' }} />
                                <Skeleton variant="text" width="60%" height={16} sx={{ bgcolor: 'rgba(255,255,255,0.03)' }} />
                            </Box>
                            <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 1, bgcolor: 'rgba(255,255,255,0.04)' }} />
                        </Box>
                    ))}
                </Paper>
            )}

            {/* Sites List */}
            {!loading && (
                <Paper className="glass" sx={{ overflow: 'hidden', borderRadius: 3 }}>
                    <List disablePadding>
                        {filteredSites.map((site, idx) => (
                            <ListItemButton
                                key={site.id}
                                onClick={() => navigate(`/sites-overview/${site.id}`)}
                                sx={{
                                    py: 2, px: 3,
                                    borderBottom: idx < filteredSites.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        bgcolor: 'rgba(139, 92, 246, 0.04)',
                                        '& .chevron-icon': { transform: 'translateX(4px)', color: '#A78BFA' },
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    <Box sx={{
                                        p: 1.5, borderRadius: 2, display: 'flex',
                                        bgcolor: site.status === 'connected'
                                            ? 'rgba(139, 92, 246, 0.08)'
                                            : 'rgba(239, 68, 68, 0.08)',
                                    }}>
                                        <StorageIcon sx={{
                                            color: site.status === 'connected' ? '#A78BFA' : '#EF4444'
                                        }} />
                                    </Box>
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                            {site.name}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                                            ID: {site.id} • Table: {site.table}
                                        </Typography>
                                    }
                                />
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mr: 2 }}>
                                    {site.total_posts === -1 ? (
                                        <Skeleton variant="rounded" width={80} height={24} sx={{ bgcolor: 'rgba(139, 92, 246, 0.06)' }} />
                                    ) : (
                                        <Chip
                                            icon={<ArticleIcon sx={{ fontSize: 14 }} />}
                                            label={`${site.total_posts} blogs`}
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(245, 158, 11, 0.08)',
                                                color: '#F59E0B',
                                                fontWeight: 600,
                                            }}
                                        />
                                    )}
                                    <Chip
                                        icon={site.status === 'connected'
                                            ? <CheckCircleIcon sx={{ fontSize: 14 }} />
                                            : site.status === 'refreshing'
                                                ? <CircularProgress size={14} color="inherit" />
                                                : <ErrorIcon sx={{ fontSize: 14 }} />
                                        }
                                        label={site.status === 'refreshing' ? 'Updating...' : site.status}
                                        size="small"
                                        color={site.status === 'connected' ? 'success' : site.status === 'refreshing' ? 'warning' : 'error'}
                                        variant="outlined"
                                    />
                                    <Tooltip title="Refresh Stats" arrow>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleRefreshSite(e, site.id)}
                                            sx={{
                                                ml: 0.5, color: '#52525B',
                                                '&:hover': { color: '#A78BFA', bgcolor: 'rgba(139, 92, 246, 0.08)' }
                                            }}
                                        >
                                            <RefreshIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <ChevronRightIcon
                                    className="chevron-icon"
                                    sx={{ color: '#52525B', transition: 'all 0.2s ease' }}
                                />
                            </ListItemButton>
                        ))}

                        {filteredSites.length === 0 && (
                            <Box sx={{ p: 6, textAlign: 'center' }}>
                                <Box sx={{
                                    width: 56, height: 56, borderRadius: 2.5, mx: 'auto', mb: 2,
                                    bgcolor: 'rgba(139, 92, 246, 0.06)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <LanguageIcon sx={{ fontSize: 28, color: '#52525B' }} />
                                </Box>
                                <Typography sx={{ color: '#64748B', fontWeight: 500 }}>
                                    {searchQuery
                                        ? 'No sites match your search.'
                                        : 'No sites connected yet.'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#52525B', display: 'block', mt: 0.5 }}>
                                    {!searchQuery && 'Go to Site Manager to add connections.'}
                                </Typography>
                            </Box>
                        )}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default ConnectedSitesDashboard;
