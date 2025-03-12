import { VendorCreateSchema } from '@/dtos/vendor.dto';
import { API_URL } from '@/lib/util/api';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
	try {
		const token = request.headers.get('Authorization')?.replace('Bearer ', '');
		const tenantId = request.headers.get('x-tenant-id');
		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Unauthorized access - Invalid or expired token' },
				{ status: 401 }
			);
		}

		const searchParams = request.nextUrl.searchParams;
		const queryString = searchParams.toString();
		const apiUrl = queryString
			? `${API_URL}/v1/vendor?${queryString}`
			: `${API_URL}/v1/vendor`;

		const options = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId || '',
				'Content-Type': 'application/json',
			},
		};

		const response = await fetch(apiUrl, options);
		if (response.status === 401) {
			return NextResponse.json(
				{ error: 'Unauthorized access - Invalid or expired token' },
				{ status: 401 }
			);
		}
		if (!response.ok) {
			throw new Error(
				`Failed to fetch units: ${response.status} ${response.statusText}`
			);
		}
		const data = await response.json();
		return NextResponse.json({
			data,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: 'Internal Server Error', error: error },
			{ status: 500 }
		);
	}
};

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
		const result = VendorCreateSchema.safeParse(body);

		if (!result.success) {
			return NextResponse.json(
				{
					error: 'Validation failed',
					details: result.error.issues,
				},
				{ status: 400 }
			);
		}
		const validatedData = result.data;
		const apiUrl = `${API_URL}/v1/vendor`;

		const options = {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId || '',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: validatedData.name,
				description: validatedData.description,
				is_active: validatedData.is_active,
			}),
		};

		const response = await fetch(apiUrl, options);
		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			throw new Error(
				`Failed to create unit: ${response.status} ${response.statusText}`,
				{ cause: errorData }
			);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Internal Server Error', error: error },
			{ status: 500 }
		);
	}
};
