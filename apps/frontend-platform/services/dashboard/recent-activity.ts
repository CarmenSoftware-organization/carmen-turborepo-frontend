import { API_URL } from "@/lib/api-url"

export const fetchRecentActivity = async () => {
    'use server'
    const url = `${API_URL}/api/admin/recent-activety`
    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    }
    const response = await fetch(url, options)
    if (!response.ok) {
        throw new Error('Failed to fetch recent activity')
    }

    return response.json()
}