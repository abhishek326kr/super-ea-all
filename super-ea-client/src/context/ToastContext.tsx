import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertColor, Slide, SlideProps } from '@mui/material';

interface ToastContextType {
    showToast: (message: string, severity?: AlertColor, duration?: number) => void;
}

interface ToastState {
    open: boolean;
    message: string;
    severity: AlertColor;
    duration: number;
}

const ToastContext = createContext<ToastContextType | null>(null);

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="left" />;
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<ToastState>({
        open: false,
        message: '',
        severity: 'success',
        duration: 4000
    });

    const showToast = useCallback((message: string, severity: AlertColor = 'success', duration: number = 4000) => {
        setToast({
            open: true,
            message,
            severity,
            duration
        });
    }, []);

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setToast(prev => ({ ...prev, open: false }));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Snackbar
                open={toast.open}
                autoHideDuration={toast.duration}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                TransitionComponent={SlideTransition}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        minWidth: 'auto'
                    }
                }}
            >
                <Alert
                    onClose={handleClose}
                    severity={toast.severity}
                    variant="filled"
                    elevation={6}
                    sx={{
                        width: '100%',
                        fontWeight: 500,
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        '& .MuiAlert-icon': {
                            fontSize: 22
                        }
                    }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
