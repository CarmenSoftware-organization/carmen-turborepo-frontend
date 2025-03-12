"use client"
import React from 'react';
import { useSearchParams } from 'next/navigation';
import VerifyComponent from '../components/VerifyComponent';

const VerifyPage = () => {
    const searchParams = useSearchParams();

    const token = searchParams.get('token');

    if (!token) {
        return (
            <div className="min-h-screen all-center">
                <div className="text-center p-8 bg-red-50 rounded-lg">
                    <h1 className="text-xl font-semibold text-red-600 mb-2">
                        Invalid Verification Link
                    </h1>
                    <p className="text-gray-600">
                        The verification link is invalid or has expired.
                    </p>
                </div>
            </div>
        );
    }

    return <VerifyComponent token={token} />;
}

export default VerifyPage;