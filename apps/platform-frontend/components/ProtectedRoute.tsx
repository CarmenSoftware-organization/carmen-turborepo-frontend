'use client';

import React, { ReactNode, useMemo } from 'react';
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

    // Helper to find a menu item by its path
    const findMenuItemByPath = (path: string) => {
        // Check main paths first
        const mainItem = sidebarItems.find(item => item.href === path);
        if (mainItem) return mainItem;

        // Check for child paths
        for (const item of sidebarItems) {
            if (item.children) {
                const childItem = item.children.find(child => child.href === path);
                if (childItem) return childItem;
            }
        }

        return null;
    };

    // Enhanced helper function to check if user has access to current path
    const checkAccess = useMemo(() => {
        return (path: string, role: string): boolean => {
            // Edge cases - empty path or no role
            if (!path || !role) return false;

            // Normalize path (remove trailing slash)
            const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;

            // 1. Direct match - Check if the exact path exists in the menu and user has access
            const exactMatch = findMenuItemByPath(normalizedPath);
            if (exactMatch) {
                return exactMatch.allowedRoles?.includes(role) ?? true;
            }

            // 2. Parent path matching - Check if this is a sub-route of an allowed parent
            // Extract the parent path sections
            const pathParts = normalizedPath.split('/').filter(Boolean);

            // Handle sub-routes: check if parent paths are accessible
            // We try with different levels of parent paths
            for (let i = pathParts.length - 1; i > 0; i--) {
                const parentPath = '/' + pathParts.slice(0, i).join('/');
                const parentItem = findMenuItemByPath(parentPath);

                // If parent exists and user has access to it
                if (parentItem?.allowedRoles?.includes(role)) {
                    // Allow access to its sub-routes
                    return true;
                }
            }

            // 3. Protected route check - If no matching item but it's in a protected area
            const protectedPrefixes = ['/dashboard', '/platform', '/cluster', '/business-unit'];
            if (protectedPrefixes.some(prefix => normalizedPath.startsWith(prefix))) {
                return false; // Default deny for undefined protected routes
            }

            // For all other paths, allow access by default
            return true;
        };
    }, []);

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

    const hasAccess = checkAccess(pathname, user?.role_user ?? '');

    // If user doesn't have access, show the access denied component
    if (!hasAccess) {
        return <AccessDenied />;
    }

    // User has access, render the protected content
    return <>{children}</>;
};

export default ProtectedRoute; 