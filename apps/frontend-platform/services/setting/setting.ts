'use server';

import { API_URL } from "@/lib/api-url";
import { SettingsFormValues } from "@/types/form/form";

export const getSettings = async () => {
    const url = `${API_URL}/api/setting`;
    const options = {
        method: 'GET',
        cache: 'no-store' as RequestCache
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to fetch settings');
    }
    return response.json();
}

export const updateSettings = async (data: SettingsFormValues) => {
    const url = `${API_URL}/api/setting`;
    const options = {
        method: 'PUT',
        body: JSON.stringify(data)
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to update settings');
    }
    return response.json();
}

