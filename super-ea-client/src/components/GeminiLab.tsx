import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Divider, Chip, Stack } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CodeIcon from '@mui/icons-material/Code';
import TerminalIcon from '@mui/icons-material/Terminal';
import { useToast } from '../context/ToastContext';

const GeminiLab = () => {
    const { showToast } = useToast();
    const [prompt, setPrompt] = useState('Suggest a high-intent technical persona for MQ5 indicator development.');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const testPrompt = async () => {
        setLoading(true);
        setTimeout(() => {
            setResponse("Gemini Insight: The 'MQL5 High-Performance Architect' persona should focus on low-latency execution and memory-safe design patterns. Key traits include mastery of event handlers (OnTick, OnDeinit) and deep understanding of multithreaded backtesting environments.");
            setLoading(false);
            showToast('Insight generated successfully!', 'success');
        }, 1200);
    };

    return (
        <Box>
            <Box sx={{ mb: { xs: 3, md: 6 }, px: { xs: 1, md: 0 } }}>
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
                    The Gemini Lab
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Chip icon={<TerminalIcon />} label="System Prompt Control" variant="outlined" size="small" sx={{ fontSize: { xs: '0.7rem', md: '0.8125rem' } }} />
                    <Chip icon={<CodeIcon />} label="JSON Enforcement" variant="outlined" size="small" sx={{ fontSize: { xs: '0.7rem', md: '0.8125rem' } }} />
                </Stack>
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                >
                    Experimental ground for refining AI personas and testing site-specific schema adaptation logic.
                </Typography>
            </Box>

            <Paper className="glass" sx={{ p: { xs: 2, md: 4 }, borderRadius: { xs: 2, md: 4 } }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>Sandbox Prompt</Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={5}
                    disabled={loading}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your instruction here..."
                    variant="filled"
                    sx={{
                        mb: 3,
                        '& .MuiFilledInput-root': {
                            bgcolor: 'rgba(0,0,0,0.2)',
                            borderRadius: 2
                        }
                    }}
                />
                <Button
                    variant="contained"
                    onClick={testPrompt}
                    disabled={loading}
                    size="large"
                    startIcon={<AutoFixHighIcon />}
                >
                    {loading ? 'Synthesizing Insight...' : 'Run Generation'}
                </Button>

                {response && (
                    <Box className="animate-fade-in">
                        <Divider sx={{ my: 4 }} />
                        <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Refined Intelligence Output
                        </Typography>
                        <Paper
                            variant="outlined"
                            sx={{
                                mt: 2,
                                p: 3,
                                bgcolor: 'rgba(139, 92, 246, 0.04)',
                                borderColor: 'rgba(139, 92, 246, 0.15)',
                                borderStyle: 'dashed',
                                borderRadius: 3
                            }}
                        >
                            <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.primary' }}>
                                {response}
                            </Typography>
                        </Paper>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default GeminiLab;
