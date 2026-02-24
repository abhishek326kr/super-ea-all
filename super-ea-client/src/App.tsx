import { useState } from 'react';
import { Routes, Route, Outlet, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container, AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme, CircularProgress, Divider } from '@mui/material';
import theme from './styles/theme';
import CampaignWizard from './components/CampaignWizard';
import SiteManager from './components/SiteManager';
import ConnectedSitesDashboard from './components/ConnectedSitesDashboard';
import SiteCMS from './components/SiteCMS';
import CategoryManager from './components/CategoryManager';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CategoryIcon from '@mui/icons-material/Category';
import SuperadminLogo from './components/SuperadminLogo';

const navItems = [
    { to: '/', label: 'Dashboard', icon: DashboardIcon },
    { to: '/sites-overview', label: 'Sites Overview', icon: VisibilityIcon },
    { to: '/sites', label: 'Site Manager', icon: StorageIcon },
    { to: '/categories', label: 'Categories', icon: CategoryIcon },
];

const NavButton = ({ to, label, icon: Icon }: any) => {
    const location = useLocation();
    const active = location.pathname === to;

    return (
        <Button
            component={Link}
            to={to}
            startIcon={<Icon sx={{ fontSize: '18px !important' }} />}
            sx={{
                mx: 0.5,
                px: 2,
                py: 0.8,
                color: active ? '#A78BFA' : '#94A3B8',
                bgcolor: active ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                borderRadius: 2,
                fontSize: '0.85rem',
                fontWeight: active ? 700 : 500,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::before': active ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)',
                    borderRadius: '2px',
                } : {},
                '&:hover': {
                    bgcolor: active ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                    color: active ? '#A78BFA' : '#E2E8F0',
                    transform: 'translateY(-1px)',
                }
            }}
        >
            {label}
        </Button>
    );
};

const MobileDrawer = ({ open, onClose, onLogout }: { open: boolean; onClose: () => void; onLogout: () => void }) => {
    const location = useLocation();

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 300,
                    bgcolor: 'rgba(10, 22, 40, 0.98)',
                    backdropFilter: 'blur(20px)',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
                }
            }}
        >
            <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <SuperadminLogo sx={{ fontSize: 32 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Menu</Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: '#94A3B8', '&:hover': { color: '#E2E8F0', bgcolor: 'rgba(255,255,255,0.04)' } }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <List sx={{ pt: 2, px: 1.5 }}>
                {navItems.map((item) => {
                    const active = location.pathname === item.to;
                    return (
                        <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={Link}
                                to={item.to}
                                onClick={onClose}
                                sx={{
                                    py: 1.5, px: 2, borderRadius: 2,
                                    bgcolor: active ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                                    borderLeft: active ? '3px solid #8B5CF6' : '3px solid transparent',
                                    transition: 'all 0.2s ease',
                                    '&:hover': { bgcolor: active ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)' }
                                }}
                            >
                                <ListItemIcon sx={{ color: active ? '#A78BFA' : '#94A3B8', minWidth: 40 }}>
                                    <item.icon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: active ? 700 : 500,
                                        fontSize: '0.9rem',
                                        color: active ? '#A78BFA' : '#E2E8F0'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Divider sx={{ mb: 2, borderColor: 'transparent' }} />
                <Button
                    fullWidth variant="outlined" color="error" startIcon={<LogoutIcon />}
                    onClick={() => { onLogout(); onClose(); }}
                    sx={{
                        borderRadius: 2, py: 1.2,
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        '&:hover': { borderColor: 'rgba(239, 68, 68, 0.5)', bgcolor: 'rgba(239, 68, 68, 0.08)' }
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Drawer>
    );
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                alignItems: 'center', height: '100vh', gap: 3, background: '#0F1D32',
            }}>
                <SuperadminLogo sx={{
                    fontSize: 48,
                    animation: 'float 2s ease-in-out infinite',
                    filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.3))',
                }} />
                <CircularProgress size={24} sx={{ color: '#8B5CF6' }} />
                <Typography variant="caption" sx={{ color: '#94A3B8', letterSpacing: 2, textTransform: 'uppercase' }}>
                    Loading...
                </Typography>
            </Box>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

function Layout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
    const { logout, isAuthenticated } = useAuth();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar
                position="sticky" elevation={0} className="glass"
                sx={{
                    '&::after': {
                        content: '""', position: 'absolute',
                        bottom: 0, left: 0, right: 0, height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.2), rgba(245,158,11,0.15), transparent)',
                    }
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1.5, sm: 2, md: 3 }, minHeight: { xs: 56, md: 64 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <SuperadminLogo sx={{
                                fontSize: { xs: 30, md: 34 },
                                mr: { xs: 1.5, md: 2 },
                                filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.25))',
                                transition: 'transform 0.3s ease, filter 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.08)',
                                    filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))',
                                },
                            }} />
                            <Typography variant="h6" sx={{
                                fontWeight: 800, letterSpacing: '-0.5px',
                                fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.2rem' },
                                background: 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 100%)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                            }}>
                                {isMobile ? 'Superadmin' : 'Superadmin Console'}
                            </Typography>
                        </Link>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
                        {navItems.map((item) => (
                            <NavButton key={item.to} to={item.to} label={item.label} icon={item.icon} />
                        ))}
                        {isAuthenticated && (
                            <IconButton onClick={logout} sx={{
                                ml: 1.5, color: '#94A3B8', transition: 'all 0.2s ease',
                                '&:hover': { color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.08)', transform: 'translateY(-1px)' }
                            }} title="Logout">
                                <LogoutIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        )}
                    </Box>

                    <IconButton
                        sx={{ display: { xs: 'flex', md: 'none' }, color: '#E2E8F0', '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' } }}
                        onClick={() => setMobileOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} onLogout={logout} />

            <Container maxWidth="lg" sx={{ mt: { xs: 3, md: 5 }, mb: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 4 }, flexGrow: 1 }}>
                <Outlet />
            </Container>

            <Box component="footer" sx={{
                py: { xs: 2.5, md: 3 }, textAlign: 'center', position: 'relative',
                '&::before': {
                    content: '""', position: 'absolute',
                    top: 0, left: '10%', right: '10%', height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                }
            }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500, letterSpacing: '0.05em', opacity: 0.7 }}>
                    Superadmin
                </Typography>
            </Box>
        </Box>
    );
}

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <ToastProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Layout />}>
                            <Route index element={<ProtectedRoute><div className="animate-fade-in"><CampaignWizard /></div></ProtectedRoute>} />
                            <Route path="sites-overview" element={<ProtectedRoute><div className="animate-fade-in"><ConnectedSitesDashboard /></div></ProtectedRoute>} />
                            <Route path="sites-overview/:siteId" element={<ProtectedRoute><div className="animate-fade-in"><SiteCMS /></div></ProtectedRoute>} />
                            <Route path="sites" element={<ProtectedRoute><div className="animate-fade-in"><SiteManager /></div></ProtectedRoute>} />
                            <Route path="categories" element={<ProtectedRoute><div className="animate-fade-in"><CategoryManager /></div></ProtectedRoute>} />
                        </Route>
                    </Routes>
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
