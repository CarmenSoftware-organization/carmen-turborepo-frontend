'use server'

import { API_URL } from "@/lib/api-url";
import { ClusterMemberFormValues } from "@/types/form/form";

export const fetchMembers = async () => {
    const url = `${API_URL}/api/member`
    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    }
    const response = await fetch(url, options)
    if (!response.ok) {
        throw new Error('Failed to fetch members')
    }
    return response.json()
}

export const postMember = async (data: ClusterMemberFormValues) => {
    const url = `${API_URL}/api/member`
    const options = {
        method: 'POST',
        body: JSON.stringify(data)
    }
    const response = await fetch(url, options)
    if (!response.ok) {
        throw new Error('Failed to create member')
    }
    return response.json()
}
