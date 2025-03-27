'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { backendApi } from '@/lib/backend-api';

interface UserInfo {
    firstname: string;
    middlename?: string;
    lastname: string;
}

interface BusinessUnit {
    id: string;
    name: string;
}

interface User {
    id: string;
    email: string;
    user_info: UserInfo;
    business_unit: BusinessUnit[];
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    setSession: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
    token: string;
    getServerSideToken: () => string;
    tenantId: string;
}

// Create context with a default value
export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    setSession: () => { },
    logout: () => { },
    token: '',
    getServerSideToken: () => '',
    tenantId: '',
});

// Helper function to get token on the client side
export function getServerSideToken(): string {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem('access_token') ?? '';
    }
    return '';
}

// Provider component
export function AuthProvider({ children }: { readonly children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Check for existing user data on load
    useEffect(() => {
        const checkAuth = () => {
            try {
                // Extract locale from pathname dynamically
                const locale = pathname?.split('/')[1];
                const signInPage = `/${locale}/sign-in`;

                const isSignInPage = pathname === signInPage;

                if (isSignInPage) {
                    if (typeof window !== 'undefined') {
                        sessionStorage.removeItem('access_token');
                        sessionStorage.removeItem('refresh_token');
                        localStorage.removeItem('user');
                    }
                    setUser(null);
                    setIsLoading(false);
                    return;
                }

                // Load user from localStorage if available
                if (typeof window !== 'undefined') {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                }

            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname]);

    const setSession = useCallback(async (accessToken: string, refreshToken: string) => {
        if (accessToken) {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('access_token', accessToken);
            }

            const url = `${backendApi}/api/auth/profile`
            const options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
            const response = await fetch(url, options);
            const data = await response.json();

            // Store user data in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(data));
            }
            setUser(data);
        }

        if (refreshToken && typeof window !== 'undefined') {
            sessionStorage.setItem('refresh_token', refreshToken);
        }
    }, []);

    const logout = useCallback(() => {
        const locale = pathname?.split('/')[1] || 'en';

        // Clear tokens
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            // Also clear user data from localStorage
            localStorage.removeItem('user');
        }
        setUser(null);
        // Redirect to sign-in with the current locale
        router.push(`/${locale}/sign-in`);
    }, [router, pathname]);

    // Get token for server actions
    const getServerSideToken = useCallback(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('access_token') ?? '';
        }
        return '';
    }, []);

    // Check if user is authenticated by looking for tokens
    const hasToken = typeof window !== 'undefined' && !!sessionStorage.getItem('access_token');

    const tenantId = user?.business_unit[0].id ?? '';
    // Context value
    const value = useMemo(() => ({
        isAuthenticated: hasToken,
        isLoading,
        user,
        setSession,
        logout,
        token: typeof window !== 'undefined' ? (sessionStorage.getItem('access_token') ?? '') : '',
        getServerSideToken,
        tenantId,
    }), [hasToken, isLoading, user, setSession, logout, getServerSideToken, tenantId]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook to use the auth context
export function useAuth() {
    return useContext(AuthContext);
}
