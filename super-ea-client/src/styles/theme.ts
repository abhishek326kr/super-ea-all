import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#8B5CF6',
            dark: '#7C3AED',
            light: '#A78BFA',
            contrastText: '#fff',
        },
        secondary: {
            main: '#F59E0B',
            dark: '#D97706',
            light: '#FCD34D',
        },
        success: { main: '#22C55E', dark: '#16A34A', light: '#4ADE80' },
        warning: { main: '#F59E0B', dark: '#D97706', light: '#FCD34D' },
        error: { main: '#EF4444', dark: '#DC2626', light: '#F87171' },
        info: { main: '#38BDF8', dark: '#0EA5E9', light: '#7DD3FC' },
        background: {
            default: '#0F1D32',   // Main canvas
            paper: '#12243E',     // Cards / elevated surfaces
        },
        text: {
            primary: '#E2E8F0',   // Slate-200
            secondary: '#94A3B8', // Slate-400
        },
        divider: 'rgba(148, 163, 184, 0.08)',
    },
    typography: {
        fontFamily: "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
        h1: { fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 },
        h2: { fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
        h3: { fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.01em' },
        h4: { fontSize: '1.5rem', fontWeight: 700 },
        h5: { fontSize: '1.25rem', fontWeight: 600 },
        h6: { fontSize: '1rem', fontWeight: 600 },
        subtitle1: { fontSize: '1.1rem', fontWeight: 400, lineHeight: 1.5 },
        subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
        body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
        body2: { fontSize: '0.8125rem', lineHeight: 1.5 },
        button: { textTransform: 'none' as const, fontWeight: 600, letterSpacing: '0.01em' },
    },
    shape: { borderRadius: 12 },
    shadows: [
        'none',
        '0 1px 3px rgba(0,0,0,0.4)',
        '0 4px 6px -1px rgba(0,0,0,0.4)',
        '0 10px 15px -3px rgba(0,0,0,0.4)',
        '0 20px 25px -5px rgba(0,0,0,0.4), 0 8px 10px -6px rgba(0,0,0,0.3)',
        '0 0 20px rgba(139, 92, 246, 0.06), 0 10px 30px -5px rgba(0,0,0,0.4)',
        '0 0 30px rgba(139, 92, 246, 0.1), 0 20px 40px -10px rgba(0,0,0,0.4)',
        ...Array(18).fill('0 25px 50px -12px rgba(0, 0, 0, 0.5)'),
    ] as any,
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: '#1E3A5F #0F1D32',
                    '&::-webkit-scrollbar': { width: 6 },
                    '&::-webkit-scrollbar-track': { background: '#0F1D32' },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#1E3A5F',
                        borderRadius: 3,
                        '&:hover': { background: '#2A4A6F' },
                    },
                },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontWeight: 600,
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { transform: 'translateY(-1px)' },
                    '&:active': { transform: 'translateY(0)' },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                        boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
                    },
                },
                containedSecondary: {
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: '#000',
                    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
                        boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)',
                    },
                },
                outlined: {
                    borderColor: 'rgba(148, 163, 184, 0.15)',
                    '&:hover': {
                        borderColor: '#8B5CF6',
                        backgroundColor: 'rgba(139, 92, 246, 0.06)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid rgba(148, 163, 184, 0.08)',
                    transition: 'all 0.25s ease',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: 'rgba(10, 22, 40, 0.92)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                InputLabelProps: { shrink: true },
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        transition: 'all 0.25s ease',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.12)', transition: 'all 0.25s ease' },
                        '&:hover fieldset': { borderColor: 'rgba(148, 163, 184, 0.25)' },
                        '&.Mui-focused fieldset': {
                            borderColor: '#8B5CF6',
                            boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
                        },
                    },
                    /* Override browser autofill background globally */
                    '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus': {
                        WebkitBoxShadow: '0 0 0 100px #12243E inset',
                        WebkitTextFillColor: '#E2E8F0',
                        caretColor: '#E2E8F0',
                        transition: 'background-color 5000s ease-in-out 0s',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            defaultProps: {
                notched: true,
            },
            styleOverrides: {
                notchedOutline: {
                    '& legend': {
                        maxWidth: '100%',
                        '& span': { padding: '0 6px' },
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#94A3B8',
                    '&.Mui-focused': { color: '#A78BFA' },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 500, borderRadius: 8 },
                outlined: { borderColor: 'rgba(148, 163, 184, 0.15)' },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundImage: 'none',
                    background: 'rgba(18, 36, 62, 0.97)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(148, 163, 184, 0.12)',
                    borderRadius: 16,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: 'rgba(18, 36, 62, 0.97)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(148, 163, 184, 0.12)',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    padding: '6px 12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                },
                arrow: { color: 'rgba(18, 36, 62, 0.97)' },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: { borderRadius: 10 },
                standardSuccess: { backgroundColor: 'rgba(34, 197, 94, 0.08)', color: '#4ADE80' },
                standardError: { backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#F87171' },
                standardWarning: { backgroundColor: 'rgba(245, 158, 11, 0.08)', color: '#FCD34D' },
                standardInfo: { backgroundColor: 'rgba(56, 189, 248, 0.08)', color: '#7DD3FC' },
            },
        },
        MuiSkeleton: {
            styleOverrides: {
                root: { backgroundColor: 'rgba(148, 163, 184, 0.06)' },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: '#8B5CF6',
                    height: 2,
                    borderRadius: 1,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none' as const,
                    fontWeight: 500,
                    '&.Mui-selected': { color: '#E2E8F0', fontWeight: 600 },
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    '&:before': { display: 'none' },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundImage: 'none',
                    backgroundColor: '#0A1628',
                    borderRight: '1px solid rgba(148, 163, 184, 0.08)',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    '&:hover': { backgroundColor: 'rgba(139, 92, 246, 0.06)' },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        '&:hover': { backgroundColor: 'rgba(139, 92, 246, 0.14)' },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(148, 163, 184, 0.12)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(148, 163, 184, 0.25)',
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: { borderColor: 'rgba(148, 163, 184, 0.08)' },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    '&.Mui-checked': {
                        color: '#8B5CF6',
                        '& + .MuiSwitch-track': {
                            backgroundColor: '#8B5CF6',
                            opacity: 0.5,
                        },
                    },
                },
                track: { backgroundColor: 'rgba(148, 163, 184, 0.2)' },
            },
        },
    },
});

export default theme;
