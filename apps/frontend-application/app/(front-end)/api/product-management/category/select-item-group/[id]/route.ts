import { API_URL } from '@/lib/util/api';
import { extractRequest } from '@/lib/util/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { token, tenantId } = extractRequest(request);

		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Unauthorized access - Invalid or expired token' },
				{ status: 401 }
			);
		}
		const { id } = params;
		if (!id) {
			return NextResponse.json(
				{ error: 'Product item group ID is required' },
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

		const response = await fetch(
			`${API_URL}/v1/product-item-group/sub-category/${id}`,
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

		const data = await response.json();
		return NextResponse.json({
			data: data.data,
		});
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}