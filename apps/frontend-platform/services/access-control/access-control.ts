import { API_URL } from "@/lib/api-url"


export const fetchAccessControl = async () => {
    'use server';
    const url = `${API_URL}/api/user/access`;
    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to fetch access control');
    }
    return response.json();
}


