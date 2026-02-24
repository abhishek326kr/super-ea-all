import { useState, useEffect, useRef } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, FormControl, InputLabel, Select, MenuItem,
    Box, Typography, CircularProgress, Chip, Grid, Tabs, Tab,
    IconButton
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

interface BlogEditProps {
    open: boolean;
    onClose: () => void;
    post: any;
    onSave: (updatedPost: any) => void;
    saving: boolean;
    siteId?: string;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`blog-edit-tabpanel-${index}`}
            aria-labelledby={`blog-edit-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

const BlogEdit: React.FC<BlogEditProps> = ({ open, onClose, post, onSave, saving, siteId }) => {
    const [editForm, setEditForm] = useState<any>({});
    const [tabValue, setTabValue] = useState(0);
    const [lsiKeywordInput, setLsiKeywordInput] = useState('');
    const [faqInput, setFaqInput] = useState({ question: '', answer: '' });
    const [categories, setCategories] = useState<any[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`);
                setCategories(res.data);
            } catch (err) {
                console.error('Failed to load categories', err);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (post) {
            // Parse JSON fields if they come as strings from the database
            const parseArrayField = (field: any): any[] => {
                if (!field) return [];
                if (Array.isArray(field)) return field;
                if (typeof field === 'string') {
                    try {
                        const parsed = JSON.parse(field);
                        return Array.isArray(parsed) ? parsed : [];
                    } catch {
                        return [];
                    }
                }
                return [];
            };

            setEditForm({
                ...post,
                lsi_keywords: parseArrayField(post.lsi_keywords),
                faq_schema: parseArrayField(post.faq_schema),
                tags: post.tags || ''
            });
        }
    }, [post]);

    const handleSave = () => {
        // Always save as draft - user must explicitly publish/schedule from the posts list
        onSave({ ...editForm, status: 'draft' });
    };

    const handleFieldChange = (field: string, value: any) => {
        setEditForm((prev: any) => ({ ...prev, [field]: value }));
    };

    const addLsiKeyword = () => {
        if (lsiKeywordInput.trim()) {
            const current = editForm.lsi_keywords || [];
            handleFieldChange('lsi_keywords', [...current, lsiKeywordInput.trim()]);
            setLsiKeywordInput('');
        }
    };

    const removeLsiKeyword = (index: number) => {
        const current = editForm.lsi_keywords || [];
        handleFieldChange('lsi_keywords', current.filter((_: any, i: number) => i !== index));
    };

    const addFaq = () => {
        if (faqInput.question.trim() && faqInput.answer.trim()) {
            const current = editForm.faq_schema || [];
            handleFieldChange('faq_schema', [...current, { ...faqInput }]);
            setFaqInput({ question: '', answer: '' });
        }
    };

    const removeFaq = (index: number) => {
        const current = editForm.faq_schema || [];
        handleFieldChange('faq_schema', current.filter((_: any, i: number) => i !== index));
    };

    const tinyMceConfig = {
        height: 600,
        menubar: true,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter | ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | link image media | code | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #1a1a1a; color: #e0e0e0; }',
        skin: 'oxide-dark',
        content_css: 'dark',
        background_color: '#1a1a1a',
        color: '#e0e0e0',
        // Image upload settings
        automatic_uploads: true,
        paste_data_images: true,
        file_picker_types: 'image media',
        // Handle blob uploads (paste / drag-drop)
        images_upload_handler: async (blobInfo: any) => {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const uploadFormData = new FormData();
            uploadFormData.append('file', blobInfo.blob(), blobInfo.filename());
            // Use the passed siteId
            uploadFormData.append('site_ids', JSON.stringify(
                siteId ? [siteId] : []
            ));

            try {
                const res = await axios.post(
                    `${backendUrl}/upload-image-multi`,
                    uploadFormData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );

                if (res.data.success) {
                    return res.data.primary_url;
                } else {
                    throw new Error('Image upload failed');
                }
            } catch (err) {
                console.error('Image upload error:', err);
                throw new Error('Image upload failed');
            }
        },
        // "Browse" button in image/link/media dialogs
        file_picker_callback: (cb: any, _value: any, meta: any) => {
            // Setup file input based on type
            const input = document.createElement('input');
            input.setAttribute('type', 'file');

            // Set accepted file types based on dialog type
            if (meta.filetype === 'image') {
                input.setAttribute('accept', 'image/jpeg,image/png,image/gif,image/webp');
            } else if (meta.filetype === 'media') {
                input.setAttribute('accept', 'video/mp4,video/mpeg,audio/mpeg');
            }

            input.addEventListener('change', async () => {
                const file = input.files?.[0];
                if (!file) return;

                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                uploadFormData.append('site_ids', JSON.stringify(
                    siteId ? [siteId] : []
                ));

                try {
                    const res = await axios.post(
                        `${backendUrl}/upload-image-multi`,
                        uploadFormData,
                        { headers: { 'Content-Type': 'multipart/form-data' } }
                    );
                    if (res.data.success) {
                        // Pass URL and optional text/title to TinyMCE
                        cb(res.data.primary_url, { text: file.name, title: file.name });
                    }
                } catch (err) {
                    console.error('File upload failed:', err);
                    // Optionally alert user here
                }
            });
            input.click();
        }
    };

    if (!post) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            disableEnforceFocus
            disableAutoFocus
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Edit Blog Post #{post.id}</Typography>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pb: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                        <Tab label="Content" />
                        <Tab label="SEO & Meta" />
                        <Tab label="Advanced" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Title"
                                fullWidth
                                value={editForm.title || editForm.h1 || ''}
                                onChange={(e) => handleFieldChange('title', e.target.value)}
                                helperText="Main title of the blog post"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Content (TinyMCE Rich Text Editor)
                            </Typography>
                            <Editor
                                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                                value={editForm.content || ''}
                                onEditorChange={(content: string) => handleFieldChange('content', content)}
                                init={tinyMceConfig}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Author"
                                fullWidth
                                value={editForm.author || ''}
                                onChange={(e) => handleFieldChange('author', e.target.value)}
                                helperText="Author of the blog post"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Tags"
                                fullWidth
                                value={editForm.tags || ''}
                                onChange={(e) => handleFieldChange('tags', e.target.value)}
                                helperText="Comma-separated tags (e.g., technology, AI, programming)"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <FormControl fullWidth disabled={categoriesLoading}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={editForm.category || ''}
                                    onChange={(e) => handleFieldChange('category', e.target.value)}
                                    label="Category"
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {categories.map((cat: any) => (
                                        <MenuItem key={cat.id || cat.name} value={cat.name}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {categoriesLoading && (
                                <Typography variant="caption" color="text.secondary">Loading categories...</Typography>
                            )}
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Meta Title"
                                fullWidth
                                value={editForm.meta_title || editForm.metaTitle || ''}
                                onChange={(e) => handleFieldChange('meta_title', e.target.value)}
                                helperText="SEO title (max 255 characters)"
                                inputProps={{ maxLength: 255 }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Meta Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={editForm.meta_description || editForm.metaDescription || ''}
                                onChange={(e) => handleFieldChange('meta_description', e.target.value)}
                                helperText="SEO description (max 500 characters)"
                                inputProps={{ maxLength: 500 }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="SEO Slug"
                                fullWidth
                                value={editForm.seo_slug || ''}
                                onChange={(e) => handleFieldChange('seo_slug', e.target.value)}
                                helperText="URL-friendly slug for the post"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value="draft"
                                    label="Status"
                                    disabled
                                >
                                    <MenuItem value="draft">Draft</MenuItem>
                                </Select>
                            </FormControl>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Posts are always saved as draft during editing. After saving, change status to "Published" or "Scheduled" from the posts list.
                            </Typography>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                LSI Keywords
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <TextField
                                    size="small"
                                    placeholder="Add LSI keyword"
                                    value={lsiKeywordInput}
                                    onChange={(e) => setLsiKeywordInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addLsiKeyword()}
                                />
                                <Button onClick={addLsiKeyword} startIcon={<AddIcon />}>
                                    Add
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {(editForm.lsi_keywords || []).map((keyword: string, index: number) => (
                                    <Chip
                                        key={index}
                                        label={keyword}
                                        onDelete={() => removeLsiKeyword(index)}
                                        size="small"
                                    />
                                ))}
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                FAQ Schema
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                                <TextField
                                    size="small"
                                    placeholder="Question"
                                    value={faqInput.question}
                                    onChange={(e) => setFaqInput({ ...faqInput, question: e.target.value })}
                                />
                                <TextField
                                    size="small"
                                    placeholder="Answer"
                                    value={faqInput.answer}
                                    onChange={(e) => setFaqInput({ ...faqInput, answer: e.target.value })}
                                />
                                <Button onClick={addFaq} startIcon={<AddIcon />}>
                                    Add FAQ
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {(editForm.faq_schema || []).map((faq: any, index: number) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" fontWeight="bold">Q: {faq.question}</Typography>
                                            <Typography variant="body2">A: {faq.answer}</Typography>
                                        </Box>
                                        <IconButton size="small" onClick={() => removeFaq(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </TabPanel>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BlogEdit;
