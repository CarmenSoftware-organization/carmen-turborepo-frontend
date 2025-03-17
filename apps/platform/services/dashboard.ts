'use server'

import { API_URL } from "../lib/api-url";

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

export async function getReportOverview() {
    const url = `${API_URL}/api/dashboard/report`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to fetch report overview');
    }
    const data = await response.json();
    return data;
}

export async function getClusterOverview() {
    const url = `${API_URL}/api/dashboard/cluster`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to fetch cluster overview');
    }
    const data = await response.json();
    return data;
}

export async function getRecentActivity() {
    const url = `${API_URL}/api/dashboard/recent-activity`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to fetch recent activity');
    }
    const data = await response.json();
    return data;
}


