import { API_URL } from '@/lib/util/api';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const token = request.headers.get('Authorization')?.replace('Bearer ', '');
		const tenantId = request.headers.get('x-tenant-id');
		const { id } = params;

		if (!id) {
			return NextResponse.json(
				{ error: 'Product item group ID is required' },
				{ status: 400 }
			);
		}

		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Unauthorized access - Invalid or expired token' },
				{ status: 401 }
			);
		}

		const options = {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId || '',
				'Content-Type': 'application/json',
			},
		};

		const response = await fetch(
			`${API_URL}/v1/product-item-group/${id}`,
			options
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			return NextResponse.json(
				{
					error: 'Failed to delete product item group',
					details: errorData,
				},
				{ status: response.status }
			);
		}
		return NextResponse.json({
			message: 'Item group deleted successfully',
		});
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const token = request.headers.get('Authorization')?.replace('Bearer ', '');
		const tenantId = request.headers.get('x-tenant-id');
		const { id } = params;

		const body = await request.json();
		if (!id) {
			return NextResponse.json(
				{ error: 'Product item group ID is required' },
				{ status: 400 }
			);
		}
		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Token is missing from the headers' },
				{ status: 401 }
			);
		}

		const options = {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId || '',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: body.name || '',
				description: body.description || '',
				is_active: Boolean(body.is_active),
				code: body.code || '',
			}),
		};

		const response = await fetch(
			`${API_URL}/v1/product-item-group/${id}`,
			options
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			return NextResponse.json(
				{
					error: 'Failed to update product item group',
					details: errorData,
				},
				{ status: response.status }
			);
		}
		return NextResponse.json({
			id: id,
		});
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
