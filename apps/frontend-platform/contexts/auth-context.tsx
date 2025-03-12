'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type User = {
    id: string;
    name: string;
    email: string;
    role_user: string;
    roles: {
        business_unit: string[];
        cluster: Array<{
            cluster_id: string;
            description: string;
            granted_at: string;
            id: string;
            is_active: boolean;
            role_id: string;
            role_type: string;
        }>;
        general: string[];
        platform: Array<{
            description: string;
            granted_at: string;
            id: string;
            is_active: boolean;
            platform_id: string;
            role_id: string;
            role_type: string;
        }>;
    };
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
type AuthProviderProps = {
    children: ReactNode;
};

// Create the auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Check for existing auth on mount
    useEffect(() => {
        const initializeAuth = () => {
            try {
                // Try to get auth data from sessionStorage first, then localStorage
                const storedToken = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
                const storedRefreshToken = sessionStorage.getItem('refresh_token') || localStorage.getItem('refresh_token');
                const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');

                if (storedToken && storedRefreshToken && storedUser) {
                    setToken(storedToken);
                    setRefreshToken(storedRefreshToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (err) {
                console.error('Error initializing auth:', err);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = async (email: string, password: string, rememberMe: boolean) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://127.0.0.1:8080/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            // Store auth data in the appropriate storage
            const storageType = rememberMe ? localStorage : sessionStorage;
            storageType.setItem('auth_token', data.token);
            storageType.setItem('refresh_token', data.refresh_token);
            storageType.setItem('user', JSON.stringify(data.user));

            // Also set a cookie for the middleware to access
            document.cookie = `auth_token=${data.token}; path=/; max-age=${rememberMe ? 30 * 24 * 60 * 60 : 1 * 24 * 60 * 60}`;

            // Update state
            setToken(data.token);
            setRefreshToken(data.refresh_token);
            setUser(data.user);

            // Check for callback URL and redirect accordingly
            const callbackUrl = searchParams.get('callbackUrl');
            if (callbackUrl) {
                router.replace(decodeURI(callbackUrl));
            } else {
                router.replace('/dashboard');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials and try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        // Clear auth data from storage
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        // Clear auth cookie
        document.cookie = 'auth_token=; path=/; max-age=0';

        // Reset state
        setToken(null);
        setRefreshToken(null);
        setUser(null);

        // Redirect to login page
        router.push('/auth');
    };

    // Compute isAuthenticated
    const isAuthenticated = !!token && !!user;

    // Context value
    const value = {
        user,
        token,
        refreshToken,
        isAuthenticated,
        login,
        logout,
        loading,
        error,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 