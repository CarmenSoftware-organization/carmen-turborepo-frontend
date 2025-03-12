'use server';

import { fetchUserPlatform } from '@/services/user/platform';
import React from 'react'
import UserPlatformClient from './UserPlatformClient';

const UserPlatformComponent = async () => {
    const users = await fetchUserPlatform();
    return <UserPlatformClient users={users} />
}

export default UserPlatformComponent