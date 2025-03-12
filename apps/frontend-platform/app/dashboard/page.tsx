'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedLayout } from '@/components/layout/protected-layout';

// Define role color configuration
const roleColorConfig: Record<string, { bg: string, text: string, cardBg: string, highlight: string }> = {
    'is_cluster': {
        bg: 'bg-blue-950',
        text: 'text-blue-200',
        cardBg: 'bg-blue-900',
        highlight: 'text-blue-400'
    },
    'is_business_unit': {
        bg: 'bg-green-950',
        text: 'text-green-200',
        cardBg: 'bg-green-900',
        highlight: 'text-green-400'
    },
    'is_platform': {
        bg: 'bg-purple-950',
        text: 'text-purple-200',
        cardBg: 'bg-purple-900',
        highlight: 'text-purple-400'
    },
    'default': {
        bg: 'bg-zinc-900',
        text: 'text-white',
        cardBg: 'bg-zinc-800',
        highlight: 'text-gray-400'
    }
};

const DashboardPage = () => {
    const { user } = useAuth();
    const [platformRoles, setPlatformRoles] = useState<string[]>([]);
    const [clusterRoles, setClusterRoles] = useState<Array<{
        description: string;
        role_type: string;
    }>>([]);

    useEffect(() => {
        if (user) {
            // Extract platform roles
            if (user.roles && user.roles.platform) {
                const roles = user.roles.platform.map(role => role.role_type);
                setPlatformRoles(roles);
            }

            // Extract cluster roles
            if (user.roles && user.roles.cluster) {
                const roles = user.roles.cluster.map(role => ({
                    description: role.description,
                    role_type: role.role_type
                }));
                setClusterRoles(roles);
            }
        }
    }, [user]);

    // Get the appropriate color scheme based on the user's role
    const colorScheme = user?.role_user ? roleColorConfig[user.role_user] || roleColorConfig.default : roleColorConfig.default;

    return (
        <ProtectedLayout>
            <div className={`${colorScheme.text}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                    </div>

                    <div className={`${colorScheme.cardBg} rounded-xl p-6 mb-8`}>
                        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-medium mb-2">User Information</h3>
                                <div className="space-y-2">
                                    <p><span className={colorScheme.highlight}>Email:</span> {user?.email}</p>
                                    <p><span className={colorScheme.highlight}>ID:</span> {user?.id}</p>
                                    <p><span className={colorScheme.highlight}>Role Type:</span> {user?.role_user}</p>
                                </div>
                            </div>

                            {user?.role_user === 'is_cluster' && clusterRoles.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Cluster Roles</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {clusterRoles.map((role, index) => (
                                            <li key={index} className="text-blue-400">
                                                {role.role_type}: {role.description}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {platformRoles.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Platform Roles</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {platformRoles.map((role, index) => (
                                            <li key={index} className="text-primary">
                                                {role}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {!platformRoles.length && !clusterRoles.length && (
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Roles</h3>
                                    <p className={colorScheme.highlight}>No roles assigned</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={`${colorScheme.cardBg} rounded-xl p-6`}>
                            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg">
                                    View Platforms
                                </button>
                                <button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-2 px-4 rounded-lg">
                                    Manage Users
                                </button>
                                <button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-2 px-4 rounded-lg">
                                    System Settings
                                </button>
                            </div>
                        </div>

                        <div className={`${colorScheme.cardBg} rounded-xl p-6`}>
                            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                <p className={colorScheme.highlight}>No recent activity to display</p>
                            </div>
                        </div>

                        <div className={`${colorScheme.cardBg} rounded-xl p-6`}>
                            <h3 className="text-xl font-semibold mb-4">System Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span>API Status</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Operational
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Database</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Operational
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Storage</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Operational
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
};

export default DashboardPage; 