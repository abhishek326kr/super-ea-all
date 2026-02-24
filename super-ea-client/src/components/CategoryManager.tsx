import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Button, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, Dialog, 
    DialogTitle, DialogContent, DialogActions, TextField, 
    CircularProgress, Alert, Tooltip, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
}

export default function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error loading categories');
            showToast('Error loading categories', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setDialogMode('edit');
            setSelectedCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || ''
            });
        } else {
            setDialogMode('create');
            setSelectedCategory(null);
            setFormData({ name: '', slug: '', description: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({ name: '', slug: '', description: '' });
        setSelectedCategory(null);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.slug) {
            showToast('Name and Slug are required', 'error');
            return;
        }

        try {
            setSaving(true);
            const url = dialogMode === 'edit' && selectedCategory 
                ? `${API_BASE_URL}/categories/${selectedCategory.id}`
                : `${API_BASE_URL}/categories`;
                
            const method = dialogMode === 'edit' ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to save category');
            }

            showToast(`Category ${dialogMode === 'edit' ? 'updated' : 'created'} successfully`, 'success');
            handleCloseDialog();
            fetchCategories();
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete category');

            showToast('Category deleted successfully', 'success');
            setCategories(categories.filter(c => c.id !== id));
        } catch (err: any) {
            showToast(err.message || 'Error deleting category', 'error');
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        if (dialogMode === 'create') {
            setFormData(prev => ({ ...prev, name, slug }));
        } else {
            setFormData(prev => ({ ...prev, name }));
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Categories Management</Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => handleOpenDialog()}
                    sx={{ backgroundColor: '#8B5CF6', '&:hover': { backgroundColor: '#7C3AED' } }}
                >
                    Add Category
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            )}

            <TableContainer component={Paper} className="glass" sx={{ background: 'rgba(30, 41, 59, 0.7)' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Slug</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                    No categories found. Click 'Add Category' to create one.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontWeight: 500 }}>{category.name}</TableCell>
                                    <TableCell>
                                        <Chip label={category.slug} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        {category.description || '-'}
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        {new Date(category.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit Category">
                                            <IconButton onClick={() => handleOpenDialog(category)} color="primary" size="small">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Category">
                                            <IconButton onClick={() => handleDelete(category.id, category.name)} color="error" size="small">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ className: "glass", sx: { background: '#1E293B' } }}>
                <DialogTitle>{dialogMode === 'create' ? 'Create Category' : 'Edit Category'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                        />
                        <TextField
                            label="Slug"
                            fullWidth
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                            helperText="URL-friendly version of the name"
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
                    <Button 
                        onClick={handleSave} 
                        variant="contained" 
                        disabled={saving || !formData.name || !formData.slug}
                        sx={{ backgroundColor: '#8B5CF6', '&:hover': { backgroundColor: '#7C3AED' } }}
                    >
                        {saving ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
