'use server'
import { API_URL } from "@/lib/api-url";
export async function getStatusDashboard() {
    const url = `${API_URL}/api/dashboard/status`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to fetch status dashboard');
    }
    const data = await response.json();
    return data;
}