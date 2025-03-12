'use client';

import { User } from '@/services/auth/auth';
import { jwtDecode } from 'jwt-decode';

// Type for decoded JWT token
type DecodedToken = {
    exp: number;
    iat: number;
    sub: string;
    type?: string;
};

/**
 * Checks if a token is expired
 * @param token The JWT token to check
 * @returns True if the token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
};

/**
 * Gets the remaining time in seconds until a token expires
 * @param token The JWT token to check
 * @returns The number of seconds until the token expires, or 0 if it's already expired
 */
export const getTokenExpiryTime = (token: string): number => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return Math.max(0, decoded.exp - currentTime);
    } catch (error) {
        console.error('Error decoding token:', error);
        return 0;
    }
};

/**
 * Gets the user ID from a token
 * @param token The JWT token
 * @returns The user ID from the token, or null if it couldn't be decoded
 */
export const getUserIdFromToken = (token: string): string | null => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.sub;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

/**
 * Checks if the user has a specific role
 * @param user The user object
 * @param roleType The role type to check for
 * @returns True if the user has the role, false otherwise
 */
export const hasRole = (user: User | null, roleType: string): boolean => {
    if (!user || !user.roles || !user.roles.platform) {
        return false;
    }

    return user.roles.platform.some(role =>
        role.role_type === roleType && role.is_active
    );
};

/**
 * Checks if the user has platform admin role
 * @param user The user object
 * @returns True if the user is a platform admin, false otherwise
 */
export const isPlatformAdmin = (user: User | null): boolean => {
    return hasRole(user, 'platform_admin');
};

/**
 * Gets auth data from storage (session or local)
 * @returns Object containing token, refresh token, and user data
 */
export const getAuthFromStorage = () => {
    if (typeof window === 'undefined') {
        return { token: null, refreshToken: null, user: null };
    }

    // Try to get from sessionStorage first, then localStorage
    const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
    const refreshToken = sessionStorage.getItem('refresh_token') || localStorage.getItem('refresh_token');
    const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');

    let user = null;
    try {
        if (userStr) {
            user = JSON.parse(userStr);
        }
    } catch (error) {
        console.error('Error parsing user data:', error);
    }

    return { token, refreshToken, user };
}; 