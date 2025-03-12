import { fetchUserPlatform } from '@/services/user/platform';
import React from 'react'
import HotelPlatformComponent from './HotelPlatformComponent';

const HotelPlatformServer = async () => {
    const users = await fetchUserPlatform();
    return (
        <HotelPlatformComponent users={users} />
    )
}

export default HotelPlatformServer