import { API_URL } from '@/lib/util/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const token = request.headers.get('Authorization')?.replace('Bearer ', '');
		const tenantId = request.headers.get('x-tenant-id');
		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Token or tenant ID is missing from the headers' },
				{ status: 400 }
			);
		}
		const options = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId || '',
				'Content-Type': 'application/json',
			},
		};

		const response = await fetch(`${API_URL}/v1/product-sub-category`, options);

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
		return NextResponse.json({ error: error }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const token = request.headers.get('Authorization')?.replace('Bearer ', '');
		const tenantId = request.headers.get('x-tenant-id');
		if (!token || !tenantId) {
			console.error('Missing Authorization token');
			return NextResponse.json(
				{ error: 'Token is missing from the headers' },
				{ status: 401 }
			);
		}
		const data = await request.json();

		if (!data.name || !data.description) {
			return NextResponse.json(
				{
					error: 'Name and description are required',
					receivedData: data,
				},
				{ status: 400 }
			);
		}

		const options = {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId || '',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				product_category_id: data.product_category_id,
				name: data.name,
				description: data.description,
				is_active: data.is_active ?? true,
			}),
		};

		const response = await fetch(`${API_URL}/v1/product-sub-category`, options);

		if (!response.ok) {
			const errorBody = await response.text();
			return NextResponse.json(
				{
					status: response.status,
					details: errorBody,
				},
				{ status: response.status }
			);
		}

		const result = await response.json();

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error('Unexpected error:', error);
		return NextResponse.json(
			{
				message: 'Unexpected Internal Server Error',
				error: String(error),
			},
			{ status: 500 }
		);
	}
}
