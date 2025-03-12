import { API_URL } from "@/lib/api-url";

export const getSupport = async () => {
    'use server';
    const url = `${API_URL}/api/support`;
    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to fetch support');
    }
    return response.json();
}



