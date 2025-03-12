'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const UnauthorizedPage = () => {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center text-white p-4">
            <div className="max-w-md w-full bg-zinc-800 rounded-xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V8m0 0V6m0 2h2m-2 0H9" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                <p className="text-gray-400 mb-6">
                    You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
                </p>

                <div className="space-y-3">
                    <Link
                        href="/dashboard"
                        className="block w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg"
                    >
                        Return to Dashboard
                    </Link>

                    <button
                        onClick={logout}
                        className="block w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-2 px-4 rounded-lg"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage; 