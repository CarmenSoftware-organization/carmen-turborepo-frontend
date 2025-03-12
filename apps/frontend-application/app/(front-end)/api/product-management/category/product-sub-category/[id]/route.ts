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
				{ error: 'Product category ID is required' },
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
			`${API_URL}/v1/product-sub-category/${id}`,
			options
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			return NextResponse.json(
				{
					error: 'Failed to delete product category',
					details: errorData,
				},
				{ status: response.status }
			);
		}

		return NextResponse.json({
			message: 'Product category deleted successfully',
			id,
		});
	} catch (error) {
		console.error('Error deleting product category:', error);
		return NextResponse.json(
			{ error: 'Internal server error while deleting product category' },
			{ status: 500 }
		);
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
				{ error: 'Product category ID is required' },
				{ status: 400 }
			);
		}

		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Unauthorized access - Invalid or expired token' },
				{ status: 401 }
			);
		}

		if (!body || typeof body !== 'object') {
			return NextResponse.json(
				{ error: 'Invalid request body' },
				{ status: 400 }
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
			}),
		};

		const response = await fetch(
			`${API_URL}/v1/product-sub-category/${id}`,
			options
		);
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			return NextResponse.json(
				{
					error: 'Failed to update product category',
					details: errorData,
				},
				{ status: response.status }
			);
		}

		return NextResponse.json({
			id: id,
		});
	} catch (error) {
		console.error('Error deleting product category:', error);
		return NextResponse.json(
			{ error: 'Internal server error while deleting product category' },
			{ status: 500 }
		);
	}
}
