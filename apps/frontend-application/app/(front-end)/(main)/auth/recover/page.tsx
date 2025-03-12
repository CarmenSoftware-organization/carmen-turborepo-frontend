"use client"
import React from 'react'
import PasswordRecovery from '../components/PasswordRecovery'
import { useSearchParams } from 'next/navigation';

const RecoveryPage = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    return (
        <>
            {token ? (
                <PasswordRecovery token={token} />
            ) : (
                <div className="min-h-screen all-center">
                    <div className="text-center p-8 bg-red-50 rounded-lg">
                        <h1 className="text-xl font-semibold text-red-600 mb-2">
                            Invalid recover Link
                        </h1>
                        <p className="text-gray-600">
                            The recover link is invalid or has expired.
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}

export default RecoveryPage