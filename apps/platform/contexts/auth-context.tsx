'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    FC,
    useMemo,
    useCallback
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm, UseFormRegister, UseFormHandleSubmit, UseFormReset, UseFormTrigger, FormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define Zod schemas for validation
export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().default(false)
});

export type LoginFormData = z.infer<typeof loginSchema>;

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
    loginContext: (data: LoginFormData) => Promise<void>;
    logoutContext: () => void;
    loading: boolean;
    error: string | null;
    getLoginForm: () => {
        register: UseFormRegister<LoginFormData>;
        handleSubmit: UseFormHandleSubmit<LoginFormData>;
        formState: FormState<LoginFormData>;
        reset: UseFormReset<LoginFormData>;
        trigger: UseFormTrigger<LoginFormData>;
    };
};

// Create a context with a null initial value
const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
    children: ReactNode;
};

// Create the auth provider component
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize react-hook-form with zod validation
    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    // Check for existing auth on mount
    useEffect(() => {
        const initializeAuth = () => {
            if (typeof window === 'undefined') return;
            try {
                const storedToken = sessionStorage.getItem('auth_token') ?? localStorage.getItem('auth_token');
                const storedRefreshToken = sessionStorage.getItem('refresh_token') ?? localStorage.getItem('refresh_token');
                const storedUser = sessionStorage.getItem('user') ?? localStorage.getItem('user');

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


    const loginContext = useCallback(async (data: LoginFormData) => {
        setLoading(true);
        setError(null);

        console.log('data', data);

        try {
            const response = await fetch(`http://127.0.0.1:8080/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Login failed');
            }

            const responseData = await response.json();

            // Store auth data in the appropriate storage
            const storageType = data.rememberMe ? localStorage : sessionStorage;
            storageType.setItem('auth_token', responseData.token);
            storageType.setItem('refresh_token', responseData.refresh_token);
            storageType.setItem('user', JSON.stringify(responseData.user));

            // Also set a cookie for the middleware to access
            document.cookie = `auth_token=${responseData.token}; path=/; max-age=${data.rememberMe ? 30 * 24 * 60 * 60 : 1 * 24 * 60 * 60}`;

            // Update state
            setToken(responseData.token);
            setRefreshToken(responseData.refresh_token);
            setUser(responseData.user);

            // Reset form after successful login
            loginForm.reset();

            // Check for callback URL and redirect accordingly
            const callbackUrl = searchParams.get('callbackUrl');
            if (callbackUrl) {
                router.replace(decodeURI(callbackUrl));
            } else {
                router.replace('/dashboard');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your credentials and try again.';
            setError(errorMessage);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    }, [loginForm, router, searchParams, setError, setLoading, setRefreshToken, setToken, setUser]);

    // Logout function
    const logoutContext = useCallback(() => {
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

        // Reset form
        loginForm.reset();

        // Redirect to login page
        router.push('/auth');
    }, [loginForm, router, setToken, setRefreshToken, setUser]);

    // Function to provide access to the form methods
    const getLoginForm = useCallback(() => {
        return {
            register: loginForm.register,
            handleSubmit: loginForm.handleSubmit,
            formState: loginForm.formState,
            reset: loginForm.reset,
            trigger: loginForm.trigger
        };
    }, [loginForm]);

    // Compute isAuthenticated
    const isAuthenticated = !!token && !!user;

    // Context value
    const value = useMemo<AuthContextType>(() => ({
        user,
        token,
        refreshToken,
        isAuthenticated,
        loginContext,
        logoutContext,
        loading,
        error,
        getLoginForm
    }), [user, token, refreshToken, isAuthenticated, loading, error, getLoginForm, loginContext, logoutContext]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 