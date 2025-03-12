'use client';

import React, { Suspense } from 'react'
import ServerListComponent from './ServerListComponent'
import { useAuth } from '@/app/context/AuthContext';

const ServerComponentPage = () => {
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ServerListComponent token={token} tenantId={tenantId} />
        </Suspense>
    )
}

export default ServerComponentPage