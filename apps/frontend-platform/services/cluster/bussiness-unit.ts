'use server';

import { API_URL } from "@/lib/api-url"

export const fetchBusinessUnits = async () => {
    const url = `${API_URL}/api/business-unit`;

    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    }
    const response = await fetch(url, options)
    if (!response.ok) {
        throw new Error('Failed to fetch business units')
    }
    return response.json()
}


