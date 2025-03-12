'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { MainNav } from '@/components/navigation/main-nav';
import Link from 'next/link';

type ProtectedLayoutProps = {
    children: ReactNode;
    requireRoles?: string[]; // Optional specific role requirements
};

// Access Denied Alert Component
const AccessDeniedAlert = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
            {/* Backdrop with blur effect */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fadeIn"></div>

            {/* Alert card */}
            <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full mx-4 z-10 relative shadow-2xl border border-red-800/30 animate-scaleIn">
                <div className="flex items-center text-red-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-lg font-semibold">Access Denied</h3>
                </div>
                <p className="text-white mb-6">You don&apos;t have permission to access this page.</p>
                <button
                    onClick={onClose}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export const ProtectedLayout = ({
    children,
    requireRoles,
}: ProtectedLayoutProps) => {
    const { isAuthenticated, user, loading, logout } = useAuth();
    const router = useRouter();
    const [showAccessDenied, setShowAccessDenied] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    useEffect(() => {
        // If not loading and not authenticated, redirect to login
        if (!loading && !isAuthenticated) {
            router.replace('/auth');
            return;
        }

        // If roles are required, check if user has one of them
        if (
            !loading &&
            isAuthenticated &&
            requireRoles &&
            requireRoles.length > 0 &&
            user &&
            !requireRoles.includes(user.role_user)
        ) {
            // User doesn't have required role, show access denied alert
            setShowAccessDenied(true);
        }
    }, [isAuthenticated, loading, router, requireRoles, user]);

    const handleAccessDeniedClose = () => {
        setShowAccessDenied(false);
        router.back();
    };

    const handleLogout = () => {
        logout();
    };

    // Show loading state or nothing while checking authentication
    if (loading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Get role-specific colors for the header and sidebar
    const getRoleColors = () => {
        if (!user) return { bg: 'bg-zinc-800', text: 'text-white', sidebarBg: 'bg-zinc-900', hoverBg: 'hover:bg-zinc-700' };

        switch (user.role_user) {
            case 'is_cluster':
                return {
                    bg: 'bg-blue-900',
                    text: 'text-blue-100',
                    sidebarBg: 'bg-blue-950',
                    hoverBg: 'hover:bg-blue-800'
                };
            case 'is_business_unit':
                return {
                    bg: 'bg-green-900',
                    text: 'text-green-100',
                    sidebarBg: 'bg-green-950',
                    hoverBg: 'hover:bg-green-800'
                };
            case 'is_platform':
                return {
                    bg: 'bg-purple-900',
                    text: 'text-purple-100',
                    sidebarBg: 'bg-purple-950',
                    hoverBg: 'hover:bg-purple-800'
                };
            default:
                return {
                    bg: 'bg-zinc-800',
                    text: 'text-white',
                    sidebarBg: 'bg-zinc-900',
                    hoverBg: 'hover:bg-zinc-700'
                };
        }
    };

    const { bg, text, sidebarBg, hoverBg } = getRoleColors();

    return (
        <div className="min-h-screen bg-zinc-900 flex flex-col">
            {/* Access Denied Alert */}
            {showAccessDenied && <AccessDeniedAlert onClose={handleAccessDeniedClose} />}

            {/* Main content with conditional blur */}
            <div className={`flex flex-col h-screen transition-all duration-300 ${showAccessDenied ? 'blur-md filter brightness-50' : ''}`}>
                {/* Header */}
                <header className={`${bg} ${text} py-3 px-4 shadow-md z-10`}>
                    <div className="max-w-full mx-auto flex justify-between items-center">
                        <div className="flex items-center">
                            {/* Sidebar toggle button */}
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                aria-label="Toggle sidebar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <Link href="/dashboard" className="text-xl font-bold">
                                Carmen Platform
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium hidden md:inline-block">{user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-sm rounded-lg transition-colors"
                                aria-label="Logout"
                            >
                                <span className="hidden md:inline">Logout</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main content area with sidebar */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <aside
                        className={`${sidebarBg} ${text} w-64 flex-shrink-0 border-r border-zinc-800 transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                            } md:translate-x-0 fixed md:relative h-full z-20 md:z-0`}
                    >
                        <div className="p-4">
                            <div className="mb-4 pl-2">
                                <h2 className="text-lg font-bold opacity-80">Menu</h2>
                            </div>
                            {/* Navigation menu in sidebar */}
                            <MainNav isSidebar={true} sidebarColorClass={hoverBg} />

                            {/* User info at bottom of sidebar */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center`}>
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-medium truncate">{user?.name}</p>
                                        <p className="text-xs opacity-70 truncate">{user?.role_user}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 overflow-auto p-4 md:p-6">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}; 