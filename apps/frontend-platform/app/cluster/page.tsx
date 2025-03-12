'use client';

import { ProtectedLayout } from '@/components/layout/protected-layout';
import { useAuth } from '@/contexts/auth-context';

const ClusterPage = () => {
    const { user } = useAuth();

    return (
        <ProtectedLayout requireRoles={['is_general', 'is_platform', 'is_cluster']}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">Cluster Management</h1>
                </div>

                <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-800">
                    <h2 className="text-xl font-semibold mb-4 text-blue-100">Clusters Overview</h2>
                    <p className="text-blue-200 mb-4">
                        This area allows you to manage and monitor all clusters within your organization.
                        Users with General Admin, Platform Admin, or Cluster Admin roles can access this section.
                    </p>

                    {user?.role_user === 'is_cluster' && (
                        <div className="bg-blue-800/50 rounded-lg p-4 mb-6 border border-blue-700">
                            <h3 className="font-medium text-blue-100 mb-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Cluster Admin Notice
                            </h3>
                            <p className="text-blue-200 text-sm">
                                As a Cluster Admin, you can only view and manage the clusters assigned to you.
                                Contact a Platform Admin if you need access to additional clusters.
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        <div className="bg-blue-800/40 p-4 rounded-lg border border-blue-700">
                            <h3 className="font-medium text-white mb-2">Cluster Configuration</h3>
                            <p className="text-blue-200 text-sm">Manage cluster settings, resources, and node configurations</p>
                            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
                                Configure
                            </button>
                        </div>

                        <div className="bg-blue-800/40 p-4 rounded-lg border border-blue-700">
                            <h3 className="font-medium text-white mb-2">Deployments</h3>
                            <p className="text-blue-200 text-sm">Manage applications and services deployed to clusters</p>
                            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
                                View Deployments
                            </button>
                        </div>

                        <div className="bg-blue-800/40 p-4 rounded-lg border border-blue-700">
                            <h3 className="font-medium text-white mb-2">Monitoring</h3>
                            <p className="text-blue-200 text-sm">View performance metrics and health status of clusters</p>
                            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
                                View Metrics
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-800">
                    <h2 className="text-xl font-semibold mb-4 text-blue-100">Active Clusters</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-blue-800">
                            <thead>
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                                        Cluster ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                                        Node Count
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                                        Region
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-800">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">fcf7e80f-c212-4d4f</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">Frontend Cluster</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Healthy
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">5</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">US-East</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">f50aef0c-3a19-4b90</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">Backend Cluster</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            Warning
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">3</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">EU-Central</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
};

export default ClusterPage; 