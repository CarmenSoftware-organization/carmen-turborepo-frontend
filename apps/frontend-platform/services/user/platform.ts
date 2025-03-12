'use server';

import { API_URL } from "@/lib/api-url"
import { UserPlatformFormValues } from "@/types/form/form";

export const fetchUserPlatform = async () => {

    const url = `${API_URL}/api/user/platform`;
    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to fetch user platform');
    }
    return response.json();
}

export const postUserPlatform = async (data: UserPlatformFormValues) => {
    console.log('data', data);
    const url = `${API_URL}/api/user/platform`;
    const options = {
        method: 'POST',
        body: JSON.stringify(data)
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to create user platform');
    }
    return response.json();
}