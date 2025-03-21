'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SpinLoading from './loading/SpinLoading';

interface ProtectedRouteProps {
    readonly children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            const locale = pathname?.split('/')[1];
            router.push(`/${locale}/sign-in`);
        }
    }, [isAuthenticated, isLoading, router, pathname]);

    // Show loading state while checking authentication
    if (isLoading) {
        return <SpinLoading />
    }

    // Only render children if authenticated
    return isAuthenticated ? <>{children}</> : null;
} 