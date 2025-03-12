"use server";
import { fetchUserPlatform } from '@/services/user/platform';
import React from 'react'
import ClusterPlatformComponent from './ClusterPlatformComponent';

const ClusterPlatFormServer = async () => {
    const users = await fetchUserPlatform();
    return <ClusterPlatformComponent users={users} />
}

export default ClusterPlatFormServer;