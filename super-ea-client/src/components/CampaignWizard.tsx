import { useState, useEffect, useRef } from 'react';
import {
    Box, Stepper, Step, StepLabel, Button, Typography, Paper,
    TextField, Grid, CircularProgress, Alert,
    Checkbox, CardActionArea,
    StepConnector, stepConnectorClasses, styled, Chip, MenuItem,
    Slider, RadioGroup, Radio, FormControlLabel, FormControl,
    FormLabel, FormGroup, Select,
    IconButton, List, ListItem, Switch, Stack, Divider, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Skeleton
} from '@mui/material';
import Check from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import SearchIcon from '@mui/icons-material/Search';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import DnsIcon from '@mui/icons-material/Dns';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import { useToast } from '../context/ToastContext';
import ImageUploader from './ImageUploader';

// Custom Stepper Design
const QontoConnector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#8B5CF6',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#8B5CF6',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderTopWidth: 2,
        borderRadius: 1,
    },
}));

const steps = [
    { label: 'Sites', icon: DnsIcon },
    { label: 'Identity', icon: HistoryEduIcon },
    { label: 'SEO Specs', icon: SearchIcon },
    { label: 'Tone & Vibe', icon: PsychologyIcon },
    { label: 'Structure', icon: FormatListBulletedIcon },
    { label: 'Preview', icon: VisibilityIcon },
    { label: 'Publish', icon: RocketLaunchIcon },
];

const CampaignWizard = () => {
    const { showToast } = useToast();
    const [activeStep, setActiveStep] = useState(0);
    const [maxReachedStep, setMaxReachedStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [availableSites, setAvailableSites] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);

    const [sitesLoading, setSitesLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Validation State
    const [validationModalOpen, setValidationModalOpen] = useState(false);
    const [validationResults] = useState<any[]>([]);
    const [supplementaryData, setSupplementaryData] = useState<Record<string, Record<string, any>>>({});
    // const [previewData, setPreviewData] = useState<any[]>([]);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [editableContent, setEditableContent] = useState<Record<string, any>>({});

    // Table Discovery State
    const [scanningSite, setScanningSite] = useState<string | null>(null);
    const [siteTableData, setSiteTableData] = useState<Record<string, { candidates: string[], best_match: string, all_tables: string[] }>>({});
    const [tableOverrides, setTableOverrides] = useState<Record<string, string>>({});

    // Image URL mappings: primary_url -> { site_id: site_specific_url }
    // Used to swap inline image URLs at publish time for per-site R2 independence
    const imageUrlMappings = useRef<Record<string, Record<string, string>>>({});

    const [formData, setFormData] = useState({
        core_identity: {
            campaign_name: '',
            primary_keyword: '',
            target_audience: 'Beginners',
            intent: 'Informational',
            content_type: 'Standard Blog Post'
        },
        seo_technical: {
            secondary_keywords: [] as string[],
            meta_description_goal: '',
            internal_links: [] as string[],
            download_link: '',
            external_authority_links: false,
            external_links: [] as string[],
            slug_strategy: 'keyword-rich',
            featured_image_urls: [] as string[]
        },
        personalization: {
            act_as: 'The Friendly Coder',
            custom_persona: '',
            tone: 'Professional/Corporate',
            style: 'Direct & Concise',
            pov: 'Second Person',
            emoji_usage: 'Minimal',
            humanization_level: 50,
            negative_constraints: ''
        },
        structure: {
            target_word_count: [1000, 2000] as number[],
            header_structure: ['FAQ Section', 'Key Takeaways Box'],
            cta: ''
        },
        distribution: {
            post_status: 'Save as Draft',
            category: ''
        },
        target_site_ids: [] as string[]
    });

    const [newKeyword, setNewKeyword] = useState('');
    const [newLink, setNewLink] = useState('');
    const [newExternalLink, setNewExternalLink] = useState('');
    const [newFeaturedImageUrl, setNewFeaturedImageUrl] = useState('');

    // URL validation states
    const [linkErrors, setLinkErrors] = useState<{
        featuredImage: string;
        internalLink: string;
        externalLink: string;
        downloadLink: string;
    }>({
        featuredImage: '',
        internalLink: '',
        externalLink: '',
        downloadLink: ''
    });

    // Field validation errors state
    const [fieldErrors, setFieldErrors] = useState<{
        campaign_name: boolean;
        primary_keyword: boolean;
        target_audience: boolean;
        intent: boolean;
        content_type: boolean;
        secondary_keywords: boolean;
        featured_image_urls: boolean;
        act_as: boolean;
        custom_persona: boolean;
        tone: boolean;
        style: boolean;
        pov: boolean;
        emoji_usage: boolean;
    }>({
        campaign_name: false,
        primary_keyword: false,
        target_audience: false,
        intent: false,
        content_type: false,
        secondary_keywords: false,
        featured_image_urls: false,
        act_as: false,
        custom_persona: false,
        tone: false,
        style: false,
        pov: false,
        emoji_usage: false,
    });

    // URL validation helper
    const isValidUrl = (url: string): boolean => {
        if (!url.trim()) return true; // Empty is valid (optional field)
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const validateUrl = (url: string, field: 'featuredImage' | 'internalLink' | 'externalLink' | 'downloadLink'): boolean => {
        const isValid = isValidUrl(url);
        setLinkErrors(prev => ({
            ...prev,
            [field]: isValid ? '' : 'Please enter a valid URL (e.g., https://example.com)'
        }));
        return isValid;
    };

    useEffect(() => {
        fetchSites();
        fetchCategories();
    }, []);

    const fetchSites = async () => {
        setSitesLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/sites`);
            setAvailableSites(res.data);
        } catch (err) {
            console.error(err);
            showToast('Failed to load sites', 'error');
        } finally {
            setSitesLoading(false);
        }
    };

    const fetchCategories = async () => {
        setCategoriesLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`);
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to load categories', err);
        } finally {
            setCategoriesLoading(false);
        }
    };

    const validateStep = (stepIndex: number): boolean => {
        // Validate Step 0: Site Selection
        if (stepIndex === 0) {
            if (formData.target_site_ids.length === 0) {
                const errorMsg = 'Please select at least one target site.';
                setError(errorMsg);
                showToast(errorMsg, 'warning');
                return false;
            }
            setError(null);
            return true;
        }

        // Validate Step 1: Core Content Identity
        if (stepIndex === 1) {
            const errors = {
                campaign_name: !formData.core_identity.campaign_name.trim(),
                primary_keyword: !formData.core_identity.primary_keyword.trim(),
                target_audience: !formData.core_identity.target_audience,
                intent: !formData.core_identity.intent,
                content_type: !formData.core_identity.content_type,
            };

            if (Object.values(errors).some(Boolean)) {
                setFieldErrors(prev => ({ ...prev, ...errors }));
                const errorMsg = 'Please fill in all required fields in the Identity section.';
                setError(errorMsg);
                showToast(errorMsg, 'warning');
                return false;
            }
            setFieldErrors(prev => ({ ...prev, ...errors }));
            setError(null);
            return true;
        }

        // Validate Step 2: SEO Parameters
        if (stepIndex === 2) {
            const errors = {
                secondary_keywords: formData.seo_technical.secondary_keywords.length < 2,
                featured_image_urls: formData.seo_technical.featured_image_urls.length === 0 ||
                    !formData.seo_technical.featured_image_urls.every(url => isValidUrl(url)),
            };

            if (Object.values(errors).some(Boolean)) {
                setFieldErrors(prev => ({ ...prev, ...errors }));
                let errorMsg = '';
                if (errors.secondary_keywords) errorMsg += 'Please add at least 2 LSI keywords. ';
                if (errors.featured_image_urls) errorMsg += 'Please add at least one valid Featured Image URL.';
                setError(errorMsg.trim());
                showToast(errorMsg.trim(), 'warning');
                return false;
            }
            setFieldErrors(prev => ({ ...prev, ...errors }));
            setError(null);
            return true;
        }

        // Validate Step 3: Tone, Style & Persona
        if (stepIndex === 3) {
            const errors = {
                act_as: !formData.personalization.act_as,
                custom_persona: formData.personalization.act_as === 'Custom' && !formData.personalization.custom_persona.trim(),
                tone: !formData.personalization.tone,
                style: !formData.personalization.style,
                pov: !formData.personalization.pov,
                emoji_usage: !formData.personalization.emoji_usage,
            };

            if (Object.values(errors).some(Boolean)) {
                setFieldErrors(prev => ({ ...prev, ...errors }));
                const errorMsg = 'Please fill in all required fields in the Tone & Style section.';
                setError(errorMsg);
                showToast(errorMsg, 'warning');
                return false;
            }
            setFieldErrors(prev => ({ ...prev, ...errors }));
            setError(null);
            return true;
        }

        return true;
    };

    const handleNext = () => {
        if (!validateStep(activeStep)) {
            return;
        }

        const nextStep = activeStep + 1;
        const newMax = Math.max(maxReachedStep, nextStep);
        setMaxReachedStep(newMax);

        if (activeStep === 4) {
            // Step 4: Structure -> generate preview and go to step 5 (Preview)
            handleGeneratePreview();
        } else if (activeStep === 6) {
            // Step 6: Publish step -> inject content
            handleInjectContent();
        } else {
            setActiveStep(nextStep);
        }
    };

    const handleStepClick = (index: number) => {
        // Allow backwards navigation
        if (index < activeStep) {
            setActiveStep(index);
            return;
        }

        // Allow forward navigation only if we've been there before AND current step is valid
        if (index > activeStep) {
            if (index <= maxReachedStep) {
                if (validateStep(activeStep)) {
                    setActiveStep(index);
                }
            } else {
                showToast('Please complete the current step first.', 'warning');
            }
        }
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleToggleSite = (siteId: string) => {
        const current = formData.target_site_ids;
        const newSites = current.includes(siteId)
            ? current.filter(id => id !== siteId)
            : [...current, siteId];
        setFormData({ ...formData, target_site_ids: newSites });
    };

    const handleGeneratePreview = async () => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                core_identity: formData.core_identity,
                seo_technical: formData.seo_technical,
                personalization: formData.personalization,
                structure: formData.structure,
                distribution: formData.distribution
            };

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.post(`${backendUrl}/generate`, payload);

            // Store the generated content as editable content (single content, not per-site)
            setEditableContent({ _generated: res.data });
            setPreviewData([{ site_id: '_generated', preview_content: res.data }]);

            showToast('Content generated successfully!', 'success');
            setActiveStep(5);
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            let errorMsg = 'Content Generation Failed';
            if (Array.isArray(detail)) {
                errorMsg = detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ");
            } else if (typeof detail === 'object' && detail !== null) {
                errorMsg = JSON.stringify(detail);
            } else if (typeof detail === 'string') {
                errorMsg = detail;
            } else if (err.message) {
                errorMsg = err.message;
            }
            setError(errorMsg);
            showToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerateContent = async () => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                core_identity: formData.core_identity,
                seo_technical: formData.seo_technical,
                personalization: formData.personalization,
                structure: formData.structure,
                distribution: formData.distribution
            };

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.post(`${backendUrl}/generate`, payload);

            // Store the regenerated content
            setEditableContent({ _generated: res.data });
            setPreviewData([{ site_id: '_generated', preview_content: res.data }]);
            showToast('Content regenerated successfully!', 'success');
            // Stay on current step (4) - don't advance
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            let errorMsg = 'Regeneration Failed';
            if (Array.isArray(detail)) {
                errorMsg = detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ");
            } else if (typeof detail === 'object' && detail !== null) {
                errorMsg = JSON.stringify(detail);
            } else if (typeof detail === 'string') {
                errorMsg = detail;
            } else if (err.message) {
                errorMsg = err.message;
            }
            setError(errorMsg);
            showToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInjectContent = async () => {
        setLoading(true);
        setError(null);
        try {
            // Get the generated content
            const generatedContent = editableContent._generated;
            if (!generatedContent) {
                setError("No content to publish. Please generate content first.");
                setLoading(false);
                return;
            }

            // Generate a proper slug from the title
            const generateSlug = (title: string): string => {
                return title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .substring(0, 100);
            };

            const titleText = generatedContent.h1 || generatedContent.meta_title || 'untitled';
            const slug = generateSlug(titleText);

            // Build injections array for each selected site
            const injections = formData.target_site_ids.map((siteId: string) => {
                const site = availableSites.find((s: any) => s.id === siteId);

                // Swap inline image URLs AND featured image URLs to use this site's own R2 bucket URL
                let siteBodyHtml = generatedContent.body_html || '';
                let siteFeaturedImages = [...formData.seo_technical.featured_image_urls];

                for (const [primaryUrl, siteUrls] of Object.entries(imageUrlMappings.current)) {
                    if (siteUrls[siteId]) {
                        // Swap in body content
                        siteBodyHtml = siteBodyHtml.split(primaryUrl).join(siteUrls[siteId]);

                        // Swap in featured images list
                        siteFeaturedImages = siteFeaturedImages.map(url =>
                            url === primaryUrl ? siteUrls[siteId] : url
                        );
                    }
                }

                return {
                    site_id: siteId,
                    target_table: tableOverrides[siteId] || site?.target_table || 'Blog',
                    content: {
                        // Core content fields (try both snake_case and camelCase for compatibility)
                        title: titleText,
                        content: siteBodyHtml,
                        status: formData.distribution.post_status === 'Publish Immediately' ? 'published' :
                            formData.distribution.post_status === 'Schedule' ? 'scheduled' : 'draft',
                        post_status: formData.distribution.post_status, // Original post status for reference

                        // SEO fields - snake_case versions (common in databases)
                        seo_title: generatedContent.meta_title,
                        seo_description: generatedContent.meta_description,
                        seo_slug: slug,
                        meta_title: generatedContent.meta_title,
                        meta_description: generatedContent.meta_description,

                        // Slug field (different naming conventions)
                        slug: slug,

                        // Featured image (first URL as primary, all URLs as JSON array)
                        featured_image: siteFeaturedImages[0] || null,
                        featuredImage: siteFeaturedImages[0] || null,
                        featured_images: siteFeaturedImages.length > 0
                            ? JSON.stringify(siteFeaturedImages) : null,
                        featuredImages: siteFeaturedImages.length > 0
                            ? JSON.stringify(siteFeaturedImages) : null,
                        images: siteFeaturedImages.length > 0
                            ? JSON.stringify(siteFeaturedImages) : null,

                        // Download link (multiple naming conventions for column matching)
                        download_link: formData.seo_technical.download_link || null,
                        downloadLink: formData.seo_technical.download_link || null,
                        download_url: formData.seo_technical.download_link || null,
                        downloadUrl: formData.seo_technical.download_link || null,
                        file_url: formData.seo_technical.download_link || null,
                        fileUrl: formData.seo_technical.download_link || null,

                        // JSON fields
                        faq_schema: generatedContent.faq_schema_json ? JSON.stringify(generatedContent.faq_schema_json) : null,
                        lsi_keywords: generatedContent.lsi_used ? JSON.stringify(generatedContent.lsi_used) : null
                    }
                };
            });

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.post(`${backendUrl}/inject-content`, { injections });
            setResults(res.data);
            showToast('Content injected successfully!', 'success');
            setActiveStep(7);
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            let errorMsg = 'Injection Failed';
            if (Array.isArray(detail)) {
                errorMsg = detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ");
            } else if (typeof detail === 'object' && detail !== null) {
                errorMsg = JSON.stringify(detail);
            } else if (typeof detail === 'string') {
                errorMsg = detail;
            } else if (err.message) {
                errorMsg = err.message;
            }
            setError(errorMsg);
            showToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEditContent = (siteId: string, field: string, value: any) => {
        setEditableContent(prev => ({
            ...prev,
            [siteId]: {
                ...prev[siteId],
                [field]: value
            }
        }));
    };

    const handleSuperPublish = async (overridePayload?: any) => {
        // Legacy function - now using preview flow
        setLoading(true);
        setError(null);
        try {
            const payload = overridePayload || {
                content_req: {
                    core_identity: formData.core_identity,
                    seo_technical: formData.seo_technical,
                    personalization: formData.personalization,
                    structure: formData.structure,
                    distribution: formData.distribution
                },
                target_site_ids: formData.target_site_ids,
                supplementary_data: null,
                table_overrides: tableOverrides
            };

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.post(`${backendUrl}/super-publish`, payload);
            setResults(res.data);
            showToast('Super publish completed successfully!', 'success');
            setActiveStep(6);
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            let errorMsg = 'Orchestration Failure';
            if (Array.isArray(detail)) {
                errorMsg = detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ");
            } else if (typeof detail === 'object' && detail !== null) {
                errorMsg = JSON.stringify(detail);
            } else if (typeof detail === 'string') {
                errorMsg = detail;
            } else if (err.message) {
                errorMsg = err.message;
            }
            setError(errorMsg);
            showToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSupplementaryChange = (siteId: string, field: string, value: string) => {
        setSupplementaryData(prev => ({
            ...prev,
            [siteId]: {
                ...(prev[siteId] || {}),
                [field]: value
            }
        }));
    };

    const handleProceedWithSupplementary = () => {
        const payload = {
            content_req: {
                core_identity: formData.core_identity,
                seo_technical: formData.seo_technical,
                personalization: formData.personalization,
                structure: formData.structure,
                distribution: formData.distribution
            },
            target_site_ids: formData.target_site_ids,
            supplementary_data: supplementaryData
        };
        handleSuperPublish(payload);
    };

    const addSecondaryKeyword = () => {
        if (newKeyword && formData.seo_technical.secondary_keywords.length < 5) {
            setFormData({
                ...formData,
                seo_technical: {
                    ...formData.seo_technical,
                    secondary_keywords: [...formData.seo_technical.secondary_keywords, newKeyword]
                }
            });
            setNewKeyword('');
        }
    };

    const removeSecondaryKeyword = (index: number) => {
        const updated = formData.seo_technical.secondary_keywords.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            seo_technical: { ...formData.seo_technical, secondary_keywords: updated }
        });
    };

    const addInternalLink = () => {
        if (newLink) {
            if (!validateUrl(newLink, 'internalLink')) {
                return; // Don't add if invalid
            }
            setFormData({
                ...formData,
                seo_technical: {
                    ...formData.seo_technical,
                    internal_links: [...formData.seo_technical.internal_links, newLink]
                }
            });
            setNewLink('');
            setLinkErrors(prev => ({ ...prev, internalLink: '' }));
        }
    };

    const removeInternalLink = (index: number) => {
        const updated = formData.seo_technical.internal_links.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            seo_technical: { ...formData.seo_technical, internal_links: updated }
        });
    };

    const addExternalLink = () => {
        if (newExternalLink) {
            if (!validateUrl(newExternalLink, 'externalLink')) {
                return; // Don't add if invalid
            }
            setFormData({
                ...formData,
                seo_technical: {
                    ...formData.seo_technical,
                    external_links: [...formData.seo_technical.external_links, newExternalLink]
                }
            });
            setNewExternalLink('');
            setLinkErrors(prev => ({ ...prev, externalLink: '' }));
        }
    };

    const removeExternalLink = (index: number) => {
        const updated = formData.seo_technical.external_links.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            seo_technical: { ...formData.seo_technical, external_links: updated }
        });
    };

    const addFeaturedImageUrl = () => {
        if (newFeaturedImageUrl) {
            if (!validateUrl(newFeaturedImageUrl, 'featuredImage')) {
                return; // Don't add if invalid
            }
            setFormData({
                ...formData,
                seo_technical: {
                    ...formData.seo_technical,
                    featured_image_urls: [...formData.seo_technical.featured_image_urls, newFeaturedImageUrl]
                }
            });
            setNewFeaturedImageUrl('');
            setLinkErrors(prev => ({ ...prev, featuredImage: '' }));
        }
    };

    const removeFeaturedImageUrl = (index: number) => {
        const updated = formData.seo_technical.featured_image_urls.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            seo_technical: { ...formData.seo_technical, featured_image_urls: updated }
        });
    };

    const toggleHeaderStructure = (item: string) => {
        const current = formData.structure.header_structure;
        const updated = current.includes(item)
            ? current.filter(i => i !== item)
            : [...current, item];
        setFormData({
            ...formData,
            structure: { ...formData.structure, header_structure: updated }
        });
    };

    const handleScanTables = async (siteId: string) => {
        setScanningSite(siteId);
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.get(`${backendUrl}/sites/${siteId}/candidate-tables`);

            setSiteTableData(prev => ({
                ...prev,
                [siteId]: res.data
            }));

            // Auto-select best match if available and not already overridden
            if (res.data.best_match && !tableOverrides[siteId]) {
                setTableOverrides(prev => ({
                    ...prev,
                    [siteId]: res.data.best_match
                }));
            }
            showToast('Tables scanned successfully!', 'success');
        } catch (err: any) {
            console.error("Scan failed", err);
            showToast('Failed to scan tables', 'error');
        } finally {
            setScanningSite(null);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: { xs: 3, md: 6 }, textAlign: 'center', px: { xs: 1, md: 0 } }}>
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
                    Command Center
                </Typography>
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                >
                    Orchestrate high-fidelity content generation across your global site network.
                </Typography>
            </Box>

            <Stepper
                activeStep={activeStep}
                alternativeLabel
                connector={<QontoConnector />}
                sx={{
                    mb: { xs: 4, md: 8 },
                    '& .MuiStepLabel-label': {
                        display: { xs: 'none', sm: 'block' }
                    }
                }}
            >
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            onClick={() => handleStepClick(index)}
                            sx={{ cursor: 'pointer' }}
                            StepIconComponent={({ active, completed }) => (
                                <Box sx={{
                                    color: active || completed ? 'primary.main' : 'text.secondary',
                                    display: 'flex',
                                    zIndex: 1,
                                    bgcolor: 'background.default',
                                    p: { xs: 0.25, md: 0.5 },
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        bgcolor: 'action.hover'
                                    }
                                }}>
                                    {completed ? <Check sx={{ fontSize: { xs: 18, md: 24 } }} /> : <step.icon sx={{ fontSize: { xs: 18, md: 24 } }} />}
                                </Box>
                            )}
                        >
                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>{step.label}</Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Paper className="glass" sx={{ p: { xs: 3, md: 6 }, borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
                {/* Step 1: Site Selection */}
                {activeStep === 0 && (
                    <Box className="animate-fade-in">
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>1. Select Target Sites</Typography>
                        <Typography color="text.secondary" sx={{ mb: 4 }}>
                            Choose one or more sites to publish your content to.
                        </Typography>

                        <Grid container spacing={2}>
                            {sitesLoading ? (
                                // Skeleton Loaders
                                Array.from(new Array(4)).map((_, index) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={index}>
                                        <Skeleton
                                            variant="rectangular"
                                            height={80}
                                            sx={{ borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.05)' }}
                                            animation="wave"
                                        />
                                    </Grid>
                                ))
                            ) : (
                                // Actual Sites
                                availableSites.map(site => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={site.id}>
                                        <Paper
                                            className="glass-card"
                                            sx={{
                                                p: 0,
                                                borderColor: formData.target_site_ids.includes(site.id) ? 'primary.main' : 'rgba(255,255,255,0.05)',
                                                borderWidth: 2
                                            }}
                                        >
                                            <CardActionArea onClick={() => handleToggleSite(site.id)} sx={{ p: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Checkbox checked={formData.target_site_ids.includes(site.id)} color="primary" sx={{ mr: 1 }} />
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{site.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">Table: {site.target_table}</Typography>
                                                    </Box>
                                                </Box>
                                            </CardActionArea>
                                        </Paper>
                                    </Grid>
                                ))
                            )}

                            {!sitesLoading && availableSites.length === 0 && (
                                <Alert severity="warning" variant="outlined" sx={{ width: '100%', mx: 2 }}>
                                    No sites detected. Connect sites in the <b>Site Manager</b> before proceeding.
                                </Alert>
                            )}
                        </Grid>

                        {formData.target_site_ids.length > 0 && (
                            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(139, 92, 246, 0.06)', borderRadius: 2, border: '1px solid rgba(139, 92, 246, 0.12)' }}>
                                <Typography variant="subtitle2" color="primary">
                                    {formData.target_site_ids.length} site{formData.target_site_ids.length > 1 ? 's' : ''} selected
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Images will be stored in each site's respective bucket.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Step 2: Identity */}
                {activeStep === 1 && (
                    <Box className="animate-fade-in">
                        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>2. Core Content Identity</Typography>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField fullWidth label="Campaign Name" value={formData.core_identity.campaign_name} onChange={(e) => { setFormData({ ...formData, core_identity: { ...formData.core_identity, campaign_name: e.target.value } }); setFieldErrors(prev => ({ ...prev, campaign_name: false })); }} placeholder="Internal Campaign Reference" required error={fieldErrors.campaign_name} helperText={fieldErrors.campaign_name ? 'Campaign name is required' : ''} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField fullWidth label="Primary Keyword" value={formData.core_identity.primary_keyword} onChange={(e) => { setFormData({ ...formData, core_identity: { ...formData.core_identity, primary_keyword: e.target.value } }); setFieldErrors(prev => ({ ...prev, primary_keyword: false })); }} placeholder="e.g. Best MT5 EAs 2024" required error={fieldErrors.primary_keyword} helperText={fieldErrors.primary_keyword ? 'Primary keyword is required' : ''} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField select fullWidth label="Target Audience" value={formData.core_identity.target_audience} onChange={(e) => { setFormData({ ...formData, core_identity: { ...formData.core_identity, target_audience: e.target.value } }); setFieldErrors(prev => ({ ...prev, target_audience: false })); }} required error={fieldErrors.target_audience} helperText={fieldErrors.target_audience ? 'Target audience is required' : ''}>
                                    <MenuItem value="Beginners">Beginners</MenuItem>
                                    <MenuItem value="Intermediate Traders">Intermediate Traders</MenuItem>
                                    <MenuItem value="Developers">Developers</MenuItem>
                                    <MenuItem value="C-Level Execs">C-Level Execs</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField select fullWidth label="Search Intent" value={formData.core_identity.intent} onChange={(e) => { setFormData({ ...formData, core_identity: { ...formData.core_identity, intent: e.target.value as any } }); setFieldErrors(prev => ({ ...prev, intent: false })); }} required error={fieldErrors.intent} helperText={fieldErrors.intent ? 'Search intent is required' : ''}>
                                    <MenuItem value="Informational">Informational (How-to)</MenuItem>
                                    <MenuItem value="Transactional">Transactional (Sign up)</MenuItem>
                                    <MenuItem value="Commercial Investigation">Commercial Investigation (Best X for Y)</MenuItem>
                                    <MenuItem value="Navigational">Navigational</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField select fullWidth label="Content Type" value={formData.core_identity.content_type} onChange={(e) => { setFormData({ ...formData, core_identity: { ...formData.core_identity, content_type: e.target.value as any } }); setFieldErrors(prev => ({ ...prev, content_type: false })); }} required error={fieldErrors.content_type} helperText={fieldErrors.content_type ? 'Content type is required' : ''}>
                                    <MenuItem value="Standard Blog Post">Standard Blog Post</MenuItem>
                                    <MenuItem value="Pillar Page">Pillar Page</MenuItem>
                                    <MenuItem value="Listicle">Listicle</MenuItem>
                                    <MenuItem value="Case Study">Case Study</MenuItem>
                                    <MenuItem value="News Update">News Update</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Step 3: SEO Parameters */}
                {activeStep === 2 && (
                    <Box className="animate-fade-in">
                        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>3. SEO Parameters</Typography>
                        {/* Row 1: Keywords and Meta Description */}
                        <Grid container spacing={4} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" gutterBottom sx={{ color: fieldErrors.secondary_keywords ? 'error.main' : 'inherit' }}>Secondary / LSI Keywords (Min 2, Max 5) *</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                    <TextField fullWidth size="small" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSecondaryKeyword(); } }} placeholder="Add Keyword..." disabled={formData.seo_technical.secondary_keywords.length >= 5} />
                                    <Button variant="outlined" onClick={addSecondaryKeyword} disabled={!newKeyword || formData.seo_technical.secondary_keywords.length >= 5}><AddIcon /></Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 32 }}>
                                    {formData.seo_technical.secondary_keywords.map((kw, i) => (
                                        <Chip key={i} label={kw} onDelete={() => removeSecondaryKeyword(i)} />
                                    ))}
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField fullWidth label="Meta Description Goal (Optional)" multiline rows={3} value={formData.seo_technical.meta_description_goal} onChange={(e) => setFormData({ ...formData, seo_technical: { ...formData.seo_technical, meta_description_goal: e.target.value } })} placeholder="AI generates if left blank" />
                            </Grid>
                        </Grid>

                        {/* Row 2: Internal Links and Featured Image */}
                        <Grid container spacing={4} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" gutterBottom>Internal Links</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={newLink}
                                        onChange={(e) => { setNewLink(e.target.value); setLinkErrors(prev => ({ ...prev, internalLink: '' })); }}
                                        onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addInternalLink(); } }}
                                        placeholder="https://..."
                                        error={!!linkErrors.internalLink}
                                        helperText={linkErrors.internalLink}
                                    />
                                    <Button variant="outlined" onClick={addInternalLink} disabled={!newLink} className='h-[23px]'><AddIcon /></Button>
                                </Box>
                                <List dense sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, p: 1, minHeight: 40 }}>
                                    {formData.seo_technical.internal_links.map((link, i) => (
                                        <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                                            <Typography variant="caption" noWrap sx={{ maxWidth: '80%', color: 'text.secondary' }}>{link}</Typography>
                                            <IconButton size="small" sx={{ ml: 'auto' }} onClick={() => removeInternalLink(i)}><DeleteIcon fontSize="small" /></IconButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <ImageUploader
                                    images={formData.seo_technical.featured_image_urls}
                                    onImagesChange={(newImages) => {
                                        setFormData({
                                            ...formData,
                                            seo_technical: {
                                                ...formData.seo_technical,
                                                featured_image_urls: newImages
                                            }
                                        });
                                        setFieldErrors(prev => ({ ...prev, featured_image_urls: false }));
                                    }}
                                    onUrlMappingUpdate={(mapping) => {
                                        // Merge new mappings into existing ref
                                        Object.assign(imageUrlMappings.current, mapping);
                                    }}
                                    error={fieldErrors.featured_image_urls}
                                    siteIds={formData.target_site_ids.length > 0
                                        ? formData.target_site_ids
                                        : [availableSites[0]?.id].filter(Boolean)}
                                />
                            </Grid>
                        </Grid>

                        {/* Row 3: Download Link and Slug Strategy */}
                        <Grid container spacing={4} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Download Link"
                                    value={formData.seo_technical.download_link}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData({ ...formData, seo_technical: { ...formData.seo_technical, download_link: value } });
                                        if (value.trim()) {
                                            validateUrl(value, 'downloadLink');
                                        } else {
                                            setLinkErrors(prev => ({ ...prev, downloadLink: '' }));
                                        }
                                    }}
                                    onBlur={() => {
                                        if (formData.seo_technical.download_link.trim()) {
                                            validateUrl(formData.seo_technical.download_link, 'downloadLink');
                                        }
                                    }}
                                    placeholder="https://example.com/download/file.zip"
                                    error={!!linkErrors.downloadLink}
                                    helperText={linkErrors.downloadLink || "URL for downloadable content (e.g., EA file, PDF)"}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField fullWidth label="Slug Strategy" value={formData.seo_technical.slug_strategy} onChange={(e) => setFormData({ ...formData, seo_technical: { ...formData.seo_technical, slug_strategy: e.target.value } })} />
                            </Grid>
                        </Grid>

                        {/* Row 4: External Authority Links */}
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControlLabel
                                    control={<Switch checked={formData.seo_technical.external_authority_links} onChange={(e) => setFormData({ ...formData, seo_technical: { ...formData.seo_technical, external_authority_links: e.target.checked } })} />}
                                    label="External Authority Links (Investopedia, Wiki)"
                                />
                                {formData.seo_technical.external_authority_links && (
                                    <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(139, 92, 246, 0.06)', borderRadius: 2, border: '1px solid rgba(139, 92, 246, 0.12)' }}>
                                        <Typography variant="subtitle2" gutterBottom>External Authority Links</Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={newExternalLink}
                                                onChange={(e) => { setNewExternalLink(e.target.value); setLinkErrors(prev => ({ ...prev, externalLink: '' })); }}
                                                onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExternalLink(); } }}
                                                placeholder="https://investopedia.com/..."
                                                error={!!linkErrors.externalLink}
                                                helperText={linkErrors.externalLink}
                                            />
                                            <Button variant="outlined" onClick={addExternalLink} disabled={!newExternalLink}><AddIcon /></Button>
                                        </Box>
                                        <List dense sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, p: 1 }}>
                                            {formData.seo_technical.external_links.map((link, i) => (
                                                <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                                                    <Typography variant="caption" noWrap sx={{ maxWidth: '80%', color: 'text.secondary' }}>{link}</Typography>
                                                    <IconButton size="small" sx={{ ml: 'auto' }} onClick={() => removeExternalLink(i)}><DeleteIcon fontSize="small" /></IconButton>
                                                </ListItem>
                                            ))}
                                            {formData.seo_technical.external_links.length === 0 && (
                                                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                    Add authority links (e.g., Wikipedia, Investopedia)
                                                </Typography>
                                            )}
                                        </List>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Step 4: Tone, Style & Persona */}
                {activeStep === 3 && (
                    <Box className="animate-fade-in">
                        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>4. Tone, Style & Persona</Typography>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField select fullWidth label="Act As (Persona)" value={formData.personalization.act_as} onChange={(e) => { setFormData({ ...formData, personalization: { ...formData.personalization, act_as: e.target.value as any } }); setFieldErrors(prev => ({ ...prev, act_as: false })); }} required error={fieldErrors.act_as} helperText={fieldErrors.act_as ? 'Persona is required' : ''}>
                                    <MenuItem value="The Rogue SEO Academic">The Rogue SEO Academic (Satirical)</MenuItem>
                                    <MenuItem value="The Wall Street Veteran">The Wall Street Veteran (Serious)</MenuItem>
                                    <MenuItem value="The Friendly Coder">The Friendly Coder (Tutorials)</MenuItem>
                                    <MenuItem value="Custom">Custom Persona</MenuItem>
                                </TextField>
                                {formData.personalization.act_as === 'Custom' && (
                                    <TextField fullWidth sx={{ mt: 2 }} label="Custom Persona Instructions" value={formData.personalization.custom_persona} onChange={(e) => { setFormData({ ...formData, personalization: { ...formData.personalization, custom_persona: e.target.value } }); setFieldErrors(prev => ({ ...prev, custom_persona: false })); }} required error={fieldErrors.custom_persona} helperText={fieldErrors.custom_persona ? 'Custom persona is required when selected' : ''} />
                                )}
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField select fullWidth label="Tone of Voice" value={formData.personalization.tone} onChange={(e) => { setFormData({ ...formData, personalization: { ...formData.personalization, tone: e.target.value } }); setFieldErrors(prev => ({ ...prev, tone: false })); }} required error={fieldErrors.tone} helperText={fieldErrors.tone ? 'Tone of voice is required' : ''}>
                                    <MenuItem value="Tongue-in-Cheek">Tongue-in-Cheek</MenuItem>
                                    <MenuItem value="Professional/Corporate">Professional/Corporate</MenuItem>
                                    <MenuItem value="Urgent/Hype">Urgent/Hype</MenuItem>
                                    <MenuItem value="Empathetic">Empathetic</MenuItem>
                                    <MenuItem value="Data-Driven">Data-Driven</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField select fullWidth label="Writing Style" value={formData.personalization.style} onChange={(e) => { setFormData({ ...formData, personalization: { ...formData.personalization, style: e.target.value } }); setFieldErrors(prev => ({ ...prev, style: false })); }} required error={fieldErrors.style} helperText={fieldErrors.style ? 'Writing style is required' : ''}>
                                    <MenuItem value="Mock-Formal Parody">Mock-Formal Parody</MenuItem>
                                    <MenuItem value="Storytelling">Storytelling</MenuItem>
                                    <MenuItem value="Direct & Concise">Direct & Concise</MenuItem>
                                    <MenuItem value="Academic">Academic</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField select fullWidth label="Point of View" value={formData.personalization.pov} onChange={(e) => { setFormData({ ...formData, personalization: { ...formData.personalization, pov: e.target.value } }); setFieldErrors(prev => ({ ...prev, pov: false })); }} required error={fieldErrors.pov} helperText={fieldErrors.pov ? 'Point of view is required' : ''}>
                                    <MenuItem value="First Person">First Person ("I", "We")</MenuItem>
                                    <MenuItem value="Second Person">Second Person ("You")</MenuItem>
                                    <MenuItem value="Third Person">Third Person ("Traders")</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl component="fieldset" error={fieldErrors.emoji_usage} required>
                                    <FormLabel component="legend">Emoji Usage *</FormLabel>
                                    <RadioGroup row value={formData.personalization.emoji_usage} onChange={(e) => { setFormData({ ...formData, personalization: { ...formData.personalization, emoji_usage: e.target.value } }); setFieldErrors(prev => ({ ...prev, emoji_usage: false })); }}>
                                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="No" control={<Radio />} label="No" />
                                        <FormControlLabel value="Minimal" control={<Radio />} label="Minimal" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography gutterBottom>Humanization Level: {formData.personalization.humanization_level}%</Typography>
                                <Slider value={formData.personalization.humanization_level} onChange={(_, val) => setFormData({ ...formData, personalization: { ...formData.personalization, humanization_level: val as number } })} valueLabelDisplay="auto" min={0} max={100} sx={{ mt: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" color="text.secondary">Perfect AI Polish</Typography>
                                    <Typography variant="caption" color="text.secondary">Raw Human (Includes Slang/Intention Typed Typos)</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Step 5: Structure & Formatting */}
                {activeStep === 4 && (
                    <Box className="animate-fade-in">
                        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>5. Structure & Formatting</Typography>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography gutterBottom>Target Word Count: {formData.structure.target_word_count[0]} - {formData.structure.target_word_count[1]}</Typography>
                                <Slider value={formData.structure.target_word_count} onChange={(_, val) => setFormData({ ...formData, structure: { ...formData.structure, target_word_count: val as number[] } })} valueLabelDisplay="auto" min={500} max={5000} step={500} sx={{ mt: 2 }} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl component="fieldset" fullWidth>
                                    <FormLabel component="legend">Header Structure</FormLabel>
                                    <FormGroup row>
                                        {['FAQ Section', 'Key Takeaways Box', 'Pros/Cons Table'].map((item) => (
                                            <FormControlLabel
                                                key={item}
                                                control={<Checkbox checked={formData.structure.header_structure.includes(item)} onChange={() => toggleHeaderStructure(item)} />}
                                                label={item}
                                            />
                                        ))}
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField fullWidth label="Call to Action (CTA)" value={formData.structure.cta} onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, cta: e.target.value } })} placeholder="e.g. Download our new MT5 EA at Flexy Markets" />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField fullWidth label="Negative Constraints (What NOT to say)" multiline rows={2} value={formData.personalization.negative_constraints} onChange={(e) => setFormData({ ...formData, personalization: { ...formData.personalization, negative_constraints: e.target.value } })} placeholder="e.g. Do not mention 'guaranteed profits'. Do not use word 'delve'." />
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Step 6: Content Preview */}
                {activeStep === 5 && (
                    <Box className="animate-fade-in">
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>6. Review Generated Content</Typography>
                        <Typography color="text.secondary" sx={{ mb: 4 }}>
                            Review the AI-generated content below. Edit any fields as needed before distribution.
                        </Typography>

                        {editableContent._generated ? (
                            <Paper className="glass-card" sx={{ p: 3, mb: 3 }}>
                                <Grid container spacing={3}>
                                    {/* H1 / Title Field */}
                                    <Grid size={12}>
                                        <TextField
                                            fullWidth
                                            label="H1 / Title"
                                            value={editableContent._generated.h1 || ''}
                                            onChange={(e) => handleEditContent('_generated', 'h1', e.target.value)}
                                        />
                                    </Grid>

                                    {/* Meta Title Field */}
                                    <Grid size={12}>
                                        <TextField
                                            fullWidth
                                            label="Meta Title"
                                            value={editableContent._generated.meta_title || ''}
                                            onChange={(e) => handleEditContent('_generated', 'meta_title', e.target.value)}
                                        />
                                    </Grid>

                                    {/* Meta Description */}
                                    <Grid size={12}>
                                        <TextField
                                            fullWidth
                                            label="Meta Description"
                                            multiline
                                            rows={2}
                                            value={editableContent._generated.meta_description || ''}
                                            onChange={(e) => handleEditContent('_generated', 'meta_description', e.target.value)}
                                        />
                                    </Grid>

                                    {/* Body Content - TinyMCE Editor */}
                                    <Grid size={12}>
                                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Body Content</Typography>
                                        <Box sx={{
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            '& .tox-tinymce': { border: 'none' }
                                        }}>
                                            <Editor
                                                apiKey={`${import.meta.env.VITE_TINYMCE_API_KEY}`}
                                                value={editableContent._generated.body_html || ''}
                                                onEditorChange={(content: string) => handleEditContent('_generated', 'body_html', content)}
                                                init={{
                                                    height: 400,
                                                    menubar: true,
                                                    skin: 'oxide-dark',
                                                    content_css: 'dark',
                                                    plugins: [
                                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                        'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                                    ],
                                                    toolbar: 'undo redo | blocks | ' +
                                                        'bold italic forecolor | alignleft aligncenter ' +
                                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                                        'removeformat | link image | code | help',
                                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background: #1a1a2e; color: #fff; }',
                                                    // Image upload settings
                                                    automatic_uploads: true,
                                                    paste_data_images: true,
                                                    file_picker_types: 'image',
                                                    // Handle blob uploads (paste / drag-drop)
                                                    images_upload_handler: async (blobInfo: any) => {
                                                        const backendUrl = import.meta.env.VITE_BACKEND_URL;
                                                        const uploadFormData = new FormData();
                                                        uploadFormData.append('file', blobInfo.blob(), blobInfo.filename());
                                                        uploadFormData.append('site_ids', JSON.stringify(
                                                            formData.target_site_ids.length > 0
                                                                ? formData.target_site_ids
                                                                : [availableSites[0]?.id].filter(Boolean)
                                                        ));

                                                        const res = await axios.post(
                                                            `${backendUrl}/upload-image-multi`,
                                                            uploadFormData,
                                                            { headers: { 'Content-Type': 'multipart/form-data' } }
                                                        );

                                                        if (res.data.success) {
                                                            if (res.data.site_urls) {
                                                                imageUrlMappings.current[res.data.primary_url] = res.data.site_urls;
                                                            }
                                                            return res.data.primary_url;
                                                        } else {
                                                            throw new Error('Image upload failed');
                                                        }
                                                    },
                                                    // "Browse" button in image dialog (toolbar click)
                                                    file_picker_callback: (cb: any, _value: any, meta: any) => {
                                                        if (meta.filetype === 'image') {
                                                            const input = document.createElement('input');
                                                            input.setAttribute('type', 'file');
                                                            input.setAttribute('accept', 'image/jpeg,image/png,image/gif,image/webp');
                                                            input.addEventListener('change', async () => {
                                                                const file = input.files?.[0];
                                                                if (!file) return;

                                                                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                                                                const uploadFormData = new FormData();
                                                                uploadFormData.append('file', file);
                                                                uploadFormData.append('site_ids', JSON.stringify(
                                                                    formData.target_site_ids.length > 0
                                                                        ? formData.target_site_ids
                                                                        : [availableSites[0]?.id].filter(Boolean)
                                                                ));

                                                                try {
                                                                    const res = await axios.post(
                                                                        `${backendUrl}/upload-image-multi`,
                                                                        uploadFormData,
                                                                        { headers: { 'Content-Type': 'multipart/form-data' } }
                                                                    );
                                                                    if (res.data.success) {
                                                                        if (res.data.site_urls) {
                                                                            imageUrlMappings.current[res.data.primary_url] = res.data.site_urls;
                                                                        }
                                                                        cb(res.data.primary_url, { alt: file.name });
                                                                    }
                                                                } catch (err) {
                                                                    console.error('Image upload failed:', err);
                                                                }
                                                            });
                                                            input.click();
                                                        }
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </Grid>

                                    {/* Other Generated Fields (FAQ, LSI) */}
                                    <Grid size={12}>
                                        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Additional Generated Data (Read-only)
                                        </Typography>
                                        <Box sx={{
                                            bgcolor: 'rgba(0,0,0,0.2)',
                                            borderRadius: 2,
                                            p: 2,
                                            maxHeight: 200,
                                            overflow: 'auto',
                                            fontFamily: 'monospace',
                                            fontSize: '0.75rem'
                                        }}>
                                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                {JSON.stringify({
                                                    faq_schema_json: editableContent._generated.faq_schema_json,
                                                    lsi_used: editableContent._generated.lsi_used
                                                }, null, 2)}
                                            </pre>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        ) : (
                            <Alert severity="info" variant="outlined">
                                No content generated yet. Please go back and try again.
                            </Alert>
                        )}

                        {/* Regenerate Button */}
                        {previewData.length > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="warning"
                                    startIcon={loading ? <CircularProgress size={18} /> : <RefreshIcon />}
                                    onClick={handleRegenerateContent}
                                    disabled={loading}
                                    sx={{ px: 4, py: 1.5 }}
                                >
                                    {loading ? 'Regenerating...' : 'Regenerate Content'}
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Step 7: Publish */}
                {activeStep === 6 && (
                    <Box className="animate-fade-in">
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>7. Publish Content</Typography>
                        <Typography color="text.secondary" sx={{ mb: 4 }}>
                            Review selected sites, choose post status, and publish to database.
                        </Typography>

                        {/* Selected Sites Summary */}
                        <Box sx={{ mb: 4, p: 3, bgcolor: 'rgba(139, 92, 246, 0.06)', borderRadius: 2, border: '1px solid rgba(139, 92, 246, 0.12)' }}>
                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                Publishing to {formData.target_site_ids.length} site{formData.target_site_ids.length > 1 ? 's' : ''}:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {formData.target_site_ids.map(siteId => {
                                    const site = availableSites.find(s => s.id === siteId);
                                    return site ? (
                                        <Chip key={siteId} label={site.name} color="primary" variant="outlined" size="small" />
                                    ) : null;
                                })}
                            </Box>
                        </Box>

                        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', maxWidth: 800 }}>
                            <TextField
                                select
                                sx={{ minWidth: 200, flex: 1 }}
                                label="Post Status"
                                value={formData.distribution.post_status}
                                onChange={(e) => setFormData({ ...formData, distribution: { ...formData.distribution, post_status: e.target.value } })}
                            >
                                <MenuItem value="Publish Immediately">Publish Immediately</MenuItem>
                                <MenuItem value="Save as Draft">Save as Draft</MenuItem>
                                <MenuItem value="Schedule">Schedule</MenuItem>
                            </TextField>

                            <TextField
                                select
                                sx={{ minWidth: 200, flex: 1 }}
                                label="Assign Category (Optional)"
                                value={formData.distribution.category || ''}
                                onChange={(e) => setFormData({ ...formData, distribution: { ...formData.distribution, category: e.target.value } })}
                                disabled={categoriesLoading}
                                helperText={categoriesLoading ? "Loading categories..." : ""}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {categories.map((cat: any) => (
                                    <MenuItem key={cat.categoryId || cat.id || cat.name} value={cat.name}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.05)' }} />

                        {/* Table Override Section for each selected site */}
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Target Tables</Typography>
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            {formData.target_site_ids.map(siteId => {
                                const site = availableSites.find(s => s.id === siteId);
                                if (!site) return null;
                                return (
                                    <Grid size={{ xs: 12, sm: 6 }} key={site.id}>
                                        <Paper className="glass-card" sx={{ p: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <CheckCircleIcon color="success" sx={{ mr: 1, fontSize: 20 }} />
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{site.name}</Typography>
                                            </Box>

                                            {/* Table Selection UI */}
                                            <Box sx={{ p: 2, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="caption" color="text.secondary">Target Table</Typography>
                                                    <Button
                                                        size="small"
                                                        onClick={(e) => { e.stopPropagation(); handleScanTables(site.id); }}
                                                        disabled={scanningSite === site.id}
                                                        startIcon={scanningSite === site.id ? <CircularProgress size={12} /> : <SearchIcon fontSize="small" />}
                                                        sx={{ fontSize: '0.7rem', py: 0 }}
                                                    >
                                                        {siteTableData[site.id] ? 'Re-scan' : 'Scan Tables'}
                                                    </Button>
                                                </Box>

                                                {siteTableData[site.id] ? (
                                                    <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                                                        <Select
                                                            value={tableOverrides[site.id] || site.target_table || ''}
                                                            onChange={(e) => setTableOverrides(prev => ({ ...prev, [site.id]: e.target.value }))}
                                                            displayEmpty
                                                            sx={{ fontSize: '0.85rem' }}
                                                        >
                                                            <MenuItem value="" disabled>Select Table</MenuItem>
                                                            {siteTableData[site.id].candidates.map(tbl => (
                                                                <MenuItem key={tbl} value={tbl}>
                                                                    {tbl} {tbl === siteTableData[site.id].best_match && <Chip label="Gemini Pick" size="small" color="primary" sx={{ height: 16, fontSize: '0.6rem', ml: 1 }} />}
                                                                </MenuItem>
                                                            ))}
                                                            {siteTableData[site.id].all_tables.length > siteTableData[site.id].candidates.length && (
                                                                <MenuItem disabled>──────────</MenuItem>
                                                            )}
                                                            {siteTableData[site.id].all_tables
                                                                .filter(tbl => !siteTableData[site.id]?.candidates.includes(tbl))
                                                                .map(tbl => (
                                                                    <MenuItem key={tbl} value={tbl} sx={{ color: 'text.secondary' }}>{tbl}</MenuItem>
                                                                ))}
                                                        </Select>
                                                    </FormControl>
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
                                                        Using default: {site.target_table || 'Blog'}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                            {formData.target_site_ids.length === 0 && (
                                <Alert severity="warning" variant="outlined" sx={{ width: '100%', mx: 2 }}>
                                    No sites selected. Go back to Step 1 to select target sites.
                                </Alert>
                            )}
                        </Grid>

                        {/* Publish Button */}
                        {formData.target_site_ids.length > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={handleInjectContent}
                                    disabled={loading}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                                    }}
                                >
                                    {loading ? <CircularProgress size={18} color="inherit" /> : 'Publish to Database'}
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Results Step */}
                {activeStep === 7 && (
                    <Box className="animate-fade-in">
                        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                            <CheckCircleIcon color="success" sx={{ mr: 2, fontSize: 32 }} /> Injection Complete
                        </Typography>
                        <Grid container spacing={2}>
                            {results.map((res: any, idx: number) => (
                                <Grid size={12} key={idx}>
                                    <Paper className="glass-card" sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                        <Box>
                                            <Typography variant="h6">{res.site_id}</Typography>
                                            <Typography variant="body2" color="text.secondary">DB Table: {res.table || 'N/A'}</Typography>
                                        </Box>
                                        <Chip
                                            label={res.status?.toUpperCase() || 'UNKNOWN'}
                                            color={res.status === 'success' ? 'success' : 'error'}
                                            variant="outlined"
                                            sx={{ fontWeight: 700 }}
                                        />
                                        {res.error && <Typography variant="caption" color="error" sx={{ width: '100%' }}>{res.error}</Typography>}
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        <Button variant="outlined" sx={{ mt: 4 }} onClick={() => setActiveStep(0)}>Create New Campaign</Button>
                    </Box>
                )}

                {error && <Alert severity="error" sx={{ mt: 4 }} variant="filled">{error}</Alert>}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: { xs: 4, md: 8 }, flexWrap: 'wrap', gap: 2 }}>
                    {activeStep > 0 && activeStep !== 7 ? (
                        <Button
                            disabled={loading}
                            onClick={handleBack}
                            variant="text"
                            sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', md: '1rem' } }}
                        >
                            Back
                        </Button>
                    ) : <Box />}

                    <Box>
                        {activeStep === 4 ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                disabled={loading}
                                size="large"
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                    px: { xs: 2, md: 3 },
                                    py: { xs: 1, md: 1.5 }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Preview'}
                            </Button>
                        ) : activeStep === 5 ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                disabled={loading || previewData.filter((p: any) => p.preview_content && !p.error).length === 0}
                                size="large"
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                    px: { xs: 2, md: 3 },
                                    py: { xs: 1, md: 1.5 }
                                }}
                            >
                                Continue to Publish
                            </Button>
                        ) : activeStep < 4 && (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={loading}
                                size="large"
                                sx={{
                                    fontSize: { xs: '0.875rem', md: '1rem' },
                                    px: { xs: 2, md: 3 }
                                }}
                            >
                                Continue
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>


            {/* Missing Fields Modal */}
            <Dialog open={validationModalOpen} onClose={() => setValidationModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="warning" /> Action Required: Missing Content
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        The target databases have required fields that the AI cannot generate automatically (e.g. IDs, Categories).
                        Please provide values for the following:
                    </DialogContentText>

                    {validationResults.map((siteRes: any) => (
                        <Box key={siteRes.site_id} sx={{ mb: 3, p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>{siteRes.site_id}</Typography>
                            {siteRes.message && <Alert severity="error">{siteRes.message}</Alert>}
                            <Grid container spacing={2}>
                                {siteRes.missing_fields.map((field: string) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={field}>
                                        <TextField
                                            fullWidth
                                            label={`Value for '${field}'`}
                                            placeholder="Enter value..."
                                            variant="filled"
                                            onChange={(e) => handleSupplementaryChange(siteRes.site_id, field, e.target.value)}
                                            required
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setValidationModalOpen(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleProceedWithSupplementary} variant="contained" color="warning" autoFocus>
                        Inject with Supplementary Data
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CampaignWizard;
