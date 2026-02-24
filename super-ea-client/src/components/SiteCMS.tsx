import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, TextField, Button, CircularProgress, Chip, Select,
    MenuItem, IconButton, InputAdornment, Alert, Tooltip, Grid,
    Checkbox, FormControl,
    InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PublishIcon from '@mui/icons-material/Publish';
import DraftsIcon from '@mui/icons-material/Drafts';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import BlogEdit from './BlogEdit';
import ImageSlideshow from './ImageSlideshow';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useToast } from '../context/ToastContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface PostData {
    id: number;
    title?: string;
    h1?: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    scheduled_at?: string;
    [key: string]: any;
}

interface PostsResponse {
    site_id: string;
    table: string;
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    stats: Record<string, number>;
    posts: PostData[];
}

interface SiteInfo {
    id: string;
    name: string;
    table: string;
    total_posts: number;
    status: string;
}

const SiteCMS = () => {
    const { siteId } = useParams<{ siteId: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
    const [postsData, setPostsData] = useState<PostsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [configurationNeeded, setConfigurationNeeded] = useState(false);

    // Config Discovery
    const [scanning, setScanning] = useState(false);
    const [candidateTables, setCandidateTables] = useState<string[]>([]);
    const [bestMatch, setBestMatch] = useState<string>('');
    const [selectedTable, setSelectedTable] = useState('');
    const [allTables, setAllTables] = useState<string[]>([]);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [categories, setCategories] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('id_desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState('1');

    // Selection
    const [selectedPosts, setSelectedPosts] = useState<number[]>([]);

    // Edit Modal
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<PostData | null>(null);
    const [saving, setSaving] = useState(false);

    // Draft Confirmation Modal (for editing non-draft posts)
    const [draftConfirmOpen, setDraftConfirmOpen] = useState(false);
    const [pendingEditPost, setPendingEditPost] = useState<PostData | null>(null);
    const [convertingToDraft, setConvertingToDraft] = useState(false);

    // Scheduling Modal
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [schedulingPost, setSchedulingPost] = useState<PostData | null>(null);
    const [scheduledDateTime, setScheduledDateTime] = useState<Date | null>(null);
    const [scheduling, setScheduling] = useState(false);

    // Preview Modal
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewingPost, setPreviewingPost] = useState<PostData | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);


    const fetchSiteInfo = useCallback(async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/sites/${siteId}/stats`);
            setSiteInfo(res.data);
        } catch (err) {
            console.error('Failed to fetch site info:', err);
        }
    }, [siteId]);

    const fetchPosts = useCallback(async (page: number = 1) => {
        if (!siteId) return;
        setLoading(true);
        setError(null);

        try {
            const params: Record<string, any> = { page, limit: 15 };
            if (statusFilter !== 'all') params.status = statusFilter;
            if (categoryFilter !== 'all') params.category = categoryFilter;
            if (searchQuery) params.search = searchQuery;
            if (sortBy) params.sort = sortBy;

            const res = await axios.get(`${BACKEND_URL}/sites/${siteId}/posts`, { params });
            setPostsData(res.data);
            setCurrentPage(page);
            setPageInput(String(page));
            setSelectedPosts([]);
        } catch (err: any) {
            const detail = err.response?.data?.detail || '';
            // Check for various table-not-found error patterns
            if (detail.includes('UndefinedTable') ||
                detail.includes('does not exist') ||
                detail.includes('relation') ||
                detail.includes('ProgrammingError')) {
                setConfigurationNeeded(true);
                setError('Table not configured or not found. Please select a valid content table.');
            } else {
                setError(detail || 'Failed to fetch blogs');
            }
        } finally {
            setLoading(false);
        }
    }, [siteId, statusFilter, categoryFilter, searchQuery, sortBy]);

    useEffect(() => {
        fetchSiteInfo();
        fetchPosts(1);

        // Fetch global categories
        axios.get(`${BACKEND_URL}/categories`)
            .then(res => setCategories(res.data))
            .catch(err => console.error("Failed to load categories", err));
    }, [fetchSiteInfo, fetchPosts]);

    const handleStatusChange = async (postId: number, newStatus: string) => {
        try {
            if (newStatus === 'scheduled') {
                // Find the post and open scheduling modal
                const post = postsData?.posts.find(p => p.id === postId);
                if (post) {
                    openScheduleModal(post);
                }
                return;
            }

            await axios.patch(`${BACKEND_URL}/sites/${siteId}/posts/${postId}/status`, { status: newStatus });
            showToast('Status updated!', 'success');
            fetchPosts(currentPage);
        } catch (err: any) {
            showToast(err.response?.data?.detail || 'Failed to update', 'error');
        }
    };

    const handleBulkAction = async (action: string) => {
        if (selectedPosts.length === 0) return;
        try {
            await axios.post(`${BACKEND_URL}/sites/${siteId}/posts/bulk-action`, {
                action,
                post_ids: selectedPosts
            });
            showToast(`${action} completed for ${selectedPosts.length} posts`, 'success');
            fetchPosts(currentPage);
        } catch (err: any) {
            showToast(err.response?.data?.detail || 'Bulk action failed', 'error');
        }
    };

    const handleDeletePost = async (postId: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            await axios.delete(`${BACKEND_URL}/sites/${siteId}/posts/${postId}`);
            showToast('Post deleted', 'success');
            fetchPosts(currentPage);
        } catch (err: any) {
            showToast(err.response?.data?.detail || 'Delete failed', 'error');
        }
    };

    const openEditModal = async (post: PostData) => {
        // Check if post is not in draft status
        if (post.status !== 'draft') {
            // Show confirmation dialog to convert to draft first
            setPendingEditPost(post);
            setDraftConfirmOpen(true);
            return;
        }

        // Post is already draft, proceed to edit
        try {
            const res = await axios.get(`${BACKEND_URL}/sites/${siteId}/posts/${post.id}`);
            setEditingPost(res.data);
            setEditModalOpen(true);
        } catch (err) {
            showToast('Failed to load post', 'error');
        }
    };

    const handleConfirmDraftAndEdit = async () => {
        if (!pendingEditPost || !siteId) return;
        setConvertingToDraft(true);
        try {
            // First, change status to draft
            await axios.patch(`${BACKEND_URL}/sites/${siteId}/posts/${pendingEditPost.id}/status`, { status: 'draft' });

            // Then load the post for editing
            const res = await axios.get(`${BACKEND_URL}/sites/${siteId}/posts/${pendingEditPost.id}`);
            setEditingPost(res.data);
            setEditModalOpen(true);
            setDraftConfirmOpen(false);
            setPendingEditPost(null);

            // Refresh the list to show updated status
            fetchPosts(currentPage);
        } catch (err: any) {
            showToast(err.response?.data?.detail || 'Failed to convert to draft', 'error');
        } finally {
            setConvertingToDraft(false);
        }
    };

    const handleSavePost = async (updatedPost: any) => {
        if (!editingPost) return;
        setSaving(true);
        try {
            await axios.put(`${BACKEND_URL}/sites/${siteId}/posts/${editingPost.id}`, updatedPost);
            showToast('Post updated!', 'success');
            setEditModalOpen(false);
            fetchPosts(currentPage);
        } catch (err: any) {
            showToast(err.response?.data?.detail || 'Save failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    const openScheduleModal = (post: PostData) => {
        setSchedulingPost(post);
        // If post is already scheduled, set the current scheduled time
        if (post.scheduled_at) {
            setScheduledDateTime(new Date(post.scheduled_at));
        } else {
            // Default to tomorrow at 9 AM
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(9, 0, 0, 0);
            setScheduledDateTime(tomorrow);
        }
        setScheduleModalOpen(true);
    };

    const handleSchedulePost = async () => {
        if (!schedulingPost || !scheduledDateTime || !siteId) return;
        setScheduling(true);
        try {
            await axios.post(`${BACKEND_URL}/sites/${siteId}/posts/${schedulingPost.id}/schedule`, {
                blog_id: schedulingPost.id,
                scheduled_at: scheduledDateTime.toISOString(),
                site_id: siteId
            });
            showToast('Post scheduled successfully!', 'success');
            setScheduleModalOpen(false);
            fetchPosts(currentPage);
        } catch (err: any) {
            showToast(err.response?.data?.detail || 'Scheduling failed', 'error');
        } finally {
            setScheduling(false);
        }
    };

    const handleUnschedulePost = async (postId: number) => {
        if (!siteId) return;
        if (!confirm('Are you sure you want to unschedule this post? It will be moved to draft status.')) return;

        try {
            await axios.patch(`${BACKEND_URL}/sites/${siteId}/posts/${postId}/unschedule`);
            showToast('Post unscheduled!', 'success');
            fetchPosts(currentPage);
        } catch (err: any) {
            showToast(err.response?.data?.detail || 'Unschedule failed', 'error');
        }
    }

    const openPreviewModal = async (post: PostData) => {
        setLoadingPreview(true);
        setPreviewModalOpen(true);
        try {
            // Fetch fresh data to ensure we have content
            const res = await axios.get(`${BACKEND_URL}/sites/${siteId}/posts/${post.id}`);
            setPreviewingPost(res.data);
        } catch (err) {
            showToast('Failed to load preview', 'error');
            setPreviewModalOpen(false);
        } finally {
            setLoadingPreview(false);
        }
    };

    const handleScanTables = async () => {
        if (!siteId) return;
        setScanning(true);
        try {
            const res = await axios.get(`${BACKEND_URL}/sites/${siteId}/candidate-tables`);
            setCandidateTables(res.data.candidates);
            setBestMatch(res.data.best_match);
            setAllTables(res.data.all_tables);
            setSelectedTable(res.data.best_match || res.data.candidates[0] || '');
        } catch (err: any) {
            console.error("Scan failed", err);
            showToast('Failed to scan tables', 'error');
        } finally {
            setScanning(false);
        }
    };

    const handleSaveConfiguration = async () => {
        if (!siteId || !selectedTable) return;
        try {
            await axios.patch(`${BACKEND_URL}/sites/${siteId}`, { target_table_name: selectedTable });
            showToast(`Configuration saved! using table: ${selectedTable}`, 'success');
            setConfigurationNeeded(false);
            // Refresh info and posts
            fetchSiteInfo();
            fetchPosts(1);
        } catch (err: any) {
            showToast('Failed to save configuration', 'error');
        }
    };

    const handlePageInputSubmit = () => {
        const page = parseInt(pageInput);
        if (page >= 1 && page <= (postsData?.total_pages || 1)) {
            fetchPosts(page);
        }
    };

    const getPostTitle = (post: PostData): string => {
        return post.title || post.h1 || post.meta_title || `Post #${post.id}`;
    };



    const stats = postsData?.stats || {};
    const totalPosts = Object.values(stats).reduce((a: number, b) => a + (b as number), 0);

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 3, md: 5 } }}>
                <IconButton
                    onClick={() => navigate('/sites-overview')}
                    sx={{
                        bgcolor: 'rgba(18, 36, 62, 0.5)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        transition: 'all 0.2s ease',
                        '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.08)', borderColor: 'rgba(139, 92, 246, 0.2)' }
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        {siteInfo?.name || siteId}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                        Table: {siteInfo?.table} • {totalPosts} total blogs
                    </Typography>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {[
                    { label: 'Total', value: totalPosts, color: '#A78BFA', bg: 'rgba(139, 92, 246, 0.08)', icon: <ArticleIcon /> },
                    { label: 'Published', value: stats.published || 0, color: '#22C55E', bg: 'rgba(34, 197, 94, 0.08)', icon: <CheckCircleIcon /> },
                    { label: 'Drafts', value: stats.draft || 0, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', icon: <DraftsIcon /> },
                    { label: 'Scheduled', value: stats.scheduled || 0, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.08)', icon: <ScheduleIcon /> },
                ].map((stat) => (
                    <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
                        <Paper className="glass-card" sx={{ p: 2.5, textAlign: 'center', borderRadius: 3 }}>
                            <Box sx={{
                                p: 1, borderRadius: 1.5, bgcolor: stat.bg, display: 'inline-flex',
                                mb: 1.5, '& .MuiSvgIcon-root': { color: stat.color, fontSize: 22 }
                            }}>
                                {stat.icon}
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#E2E8F0', lineHeight: 1.2 }}>{stat.value}</Typography>
                            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>{stat.label}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Filter Bar */}
            <Paper className="glass" sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Tabs
                        value={statusFilter}
                        onChange={(_, v) => { setStatusFilter(v); setCurrentPage(1); }}
                        sx={{ minHeight: 36 }}
                    >
                        <Tab label="All" value="all" sx={{ minHeight: 36, py: 0 }} />
                        <Tab label="Published" value="published" sx={{ minHeight: 36, py: 0 }} />
                        <Tab label="Drafts" value="draft" sx={{ minHeight: 36, py: 0 }} />
                        <Tab label="Scheduled" value="scheduled" sx={{ minHeight: 36, py: 0 }} />
                    </Tabs>

                    <Box sx={{ flexGrow: 1 }} />

                    <TextField
                        placeholder="Search blogs..."
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchPosts(1)}
                        sx={{ width: 220 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                        }}
                    />

                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>Sort by</InputLabel>
                        <Select value={sortBy} label="Sort by" onChange={(e) => setSortBy(e.target.value)}>
                            <MenuItem value="id_desc">Newest First</MenuItem>
                            <MenuItem value="id_asc">Oldest First</MenuItem>
                            <MenuItem value="title_asc">Title A-Z</MenuItem>
                            <MenuItem value="title_desc">Title Z-A</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>Category</InputLabel>
                        <Select value={categoryFilter} label="Category" onChange={(e) => setCategoryFilter(e.target.value)}>
                            <MenuItem value="all">All</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Tooltip title="Refresh">
                        <IconButton onClick={() => fetchPosts(currentPage)}><RefreshIcon /></IconButton>
                    </Tooltip>
                </Box>

                {/* Bulk Actions */}
                {selectedPosts.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            {selectedPosts.length} selected:
                        </Typography>
                        <Button size="small" startIcon={<PublishIcon />} onClick={() => handleBulkAction('publish')}>
                            Publish All
                        </Button>
                        <Button size="small" startIcon={<DraftsIcon />} onClick={() => handleBulkAction('draft')}>
                            Unpublish All
                        </Button>
                        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleBulkAction('delete')}>
                            Delete All
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Error Display */}
            {error && !configurationNeeded && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Configuration Needed UI */}
            {configurationNeeded && (
                <Paper className="animate-fade-in" sx={{ p: 4, mb: 4, bgcolor: 'rgba(255,100,100,0.05)', border: '1px dashed rgba(255,100,100,0.3)' }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h6" gutterBottom color="error">
                            ⚠️ Site Configuration Required
                        </Typography>
                        <Typography color="text.secondary">
                            We couldn't find the default "Blog" table. Please confirm which table contains your content.
                        </Typography>
                    </Box>

                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid>
                            <Button
                                variant="outlined"
                                onClick={handleScanTables}
                                startIcon={scanning ? <CircularProgress size={16} /> : <SearchIcon />}
                                disabled={scanning}
                            >
                                {scanning ? 'Scanning...' : 'Scan Database Tables'}
                            </Button>
                        </Grid>

                        {(candidateTables.length > 0 || allTables.length > 0) && (
                            <>
                                <Grid>
                                    <FormControl size="small" sx={{ minWidth: 200 }}>
                                        <InputLabel>Select Content Table</InputLabel>
                                        <Select
                                            value={selectedTable}
                                            label="Select Content Table"
                                            onChange={(e) => setSelectedTable(e.target.value)}
                                        >
                                            <MenuItem value="" disabled>Select Table</MenuItem>
                                            {candidateTables.map(tbl => (
                                                <MenuItem key={tbl} value={tbl}>
                                                    {tbl} {tbl === bestMatch && <Chip label="Recommended" size="small" color="success" sx={{ height: 16, ml: 1, fontSize: '0.6rem' }} />}
                                                </MenuItem>
                                            ))}
                                            {allTables.length > candidateTables.length && <MenuItem disabled>──────────</MenuItem>}
                                            {allTables
                                                .filter(tbl => !candidateTables.includes(tbl))
                                                .map(tbl => (
                                                    <MenuItem key={tbl} value={tbl} sx={{ color: 'text.secondary' }}>{tbl}</MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid>
                                    <Button
                                        variant="contained"
                                        onClick={handleSaveConfiguration}
                                        disabled={!selectedTable}
                                    >
                                        Save & Connect
                                    </Button>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Paper>
            )}

            {/* Posts Table */}
            <Paper className="glass" sx={{ overflow: 'hidden', borderRadius: 3 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedPosts.length === postsData?.posts.length && postsData?.posts.length > 0}
                                            indeterminate={selectedPosts.length > 0 && selectedPosts.length < (postsData?.posts.length || 0)}
                                            onChange={(e) => setSelectedPosts(e.target.checked ? postsData?.posts.map(p => p.id) || [] : [])}
                                        />
                                    </TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {postsData?.posts.map((post) => (
                                    <TableRow key={post.id} hover>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedPosts.includes(post.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedPosts([...selectedPosts, post.id]);
                                                    } else {
                                                        setSelectedPosts(selectedPosts.filter(id => id !== post.id));
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 500, maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {getPostTitle(post)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                {post.category || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                size="small"
                                                value={post.status}
                                                onChange={(e) => handleStatusChange(post.id, e.target.value)}
                                                sx={{ minWidth: 120 }}
                                            >
                                                <MenuItem value="published">Published</MenuItem>
                                                <MenuItem value="draft">Draft</MenuItem>
                                                <MenuItem value="scheduled">Scheduled</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">
                                                {(() => {
                                                    // Handle scheduled posts
                                                    if (post.status === 'scheduled' && post.scheduled_at) {
                                                        return `Scheduled: ${new Date(post.scheduled_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} ${new Date(post.scheduled_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })} IST`;
                                                    }
                                                    // Check multiple possible date field names
                                                    const dateValue = post.createdAt || post.created_at || post.date || post.publishedAt || post.published_at || post.updatedAt || post.updated_at;
                                                    if (dateValue) {
                                                        return new Date(dateValue).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' });
                                                    }
                                                    return '-';
                                                })()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Preview">
                                                <IconButton size="small" onClick={() => openPreviewModal(post)} color="primary">
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => openEditModal(post)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            {post.status === 'scheduled' && (
                                                <Tooltip title="Unschedule">
                                                    <IconButton size="small" onClick={() => handleUnschedulePost(post.id)}>
                                                        <AccessTimeIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error" onClick={() => handleDeletePost(post.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {(!postsData?.posts || postsData.posts.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                                            <Typography color="text.secondary">No blogs found</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Pagination */}
                {postsData && postsData.total_pages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <Button disabled={currentPage <= 1} onClick={() => fetchPosts(currentPage - 1)}>Previous</Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">Page</Typography>
                            <TextField
                                size="small"
                                value={pageInput}
                                onChange={(e) => setPageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handlePageInputSubmit()}
                                onBlur={handlePageInputSubmit}
                                sx={{ width: 60 }}
                                inputProps={{ style: { textAlign: 'center' } }}
                            />
                            <Typography variant="body2">of {postsData.total_pages}</Typography>
                        </Box>
                        <Button disabled={currentPage >= postsData.total_pages} onClick={() => fetchPosts(currentPage + 1)}>Next</Button>
                    </Box>
                )}
            </Paper>

            {/* Blog Edit Modal */}
            <BlogEdit
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                post={editingPost}
                onSave={handleSavePost}
                saving={saving}
                siteId={siteId}
            />

            {/* Scheduling Modal */}
            <Dialog open={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon />
                        <Typography>Schedule Post</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {schedulingPost && (
                        <Box sx={{ pt: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Post: <strong>{getPostTitle(schedulingPost)}</strong>
                            </Typography>

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="Schedule Date & Time"
                                    value={scheduledDateTime}
                                    onChange={setScheduledDateTime}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true
                                        }
                                    }}
                                    minDateTime={new Date()}
                                />
                            </LocalizationProvider>

                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                The post will be automatically published at the specified time.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setScheduleModalOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSchedulePost}
                        variant="contained"
                        disabled={!scheduledDateTime || scheduling}
                        startIcon={<ScheduleIcon />}
                    >
                        {scheduling ? 'Scheduling...' : 'Schedule Post'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Draft Confirmation Modal */}
            <Dialog open={draftConfirmOpen} onClose={() => { setDraftConfirmOpen(false); setPendingEditPost(null); }} maxWidth="sm">
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DraftsIcon color="warning" />
                        <Typography>Convert to Draft to Edit</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {pendingEditPost && (
                        <Box sx={{ pt: 1 }}>
                            <Typography variant="body1" gutterBottom>
                                This post is currently <strong>{pendingEditPost.status}</strong>.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                To edit a post, it must first be converted to draft status. After saving your changes, you can publish or schedule the post from the main list.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setDraftConfirmOpen(false); setPendingEditPost(null); }}>Cancel</Button>
                    <Button
                        onClick={handleConfirmDraftAndEdit}
                        variant="contained"
                        color="warning"
                        disabled={convertingToDraft}
                        startIcon={<DraftsIcon />}
                    >
                        {convertingToDraft ? 'Converting...' : 'Convert to Draft & Edit'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Preview Modal */}
            <Dialog
                open={previewModalOpen}
                onClose={() => setPreviewModalOpen(false)}
                maxWidth="md"
                fullWidth
                scroll="paper"
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Blog Preview</Typography>
                    <IconButton onClick={() => setPreviewModalOpen(false)} size="small">
                        <Box component="span" sx={{ fontSize: '1.5rem', lineHeight: 1 }}>&times;</Box>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {loadingPreview ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : previewingPost ? (
                        <Box>
                            {/* Featured Image(s) */}
                            {(() => {
                                let images: string[] = [];
                                try {
                                    console.log('Preview Post Data:', previewingPost);

                                    // 1. Check for `featuredImages` (camelCase array) - likely the new standard
                                    if (Array.isArray(previewingPost.featuredImages)) {
                                        images = previewingPost.featuredImages;
                                    }
                                    // 2. Check for `featured_images` (snake_case)
                                    else if (previewingPost.featured_images) {
                                        if (Array.isArray(previewingPost.featured_images)) {
                                            images = previewingPost.featured_images;
                                        } else if (typeof previewingPost.featured_images === 'string') {
                                            // Try parsing JSON, fallback to single string
                                            try {
                                                const parsed = JSON.parse(previewingPost.featured_images);
                                                images = Array.isArray(parsed) ? parsed : [parsed];
                                            } catch (e) {
                                                images = [previewingPost.featured_images];
                                            }
                                        }
                                    }
                                    // 3. Check for singular `featuredImage` or `featured_image`
                                    else if (previewingPost.featuredImage) {
                                        images = [previewingPost.featuredImage];
                                    } else if (previewingPost.featured_image) {
                                        images = [previewingPost.featured_image];
                                    }
                                } catch (e) {
                                    console.error('Error extracting images:', e);
                                    // Fallback final attempt
                                    if (typeof previewingPost.featured_images === 'string') {
                                        images = [previewingPost.featured_images];
                                    }
                                }

                                if (images.length > 0) {
                                    return <ImageSlideshow images={images} />;
                                }
                                return null;
                            })()}

                            {/* Title */}
                            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                                {getPostTitle(previewingPost)}
                            </Typography>

                            {/* Content Body */}
                            <Box
                                className="blog-content-preview"
                                sx={{
                                    '& img': { maxWidth: '100%', height: 'auto', borderRadius: 8, my: 2 },
                                    '& h2': { fontSize: '1.75rem', fontWeight: 600, mt: 4, mb: 2 },
                                    '& h3': { fontSize: '1.5rem', fontWeight: 600, mt: 3, mb: 1.5 },
                                    '& p': { mb: 2, lineHeight: 1.7, fontSize: '1.05rem', color: 'text.secondary' },
                                    '& ul, & ol': { mb: 2, pl: 3 },
                                    '& li': { mb: 1 },
                                    '& blockquote': {
                                        borderLeft: '4px solid',
                                        borderColor: 'primary.main',
                                        pl: 2,
                                        py: 1,
                                        my: 3,
                                        fontStyle: 'italic',
                                        bgcolor: 'action.hover'
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: previewingPost.content || '' }}
                            />
                        </Box>
                    ) : (
                        <Alert severity="warning">Content not available</Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewModalOpen(false)}>Close Preview</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SiteCMS;
