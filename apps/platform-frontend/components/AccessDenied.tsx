'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';

const AccessDenied = () => {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
            {/* Backdrop with blur effect */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fadeIn"></div>

            {/* Alert card */}
            <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full mx-4 z-10 relative shadow-2xl border border-red-800/30 animate-scaleIn">
                <div className="flex items-center text-red-500 mb-4">
                    <AlertTriangle className="h-6 w-6 mr-2" />
                    <h3 className="text-lg font-semibold">Access Denied</h3>
                </div>
                <p className="text-white mb-6">You don&apos;t have permission to access this page.</p>
                <Button
                    onClick={handleGoBack}
                >
                    Go Back
                </Button>
            </div>
        </div>
    );
};

export default AccessDenied; 