import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/util/api';
import { extractRequest } from '@/lib/util/auth';

export const DELETE = async (
	request: NextRequest,
	{ params }: { params: { id: string } }
) => {
	try {
		const { token, tenantId } = extractRequest(request);

		if (!token || !tenantId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		const URL = `${API_URL}/v1/delivery-point/${params.id}`;
		const response = await fetch(URL, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId || '',
				'Content-Type': 'application/json',
			},
		});
		if (!response.ok) {
			throw new Error(
				`Failed to delete delivery point: ${response.status} ${response.statusText}`
			);
		}
		return NextResponse.json(
			{ message: 'Delivery point deleted successfully' },
			{ status: 200 }
		);
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
};

export const PATCH = async (
	request: NextRequest,
	{ params }: { params: { id: string } }
) => {
	try {
		const { token, tenantId } = extractRequest(request);

		if (!token || !tenantId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const data = await request.json();
		const URL = `${API_URL}/v1/delivery-point/${params.id}`;
		const options = {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: data.name,
				is_active: data.is_active ?? true,
			}),
		};
		const response = await fetch(URL, options);
		if (!response.ok) {
			throw new Error(
				`Failed to update delivery point: ${response.status} ${response.statusText}`
			);
		}
		const result = await response.json();
		return NextResponse.json({ id: result.id }, { status: 200 });
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
};
