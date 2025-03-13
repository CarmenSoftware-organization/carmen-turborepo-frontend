'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { sidebarItems } from '@/constants/menu';
import AccessDenied from './AccessDenied';

type ProtectedRouteProps = {
    children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, isAuthenticated, loading } = useAuth();
    const pathname = usePathname();
    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // If not authenticated, the auth middleware should handle redirection
    if (!isAuthenticated || !user) {
        window.location.href = '/auth';
    }

    // Helper function to check if user has access to current path
    const checkAccess = (path: string, role: string): boolean => {
        // Check main paths first
        const mainItem = sidebarItems.find(item => item.href === path);
        if (mainItem) {
            return mainItem.allowedRoles?.includes(role) ?? true;
        }

        // Check for child paths
        for (const item of sidebarItems) {
            if (item.children) {
                const childItem = item.children.find(child => child.href === path);
                if (childItem) {
                    return childItem.allowedRoles?.includes(role) ?? true;
                }
            }
        }

        // Path not found in menu configuration - if it's in protected routes, deny access
        // For non-dashboard routes, we can have different logic
        if (
            path.startsWith('/dashboard') ||
            path.startsWith('/platform') ||
            path.startsWith('/cluster') ||
            path.startsWith('/business-unit')
        ) {
            return false;
        }

        // For other paths, allow access by default
        return true;
    };

    const hasAccess = checkAccess(pathname, user?.role_user ?? '');

    // If user doesn't have access, show the access denied component
    if (!hasAccess) {
        return <AccessDenied />;
    }

    // User has access, render the protected content
    return <>{children}</>;
};

export default ProtectedRoute; 