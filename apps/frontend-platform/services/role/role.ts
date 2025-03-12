import { API_URL } from "@/lib/api-url"

export const fetchClusterRoles = async () => {
    'use server';
    const url = `${API_URL}/api/user/role/cluster`;
    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to fetch cluster roles');
    }
    return response.json();
}

export const fetchDepartmentRoles = async () => {
    'use server';
    const url = `${API_URL}/api/user/role/department`;
    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to fetch department roles');
    }
    return response.json();
}

export const fetchPlatformRoles = async () => {
    'use server';
    const url = `${API_URL}/api/user/role/platform`;
    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to fetch platform roles');
    }
    return response.json();
}