'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

type MenuItem = {
    name: string;
    href: string;
    icon: React.ReactNode;
    requiredRoles: string[];
};

type MainNavProps = {
    isSidebar?: boolean;
    sidebarColorClass?: string;
};

export const MainNav = ({ isSidebar = false, sidebarColorClass = 'hover:bg-zinc-700' }: MainNavProps) => {
    const pathname = usePathname();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    // Define the main menu items with their access requirements
    const menuItems: MenuItem[] = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            requiredRoles: ['is_general', 'is_platform', 'is_cluster', 'is_business_unit'], // Everyone can see the dashboard
        },
        {
            name: 'Platform',
            href: '/platform',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
            ),
            requiredRoles: ['is_general', 'is_platform'], // Only general and platform roles can access
        },
        {
            name: 'Cluster',
            href: '/cluster',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            requiredRoles: ['is_general', 'is_platform', 'is_cluster'], // General, platform, and cluster roles can access
        },
        {
            name: 'Business Unit',
            href: '/business-unit',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            requiredRoles: ['is_general', 'is_platform', 'is_cluster', 'is_business_unit'], // All roles can access
        },
    ];

    // Check if the user has permission to see a menu item
    const hasAccess = (requiredRoles: string[]): boolean => {
        if (!user) return false;
        return requiredRoles.includes(user.role_user);
    };

    // Filter menu items based on user role
    const filteredMenuItems = menuItems.filter(item => hasAccess(item.requiredRoles));

    // Mobile menu toggle
    const toggleMenu = () => setIsOpen(!isOpen);

    // Sidebar layout
    if (isSidebar) {
        return (
            <nav className="space-y-1">
                {filteredMenuItems.map(item => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${pathname === item.href
                            ? 'bg-primary/20 text-primary'
                            : `text-gray-300 ${sidebarColorClass}`
                            }`}
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </nav>
        );
    }

    // Original horizontal navbar layout
    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4">
                {filteredMenuItems.map(item => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${pathname === item.href
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                            }`}
                    >
                        <span className="mr-2">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <button
                    onClick={toggleMenu}
                    className="text-gray-300 hover:text-white p-2"
                    aria-label="Toggle menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute top-16 left-0 right-0 bg-zinc-800 p-4 z-50">
                        {filteredMenuItems.map(item => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${pathname === item.href
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}; 