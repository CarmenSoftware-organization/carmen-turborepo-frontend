// /utils/auth.ts

import { jwtDecode } from 'jwt-decode';
import { NextRequest } from 'next/server';

interface JWTPayload {
	exp: number;
	iat: number;
	sub: string;
	// เพิ่ม properties อื่นๆ ตามที่มีใน token ของคุณ
}

interface TokenResponse {
	access_token: string;
	refresh_token: string;
}

interface TokenExtract {
	token?: string;
	tenantId: string | null;
}

/**
 * ตรวจสอบว่า token หมดอายุหรือยัง
 */
export const isTokenExpired = (token: string): boolean => {
	try {
		const decoded = jwtDecode<JWTPayload>(token);
		return decoded.exp * 1000 < Date.now();
	} catch {
		return true;
	}
};

/**
 * ตรวจสอบว่า token ใกล้หมดอายุหรือไม่
 */
export const isTokenExpiringSoon = (
	token: string,
	thresholdMs: number = 5 * 60 * 1000
): boolean => {
	try {
		const decoded = jwtDecode<JWTPayload>(token);
		return decoded.exp * 1000 - Date.now() <= thresholdMs;
	} catch {
		return true;
	}
};

/**
 * เรียก refresh token API
 */
export const refreshAccessToken = async (
	refresh_token: string
): Promise<TokenResponse> => {
	try {
		const response = await fetch('/api/auth/refresh', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ refresh_token }),
		});

		if (!response.ok) {
			throw new Error('Failed to refresh token');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Refresh token error:', error);
		throw error;
	}
};

/**
 * ดึงข้อมูลจาก API ที่ต้องการ authentication
 */
export const fetchWithToken = async (
	url: string,
	options: RequestInit = {},
	token: string,
	onTokenRefresh?: (newToken: string) => void
) => {
	try {
		// เพิ่ม Authorization header
		const headers = new Headers(options.headers);
		headers.set('Authorization', `Bearer ${token}`);

		const response = await fetch(url, {
			...options,
			headers,
		});

		// ถ้า token หมดอายุ
		if (response.status === 401) {
			// ดึง refresh token จาก storage
			const refreshToken = localStorage.getItem('refresh_token');
			if (!refreshToken) {
				throw new Error('No refresh token available');
			}

			// ขอ token ใหม่
			const newTokens = await refreshAccessToken(refreshToken);

			// เรียก callback เพื่ออัพเดท token ใน state
			if (onTokenRefresh) {
				onTokenRefresh(newTokens.access_token);
			}

			// ลองเรียก API อีกครั้งด้วย token ใหม่
			headers.set('Authorization', `Bearer ${newTokens.access_token}`);
			return fetch(url, {
				...options,
				headers,
			});
		}

		return response;
	} catch (error) {
		console.error('API request error:', error);
		throw error;
	}
};

export const extractRequest = (request: NextRequest): TokenExtract => {
	const token = request.headers.get('Authorization')?.replace('Bearer ', '');
	const tenantId = request.headers.get('x-tenant-id');	
	return { token, tenantId };
};
