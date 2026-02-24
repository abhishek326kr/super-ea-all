import { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, TextField, Button, CircularProgress, Tooltip, Grid,
    IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    Accordion, AccordionSummary, AccordionDetails, Chip
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HubIcon from '@mui/icons-material/Hub';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudIcon from '@mui/icons-material/Cloud';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

interface Site {
    id: string;
    name: string;
    target_table: string;
    r2_account_id?: string;
    r2_access_key_id?: string;
    r2_secret_access_key?: string;
    r2_bucket_name?: string;
    r2_public_url?: string;
    has_custom_r2?: boolean;
}

const SiteManager = () => {
    const { showToast } = useToast();
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteToConfirm, setDeleteToConfirm] = useState<Site | null>(null);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        db_type: 'postgresql',
        connection_string: '',
        target_table_name: '',
        r2_account_id: '',
        r2_access_key_id: '',
        r2_secret_access_key: '',
        r2_bucket_name: '',
        r2_public_url: ''
    });

    useEffect(() => {
        fetchSites();
    }, []);

    const fetchSites = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/sites`);
            setSites(res.data);
        } catch (err) {
            console.error(err);
            showToast('Failed to fetch sites', 'error');
        }
    };

    const handleConnect = async () => {
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/sites`, formData);
            await fetchSites();
            setFormData({
                id: '', name: '', db_type: 'postgresql', connection_string: '', target_table_name: '',
                r2_account_id: '', r2_access_key_id: '', r2_secret_access_key: '', r2_bucket_name: '', r2_public_url: ''
            });
            showToast('Site connected successfully!', 'success');
        } catch (err: any) {
            showToast(err.response?.data?.detail || 'Connection failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSite = async () => {
        if (!deleteToConfirm) return;
        setDeleting(true);
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/sites/${deleteToConfirm.id}`);
            await fetchSites();
            setDeleteToConfirm(null);
            showToast('Site deleted successfully', 'success');
        } catch (err: any) {
            showToast(err.response?.data?.detail || 'Delete failed', 'error');
        } finally {
            setDeleting(false);
        }
    };

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
                    Site Infrastructure
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{ color: '#64748B', fontSize: { xs: '0.875rem', md: '1rem' } }}
                >
                    Manage your decentralized content delivery nodes and database connections.
                </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, md: 4 }}>
                {/* Add New Site Form */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper
                        className="glass accent-top"
                        sx={{ p: { xs: 2.5, md: 4 }, borderRadius: { xs: 2, md: 3 } }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                            <Box sx={{
                                p: 0.8, borderRadius: 1.5, bgcolor: 'rgba(139, 92, 246, 0.1)',
                                mr: 1.5, display: 'flex', alignItems: 'center',
                            }}>
                                <AddIcon sx={{ color: '#A78BFA', fontSize: 20 }} />
                            </Box>
                            Add New Site
                        </Typography>
                        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField label="Internal Site ID" fullWidth value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} placeholder="e.g. yofx_prod" />
                            <TextField label="Display Name" fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Superadmin Main" />
                            <TextField label="Database URI" fullWidth multiline rows={2} placeholder="postgresql://user:pass@host:5432/db" value={formData.connection_string} onChange={(e) => setFormData({ ...formData, connection_string: e.target.value })} />
                            <TextField label="Target Table" fullWidth value={formData.target_table_name} onChange={(e) => setFormData({ ...formData, target_table_name: e.target.value })} placeholder="e.g. wp_posts" />

                            {/* R2 Storage Configuration */}
                            <Accordion
                                sx={{
                                    bgcolor: 'rgba(139, 92, 246, 0.04)',
                                    border: '1px solid rgba(139, 92, 246, 0.12)',
                                    borderRadius: '12px !important',
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#94A3B8' }} />}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CloudIcon sx={{ color: '#A78BFA', fontSize: 20 }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>R2 Storage Configuration</Typography>
                                        <Chip label="Optional" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(148, 163, 184, 0.1)', color: '#94A3B8' }} />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2 }}>
                                        Leave empty to use default storage. Fill in for site-specific R2 bucket.
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <TextField label="R2 Account ID" fullWidth size="small" value={formData.r2_account_id} onChange={(e) => setFormData({ ...formData, r2_account_id: e.target.value })} placeholder="e.g. ca706d5caa4561ec..." />
                                        <TextField label="R2 Access Key ID" fullWidth size="small" value={formData.r2_access_key_id} onChange={(e) => setFormData({ ...formData, r2_access_key_id: e.target.value })} />
                                        <TextField label="R2 Secret Access Key" fullWidth size="small" type="password" value={formData.r2_secret_access_key} onChange={(e) => setFormData({ ...formData, r2_secret_access_key: e.target.value })} />
                                        <TextField label="R2 Bucket Name" fullWidth size="small" value={formData.r2_bucket_name} onChange={(e) => setFormData({ ...formData, r2_bucket_name: e.target.value })} placeholder="e.g. my-bucket" />
                                        <TextField label="R2 Public URL" fullWidth size="small" value={formData.r2_public_url} onChange={(e) => setFormData({ ...formData, r2_public_url: e.target.value })} placeholder="e.g. https://pub-xxx.r2.dev" />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleConnect}
                                disabled={loading}
                                sx={{ mt: 1, borderRadius: 2.5 }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Establish Connection'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Active Nodes */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, mb: 3 }}>
                        <Box sx={{ p: 0.8, borderRadius: 1.5, bgcolor: 'rgba(245, 158, 11, 0.1)', display: 'flex' }}>
                            <HubIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Active Nodes
                        </Typography>
                        <Chip
                            label={sites.length}
                            size="small"
                            sx={{
                                bgcolor: 'rgba(139, 92, 246, 0.1)',
                                color: '#A78BFA',
                                fontWeight: 700,
                                minWidth: 28,
                            }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {sites.map((site, idx) => (
                            <Paper
                                key={site.id}
                                className="glass-card"
                                sx={{
                                    p: 2.5,
                                    animationDelay: `${idx * 0.05}s`,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{
                                            p: 1.5, borderRadius: 2,
                                            bgcolor: 'rgba(139, 92, 246, 0.08)',
                                            mr: 2, display: 'flex'
                                        }}>
                                            <StorageIcon sx={{ color: '#A78BFA' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{site.name}</Typography>
                                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                                                ID: {site.id} • Target: <b style={{ color: '#94A3B8' }}>{site.target_table}</b>
                                            </Typography>
                                            {site.has_custom_r2 && (
                                                <Chip
                                                    icon={<CloudIcon sx={{ fontSize: 14 }} />}
                                                    label="Custom R2"
                                                    size="small"
                                                    sx={{
                                                        ml: 1, height: 20, fontSize: '0.65rem',
                                                        bgcolor: 'rgba(59, 130, 246, 0.1)',
                                                        color: '#60A5FA',
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Tooltip title="Healthy Connection" arrow>
                                            <Box sx={{
                                                width: 8, height: 8, borderRadius: '50%',
                                                bgcolor: '#22C55E',
                                                boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)',
                                            }} />
                                        </Tooltip>
                                        <Tooltip title="Delete Connection" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={() => setDeleteToConfirm(site)}
                                                sx={{
                                                    color: '#64748B',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': { color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.08)' }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                        {sites.length === 0 && (
                            <Paper
                                className="glass"
                                variant="outlined"
                                sx={{
                                    p: 6, textAlign: 'center',
                                    borderStyle: 'dashed',
                                    borderColor: 'rgba(255, 255, 255, 0.08)',
                                    borderRadius: 3,
                                }}
                            >
                                <Box sx={{
                                    width: 56, height: 56, borderRadius: 2.5, mx: 'auto', mb: 2,
                                    bgcolor: 'rgba(139, 92, 246, 0.06)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <StorageIcon sx={{ fontSize: 28, color: '#52525B' }} />
                                </Box>
                                <Typography sx={{ color: '#64748B', fontWeight: 500 }}>
                                    No active nodes registered.
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#52525B', display: 'block', mt: 0.5 }}>
                                    Connect your first database to begin.
                                </Typography>
                            </Paper>
                        )}
                    </Box>
                </Grid>
            </Grid>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deleteToConfirm}
                onClose={() => setDeleteToConfirm(null)}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>
                    Delete Site Connection?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#94A3B8' }}>
                        Are you sure you want to delete the connection to <b style={{ color: '#E2E8F0' }}>{deleteToConfirm?.name}</b>?
                        This will remove the site from your active nodes. You can re-add it later by entering the connection details again.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 0 }}>
                    <Button onClick={() => setDeleteToConfirm(null)} variant="outlined" disabled={deleting} sx={{ borderRadius: 2 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteSite} color="error" variant="contained" disabled={deleting} sx={{ borderRadius: 2 }}>
                        {deleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SiteManager;
