'use client';

import { ProtectedLayout } from '@/components/layout/protected-layout';

const PlatformPage = () => {
    return (
        <ProtectedLayout requireRoles={['is_general', 'is_platform']}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">Platform Management</h1>
                </div>

                <div className="bg-zinc-800 rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Platform Overview</h2>
                    <p className="text-gray-300 mb-4">
                        This is the platform management area where administrators can configure and manage platform-wide settings and features.
                        Only users with General Admin or Platform Admin roles can access this section.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        <div className="bg-zinc-700 p-4 rounded-lg">
                            <h3 className="font-medium text-white mb-2">Platform Configuration</h3>
                            <p className="text-gray-300 text-sm">Manage global platform settings and configurations</p>
                            <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm">
                                Configure
                            </button>
                        </div>

                        <div className="bg-zinc-700 p-4 rounded-lg">
                            <h3 className="font-medium text-white mb-2">API Management</h3>
                            <p className="text-gray-300 text-sm">Configure API endpoints and manage access tokens</p>
                            <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm">
                                Manage APIs
                            </button>
                        </div>

                        <div className="bg-zinc-700 p-4 rounded-lg">
                            <h3 className="font-medium text-white mb-2">Platform Analytics</h3>
                            <p className="text-gray-300 text-sm">View platform-wide usage analytics and reports</p>
                            <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm">
                                View Analytics
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-800 rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Platform Lifecycle</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead>
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Platform ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Version
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Last Updated
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-zinc-800 divide-y divide-gray-700">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">plt-001</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">2.1.0</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">2023-05-12</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">plt-002</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            Maintenance
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">1.8.3</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">2023-04-28</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
};

export default PlatformPage; 