import { API_URL } from "@/lib/api-url"

export const getAssignmentReports = async () => {
    'use server'
    const url = `${API_URL}/api/report/assignment`
    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    }
    const response = await fetch(url, options)
    if (!response.ok) {
        throw new Error('Failed to fetch reports')
    }
    return response.json()
}

export const getBusinessUnitReports = async () => {
    'use server'
    const url = `${API_URL}/api/report/bu-report`
    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    }
    const response = await fetch(url, options)
    if (!response.ok) {
        throw new Error('Failed to fetch reports')
    }
    return response.json()
}

export const getReportTemplates = async () => {
    'use server'
    const url = `${API_URL}/api/report/template`
    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    }
    const response = await fetch(url, options)
    if (!response.ok) {
        throw new Error('Failed to fetch reports')
    }
    return response.json()
}

