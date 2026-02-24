import { useState, useRef, useCallback } from 'react';
import {
    Box, Typography, IconButton, CircularProgress,
    List, ListItem, Alert, Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import axios from 'axios';

interface ImageUploaderProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    onUrlMappingUpdate?: (mapping: Record<string, Record<string, string>>) => void;
    maxImages?: number;
    error?: boolean;
    siteIds?: string[]; // List of site IDs to upload to (multi-site support)
}

const ImageUploader = ({ images, onImagesChange, onUrlMappingUpdate, maxImages = 5, error = false, siteIds = [] }: ImageUploaderProps) => {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            // Check if we have multiple sites to upload to
            if (siteIds.length > 0) {
                // Multi-site upload
                formData.append('site_ids', JSON.stringify(siteIds));
                const res = await axios.post(`${backendUrl}/upload-image-multi`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (res.data.success) {
                    // Update URL mappings in parent component
                    if (onUrlMappingUpdate && res.data.site_urls) {
                        onUrlMappingUpdate({ [res.data.primary_url]: res.data.site_urls });
                    }
                    return res.data.primary_url;
                } else {
                    throw new Error(res.data.error || 'Upload failed');
                }
            } else {
                // Legacy single-site upload (fallback)
                const res = await axios.post(`${backendUrl}/upload-image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (res.data.success) {
                    return res.data.url;
                } else {
                    throw new Error(res.data.error || 'Upload failed');
                }
            }
        } catch (err: any) {
            const message = err.response?.data?.detail || err.message || 'Upload failed';
            throw new Error(message);
        }
    };

    const handleFiles = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const remainingSlots = maxImages - images.length;
        if (remainingSlots <= 0) {
            setUploadError(`Maximum ${maxImages} images allowed`);
            return;
        }

        const filesToUpload = Array.from(files).slice(0, remainingSlots);

        // Validate file types
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const invalidFiles = filesToUpload.filter(f => !allowedTypes.includes(f.type));
        if (invalidFiles.length > 0) {
            setUploadError('Only JPG, PNG, GIF, and WebP images are allowed');
            return;
        }

        // Validate file sizes (max 10MB each)
        const oversizedFiles = filesToUpload.filter(f => f.size > 10 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            setUploadError('Each file must be under 10MB');
            return;
        }

        setUploading(true);
        setUploadError(null);

        const uploadedUrls: string[] = [];
        const errors: string[] = [];

        for (const file of filesToUpload) {
            try {
                const url = await uploadFile(file);
                if (url) uploadedUrls.push(url);
            } catch (err: any) {
                errors.push(`${file.name}: ${err.message}`);
            }
        }

        if (uploadedUrls.length > 0) {
            onImagesChange([...images, ...uploadedUrls]);
        }

        if (errors.length > 0) {
            setUploadError(errors.join(', '));
        }

        setUploading(false);
    }, [images, maxImages, onImagesChange, siteIds, onUrlMappingUpdate]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleRemoveImage = (index: number) => {
        const updated = images.filter((_, i) => i !== index);
        onImagesChange(updated);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Box>
            <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ color: error ? 'error.main' : 'inherit' }}
            >
                Featured Images (Min 1, Max {maxImages}) *
            </Typography>

            {/* Drag & Drop Zone */}
            <Paper
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                sx={{
                    p: 3,
                    mb: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '2px dashed',
                    borderColor: dragOver ? 'primary.main' : error ? 'error.main' : 'rgba(255,255,255,0.2)',
                    bgcolor: dragOver ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(139, 92, 246, 0.06)'
                    }
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => handleFiles(e.target.files)}
                />

                {uploading ? (
                    <Box sx={{ py: 2 }}>
                        <CircularProgress size={40} sx={{ color: 'primary.main', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            Uploading to Cloudflare R2...
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ py: 1 }}>
                        <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            Drag & drop images here, or click to select
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            JPG, PNG, GIF, WebP • Max 10MB each
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Error Alert */}
            {uploadError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUploadError(null)}>
                    {uploadError}
                </Alert>
            )}

            {/* Uploaded Images List */}
            {images.length > 0 && (
                <List dense sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, p: 1 }}>
                    {images.map((url, i) => (
                        <ListItem
                            key={i}
                            sx={{
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                <Box
                                    component="img"
                                    src={url}
                                    alt={`Image ${i + 1}`}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        bgcolor: 'black',
                                        flexShrink: 0
                                    }}
                                    onError={(e: any) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <ImageIcon sx={{ color: 'text.secondary', display: 'none' }} />
                                <Typography
                                    variant="caption"
                                    noWrap
                                    sx={{
                                        flex: 1,
                                        color: 'text.secondary',
                                        maxWidth: 'calc(100% - 100px)'
                                    }}
                                >
                                    {url}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveImage(i)}
                                    sx={{ color: 'error.main' }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            )}

            {/* Empty State */}
            {images.length === 0 && !uploading && (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No images uploaded yet. Upload at least 1 featured image.
                </Typography>
            )}
        </Box>
    );
};

export default ImageUploader;
