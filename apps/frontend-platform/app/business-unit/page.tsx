'use client';

import { ProtectedLayout } from '@/components/layout/protected-layout';
import { useAuth } from '@/contexts/auth-context';

const BusinessUnitPage = () => {
    const { user } = useAuth();

    return (
        <ProtectedLayout requireRoles={['is_general', 'is_platform', 'is_cluster', 'is_business_unit']}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">Business Unit Management</h1>
                </div>

                <div className="bg-green-900/30 rounded-xl p-6 border border-green-800">
                    <h2 className="text-xl font-semibold mb-4 text-green-100">Business Units Overview</h2>
                    <p className="text-green-200 mb-4">
                        This section provides tools to manage and monitor business units within your organization.
                        All users have access to this section, with varying levels of permissions based on their role.
                    </p>

                    {user?.role_user === 'is_business_unit' && (
                        <div className="bg-green-800/50 rounded-lg p-4 mb-6 border border-green-700">
                            <h3 className="font-medium text-green-100 mb-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Business Unit Admin Notice
                            </h3>
                            <p className="text-green-200 text-sm">
                                As a Business Unit Admin, you can only manage the units assigned to you.
                                For access to additional units, please contact a Platform or General Admin.
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        <div className="bg-green-800/40 p-4 rounded-lg border border-green-700">
                            <h3 className="font-medium text-white mb-2">Department Management</h3>
                            <p className="text-green-200 text-sm">Configure departments, teams, and organizational structure</p>
                            <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm">
                                Manage
                            </button>
                        </div>

                        <div className="bg-green-800/40 p-4 rounded-lg border border-green-700">
                            <h3 className="font-medium text-white mb-2">Resource Allocation</h3>
                            <p className="text-green-200 text-sm">Assign and manage resources across business units</p>
                            <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm">
                                View Resources
                            </button>
                        </div>

                        <div className="bg-green-800/40 p-4 rounded-lg border border-green-700">
                            <h3 className="font-medium text-white mb-2">Budget & Finance</h3>
                            <p className="text-green-200 text-sm">Track budgets, expenses, and financial reporting</p>
                            <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm">
                                View Reports
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-green-900/30 rounded-xl p-6 border border-green-800">
                    <h2 className="text-xl font-semibold mb-4 text-green-100">Active Business Units</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-green-800">
                            <thead>
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
                                        BU ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
                                        Department Count
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
                                        Region
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-green-800">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-200">bu-001</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-200">Finance</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-200">3</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-200">Global</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-200">bu-002</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-200">Marketing</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-200">5</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-200">APAC</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
};

export default BusinessUnitPage; 