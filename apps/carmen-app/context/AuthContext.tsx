'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUserProfileService, updateUserBusinessUnitService } from '@/services/auth.service';

interface UserInfo {
    firstname: string;
    middlename?: string;
    lastname: string;
}

interface BusinessUnit {
    id: string;
    name: string;
    is_default?: boolean;
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
    handleChangeTenant: (tenantId: string) => void;
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
    handleChangeTenant: () => { },
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
    const [tenantId, setTenantId] = useState<string>(() => {
        // Initialize from sessionStorage if available to prevent 400 errors on refresh
        return typeof window !== 'undefined' ? (sessionStorage.getItem('tenant_id') ?? '') : '';
    });
    const router = useRouter();
    const pathname = usePathname();
    const token = typeof window !== 'undefined' ? (sessionStorage.getItem('access_token') ?? '') : '';

    // Initialize tenantId when user changes
    useEffect(() => {
        if (user?.business_unit?.length) {
            const defaultBu = user.business_unit.find((bu: BusinessUnit) => bu.is_default === true);
            const firstBu = user.business_unit[0];
            const newTenantId = defaultBu?.id ?? firstBu?.id ?? '';
            setTenantId(newTenantId);

            // Store tenantId in sessionStorage to preserve across refreshes
            if (typeof window !== 'undefined' && newTenantId) {
                sessionStorage.setItem('tenant_id', newTenantId);
            }
        }
    }, [user]);

    // Check for existing user data on load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Extract locale from pathname dynamically
                const locale = pathname?.split('/')[1];
                const signInPage = `/${locale}/sign-in`;

                const isSignInPage = pathname === signInPage;

                if (isSignInPage) {
                    if (typeof window !== 'undefined') {
                        sessionStorage.removeItem('access_token');
                        sessionStorage.removeItem('refresh_token');
                        sessionStorage.removeItem('tenant_id');
                        localStorage.removeItem('user');
                    }
                    setUser(null);
                    setTenantId('');
                    setIsLoading(false);
                    return;
                }

                // Load user from localStorage if available
                if (typeof window !== 'undefined') {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        const parsedUser = JSON.parse(storedUser);
                        setUser(parsedUser);
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

            const data = await getUserProfileService(accessToken);

            // Store user data in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(data));
            }
            setUser(data);

            // Set initial tenant ID when user logs in
            if (data?.business_unit?.length) {
                const defaultBu = data.business_unit.find((bu: BusinessUnit) => bu.is_default === true);
                const firstBu = data.business_unit[0];
                const newTenantId = defaultBu?.id ?? firstBu?.id ?? '';

                if (newTenantId && typeof window !== 'undefined') {
                    sessionStorage.setItem('tenant_id', newTenantId);
                    setTenantId(newTenantId);
                }
            }
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
            sessionStorage.removeItem('tenant_id');
            // Also clear user data from localStorage
            localStorage.removeItem('user');
        }
        setUser(null);
        setTenantId('');
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

    // Function to handle tenant change
    const handleChangeTenant = useCallback(async (id: string) => {
        if (!id) return;
        console.log('tenantId >>>', id);
        const data = await updateUserBusinessUnitService(token, id);
        if (data) {
            setTenantId(id);
            // Store the updated tenant ID in sessionStorage
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('tenant_id', id);
            }
        }
    }, [token]);

    // Context value
    const value = useMemo(() => ({
        isAuthenticated: hasToken,
        isLoading,
        user,
        setSession,
        logout,
        token,
        getServerSideToken,
        tenantId,
        handleChangeTenant,
    }), [hasToken, isLoading, user, setSession, logout, token, getServerSideToken, tenantId, handleChangeTenant]);

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
