import React, { useState } from 'react';
import {
    Box, Typography, TextField, Button, CircularProgress, Alert,
    InputAdornment, IconButton, useMediaQuery, useTheme
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ShieldIcon from '@mui/icons-material/Shield';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SuperadminLogo from './SuperadminLogo';

/* ── keyframes injected once ────────────────────────────────────── */
const keyframes = `
@keyframes meshShift {
    0%, 100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
}
@keyframes orbitSlow {
    0%   { transform: rotate(0deg) translateX(120px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
}
@keyframes orbitFast {
    0%   { transform: rotate(0deg) translateX(80px) rotate(0deg); }
    100% { transform: rotate(-360deg) translateX(80px) rotate(360deg); }
}
@keyframes pulseGlow {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50%      { opacity: 0.8; transform: scale(1.1); }
}
@keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes borderGlow {
    0%, 100% { opacity: 0.3; }
    50%      { opacity: 0.7; }
}
`;

/* ── feature chips for the branding panel ────────────────────────── */
const features = [
    { icon: <ShieldIcon sx={{ fontSize: 18 }} />, label: 'Enterprise-Grade Security' },
    { icon: <SpeedIcon sx={{ fontSize: 18 }} />, label: 'Real-Time Analytics' },
    { icon: <CloudQueueIcon sx={{ fontSize: 18 }} />, label: 'Multi-Node CMS' },
    { icon: <AutoAwesomeIcon sx={{ fontSize: 18 }} />, label: 'AI-Powered Tools' },
];

const Login = () => {
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusField, setFocusField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.post(`${backendUrl}/auth/login`, { username, password });
            login(res.data.access_token, res.data.expires_in);
            showToast('Welcome back! Login successful.', 'success');
            navigate('/');
        } catch (err: any) {
            console.error('Login error', err);
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    /* ── Shared input sx for both fields ──────────────────────────── */
    const inputSx = (field: string) => ({
        mb: 2.5,
        '& .MuiOutlinedInput-root': {
            borderRadius: '14px',
            bgcolor: 'rgba(15, 29, 50, 0.5)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
            '& fieldset': {
                borderColor: focusField === field ? '#8B5CF6' : 'rgba(148, 163, 184, 0.15)',
                borderWidth: focusField === field ? 2 : 1,
            },
            '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.4)' },
            '&.Mui-focused fieldset': {
                borderColor: '#8B5CF6',
                boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.08)',
            },
        },
        /* Override browser autofill background (Chrome/Edge blue tint) */
        '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus': {
            WebkitBoxShadow: '0 0 0 100px rgba(15, 29, 50, 0.95) inset',
            WebkitTextFillColor: '#E2E8F0',
            caretColor: '#E2E8F0',
            transition: 'background-color 5000s ease-in-out 0s',
        },
    });

    return (
        <>
            {/* Inject keyframes */}
            <style>{keyframes}</style>

            <Box sx={{
                height: '100vh', width: '100vw',
                display: 'flex',
                position: 'absolute', top: 0, left: 0, zIndex: 9999,
                overflow: 'hidden', background: '#0A1628',
            }}>

                {/* ═══════════════════════════════════════════════════
                    LEFT PANEL — Branding & Visual Showcase
                   ═══════════════════════════════════════════════════ */}
                {!isMobile && (
                    <Box sx={{
                        flex: '0 0 50%', position: 'relative', overflow: 'hidden',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center',
                        /* Animated mesh gradient background */
                        background: `
                            radial-gradient(ellipse at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                            radial-gradient(ellipse at 80% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
                            radial-gradient(ellipse at 60% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                            linear-gradient(135deg, #0A1628 0%, #0F1D32 50%, #0A1628 100%)
                        `,
                        backgroundSize: '200% 200%',
                        animation: 'meshShift 12s ease infinite',
                    }}>
                        {/* Grid pattern overlay */}
                        <Box sx={{
                            position: 'absolute', inset: 0, opacity: 0.03,
                            backgroundImage: `
                                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }} />

                        {/* Orbiting particles */}
                        <Box sx={{
                            position: 'absolute', top: '50%', left: '50%',
                            width: 10, height: 10, borderRadius: '50%',
                            background: '#8B5CF6', boxShadow: '0 0 20px #8B5CF6',
                            animation: 'orbitSlow 16s linear infinite',
                        }} />
                        <Box sx={{
                            position: 'absolute', top: '50%', left: '50%',
                            width: 6, height: 6, borderRadius: '50%',
                            background: '#F59E0B', boxShadow: '0 0 14px #F59E0B',
                            animation: 'orbitFast 10s linear infinite',
                        }} />

                        {/* Large glowing orbs */}
                        <Box sx={{
                            position: 'absolute', width: 300, height: 300, borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
                            top: '15%', left: '10%',
                            animation: 'pulseGlow 6s ease-in-out infinite',
                        }} />
                        <Box sx={{
                            position: 'absolute', width: 200, height: 200, borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
                            bottom: '20%', right: '15%',
                            animation: 'pulseGlow 8s ease-in-out infinite 2s',
                        }} />

                        {/* Branding content */}
                        <Box sx={{
                            position: 'relative', zIndex: 1, textAlign: 'center',
                            px: 6, animation: 'slideUp 0.8s ease-out',
                        }}>
                            <SuperadminLogo sx={{
                                fontSize: 72, mb: 3,
                                filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.4))',
                            }} />

                            <Typography variant="h3" sx={{
                                fontWeight: 800, letterSpacing: '-0.03em',
                                background: 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 100%)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                mb: 1.5, lineHeight: 1.2,
                            }}>
                                Superadmin
                            </Typography>
                            <Typography variant="h6" sx={{
                                fontWeight: 300, color: '#94A3B8', mb: 5,
                                letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.8rem',
                            }}>
                                Super EAdmin Console
                            </Typography>

                            {/* Feature chips */}
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5,
                            }}>
                                {features.map((f, i) => (
                                    <Box key={i} sx={{
                                        display: 'flex', alignItems: 'center', gap: 1,
                                        px: 2, py: 1.2,
                                        borderRadius: '12px',
                                        border: '1px solid rgba(148,163,184,0.08)',
                                        bgcolor: 'rgba(15,29,50,0.4)',
                                        backdropFilter: 'blur(6px)',
                                        animation: `slideUp 0.6s ease-out ${0.2 + i * 0.1}s both`,
                                    }}>
                                        <Box sx={{ color: '#A78BFA' }}>{f.icon}</Box>
                                        <Typography variant="caption" sx={{
                                            color: '#94A3B8', fontWeight: 500, fontSize: '0.72rem',
                                        }}>
                                            {f.label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* Bottom status bar */}
                        <Box sx={{
                            position: 'absolute', bottom: 32, left: 0, right: 0,
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1,
                            animation: 'slideUp 1s ease-out 0.6s both',
                        }}>
                            <Box sx={{
                                width: 6, height: 6, borderRadius: '50%',
                                bgcolor: '#22C55E',
                                boxShadow: '0 0 8px rgba(34,197,94,0.5)',
                                animation: 'pulseGlow 2s ease-in-out infinite',
                            }} />
                            <Typography variant="caption" sx={{
                                color: '#64748B', fontSize: '0.7rem', letterSpacing: '0.05em',
                            }}>
                                All systems operational
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* ═══════════════════════════════════════════════════
                    RIGHT PANEL — Login Form
                   ═══════════════════════════════════════════════════ */}
                <Box sx={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                    background: isMobile
                        ? `radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%), #0F1D32`
                        : '#0F1D32',
                }}>
                    {/* Subtle top-left glow */}
                    <Box sx={{
                        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
                        top: '-10%', right: '-10%', pointerEvents: 'none',
                    }} />

                    <Box sx={{
                        width: '100%', maxWidth: 420, px: { xs: 3, sm: 5 },
                        animation: 'slideUp 0.6s ease-out',
                    }}>
                        {/* Mobile-only logo */}
                        {isMobile && (
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <SuperadminLogo sx={{
                                    fontSize: 56, mb: 1.5,
                                    filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))',
                                }} />
                                <Typography variant="h5" sx={{
                                    fontWeight: 800, color: '#E2E8F0', letterSpacing: '-0.02em',
                                }}>
                                    Superadmin
                                </Typography>
                            </Box>
                        )}

                        {/* Welcome heading */}
                        <Typography variant="h4" sx={{
                            fontWeight: 800, color: '#E2E8F0', mb: 0.5,
                            letterSpacing: '-0.02em', lineHeight: 1.2,
                        }}>
                            Welcome back
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: '#64748B', mb: 4, fontWeight: 400,
                        }}>
                            Sign in to access your super admin console
                        </Typography>

                        {/* Error alert */}
                        {error && (
                            <Alert severity="error" sx={{
                                mb: 3, borderRadius: '14px',
                                bgcolor: 'rgba(239, 68, 68, 0.06)',
                                border: '1px solid rgba(239, 68, 68, 0.15)',
                                '& .MuiAlert-icon': { color: '#F87171' },
                            }}>
                                {error}
                            </Alert>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <Typography variant="caption" sx={{
                                color: '#64748B', fontWeight: 600, letterSpacing: '0.06em',
                                textTransform: 'uppercase', fontSize: '0.68rem', mb: 0.8, display: 'block',
                            }}>
                                Username
                            </Typography>
                            <TextField
                                fullWidth placeholder="Enter your username" variant="outlined"
                                sx={inputSx('username')}
                                value={username} onChange={(e) => setUsername(e.target.value)} required
                                onFocus={() => setFocusField('username')} onBlur={() => setFocusField(null)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlineIcon sx={{
                                                color: focusField === 'username' ? '#A78BFA' : '#475569',
                                                fontSize: 20, transition: 'color 0.3s',
                                            }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Typography variant="caption" sx={{
                                color: '#64748B', fontWeight: 600, letterSpacing: '0.06em',
                                textTransform: 'uppercase', fontSize: '0.68rem', mb: 0.8, display: 'block',
                            }}>
                                Password
                            </Typography>
                            <TextField
                                fullWidth placeholder="Enter your password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined" sx={inputSx('password')}
                                value={password} onChange={(e) => setPassword(e.target.value)} required
                                onFocus={() => setFocusField('password')} onBlur={() => setFocusField(null)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon sx={{
                                                color: focusField === 'password' ? '#A78BFA' : '#475569',
                                                fontSize: 20, transition: 'color 0.3s',
                                            }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end" size="small"
                                                sx={{ color: '#475569', '&:hover': { color: '#94A3B8' } }}
                                            >
                                                {showPassword
                                                    ? <VisibilityOffIcon sx={{ fontSize: 20 }} />
                                                    : <VisibilityIcon sx={{ fontSize: 20 }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                fullWidth variant="contained" size="large" type="submit" disabled={loading}
                                sx={{
                                    mt: 1, py: 1.6, fontWeight: 700, fontSize: '0.95rem',
                                    borderRadius: '14px',
                                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                                    boxShadow: '0 4px 24px rgba(139, 92, 246, 0.3)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    textTransform: 'none',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                                        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.45)',
                                        transform: 'translateY(-2px)',
                                    },
                                    '&:active': { transform: 'translateY(0)' },
                                    '&.Mui-disabled': {
                                        background: 'rgba(139, 92, 246, 0.2)',
                                        color: 'rgba(255,255,255,0.4)',
                                    },
                                }}
                            >
                                {loading
                                    ? <CircularProgress size={24} sx={{ color: '#fff' }} />
                                    : 'Sign In'}
                            </Button>
                        </form>

                        {/* Bottom security badge */}
                        <Box sx={{
                            mt: 5, display: 'flex', justifyContent: 'center',
                            alignItems: 'center', gap: 1,
                        }}>
                            <ShieldIcon sx={{ fontSize: 14, color: '#334155' }} />
                            <Typography variant="caption" sx={{
                                color: '#334155', letterSpacing: '0.12em',
                                textTransform: 'uppercase', fontSize: '0.62rem', fontWeight: 500,
                            }}>
                                Secured with 256-bit encryption
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default Login;
