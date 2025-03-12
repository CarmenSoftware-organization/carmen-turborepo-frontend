import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/util/api';

export const POST = async (request: NextRequest) => {
	try {
		const token = request.headers.get('Authorization')?.replace('Bearer ', '');
		const tenantId = request.headers.get('x-tenant-id');
		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Unauthorized access - Invalid or expired token' },
				{ status: 401 }
			);
		}

		const body = await request.json();

		const response = await fetch(`${API_URL}/v1/auth/refresh`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId || '',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ refresh_token: body.refresh_token }),
		});

		const data = await response.json();
		console.log('data >>>', data);
		return NextResponse.json(data);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
};
