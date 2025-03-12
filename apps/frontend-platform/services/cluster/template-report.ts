'use server';

import { API_URL } from "@/lib/api-url";
export const getTemplateReports = async () => {
    const url = `${API_URL}/api/cluster/template-report`
    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    }
    const response = await fetch(url, options)
    if (!response.ok) {
        throw new Error('Failed to fetch template reports')
    }
    return response.json()
}  