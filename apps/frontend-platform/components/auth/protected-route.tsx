'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

type ProtectedRouteProps = {
    children: React.ReactNode;
    requiredRoles?: string[];
};

/**
 * A component that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 * Can also check for specific roles if provided
 */
const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
    const { isAuthenticated, user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If not loading and not authenticated, redirect to login
        if (!loading && !isAuthenticated) {
            router.push('/auth');
            return;
        }

        // If roles are required, check if user has at least one of them
        if (!loading && isAuthenticated && requiredRoles.length > 0 && user) {
            const userRoles = user.roles.platform.map(role => role.role_type);
            const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

            if (!hasRequiredRole) {
                // Redirect to unauthorized page or dashboard
                router.push('/unauthorized');
            }
        }
    }, [isAuthenticated, loading, requiredRoles, router, user]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // If authenticated (and has required roles if specified), render children
    return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute; 