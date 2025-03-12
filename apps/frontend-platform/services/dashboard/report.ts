import { API_URL } from "@/lib/api-url"


export const fetchReportOverview = async () => {
    'use server'

    const url = `${API_URL}/api/admin/report-overview`
    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    }
    const response = await fetch(url, options)
    if (!response.ok) {
        throw new Error('Failed to fetch admin status')
    }

    return response.json()
}

export const fetchClusterOverview = async () => {
    'use server'

    const url = `${API_URL}/api/admin/cluster`
    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    }
    const response = await fetch(url, options)
    if (!response.ok) {
        throw new Error('Failed to fetch cluster overview')
    }

    return response.json()
}

