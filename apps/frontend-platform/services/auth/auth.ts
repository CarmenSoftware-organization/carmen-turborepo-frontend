'use server';

import { BACKEND_URL } from "@/lib/api-url"

// Type definitions for auth responses
export type User = {
    id: string;
    name: string;
    email: string;
    roles: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        business_unit: any[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cluster: any[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        general: any[];
        platform: Array<{
            description: string;
            granted_at: string;
            id: string;
            is_active: boolean;
            platform_id: string;
            role_id: string;
            role_type: string;
        }>;
    };
};

export type LoginResponse = {
    message: string;
    token: string;
    refresh_token: string;
    user: User;
};

/**
 * Authenticates a user with the backend API
 * @param username The username to authenticate with
 * @param password The password to authenticate with
 * @returns The login response containing tokens and user data
 */
export const serviceLogin = async (username: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Failed to login');
    }

    return response.json();
};

/**
 * Refreshes the authentication token using a refresh token
 * @param refreshToken The refresh token to use
 * @returns A new auth token and refresh token
 */
export const refreshAuthToken = async (refreshToken: string) => {
    const response = await fetch(`${BACKEND_URL}/api/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    return response.json();
};

/**
 * Logs out a user by invalidating their tokens on the server
 * @param token The current auth token
 */
export const serviceLogout = async (token: string) => {
    const response = await fetch(`${BACKEND_URL}/api/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        console.error('Failed to logout on server');
    }

    return true;
};

