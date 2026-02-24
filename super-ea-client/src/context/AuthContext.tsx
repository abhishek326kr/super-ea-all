import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string, expires_in: number) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token in localStorage on mount
        const storedToken = localStorage.getItem('token');
        const tokenExpiry = localStorage.getItem('token_expiry');

        if (storedToken && tokenExpiry) {
            const now = new Date().getTime();
            if (now < parseInt(tokenExpiry)) {
                setToken(storedToken);
                setIsAuthenticated(true);
            } else {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (newToken: string, expiresInSeconds: number) => {
        const expiryTime = new Date().getTime() + (expiresInSeconds * 1000);
        localStorage.setItem('token', newToken);
        localStorage.setItem('token_expiry', expiryTime.toString());
        setToken(newToken);
        setIsAuthenticated(true);

        // Setup axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiry');
        setToken(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
        // Redirect to login handled by protected route or component
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
