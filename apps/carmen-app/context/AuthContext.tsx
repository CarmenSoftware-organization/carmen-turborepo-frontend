'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';


interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    setSession: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

// Create context with a default value
export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    setSession: () => { },
    logout: () => { },
});

// Provider component
export function AuthProvider({ children }: { readonly children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
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
                    sessionStorage.removeItem('access_token');
                    sessionStorage.removeItem('refresh_token');

                    setIsLoading(false);
                    return;
                }

            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname]);

    const setSession = useCallback((accessToken: string, refreshToken: string) => {
        if (accessToken) {
            sessionStorage.setItem('access_token', accessToken);
        }

        if (refreshToken) {
            sessionStorage.setItem('refresh_token', refreshToken);
        }
    }, []);

    const logout = useCallback(() => {
        const locale = pathname?.split('/')[1] || 'en';

        // Clear tokens
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');

        // Redirect to sign-in with the current locale
        router.push(`/${locale}/sign-in`);
    }, [router, pathname]);

    // Check if user is authenticated by looking for tokens
    const hasToken = typeof window !== 'undefined' && !!sessionStorage.getItem('access_token');

    // Context value
    const value = useMemo(() => ({
        isAuthenticated: hasToken,
        isLoading,
        setSession,
        logout
    }), [hasToken, isLoading, setSession, logout]);

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
