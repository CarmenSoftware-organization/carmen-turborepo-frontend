import { API_URL } from '@/lib/util/api';
import { extractRequest } from '@/lib/util/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { token, tenantId } = extractRequest(request);

		if (!token || !tenantId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const data = await request.json();

		const URL = `${API_URL}/v1/currencies/${params.id}`;

		const response = await fetch(URL, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				'x-tenant-id': tenantId || '',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			return NextResponse.json(
				{
					message: errorData?.message || 'Failed to update currency',
					error: errorData,
				},
				{ status: response.status }
			);
		}

		const result = await response.json();
		if (!result) {
			throw new Error('Invalid response from API');
		}
		return NextResponse.json({ data: result.data }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{
				message:
					error instanceof Error ? error.message : 'Internal server error',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { token, tenantId } = extractRequest(request);

		if (!token || !tenantId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		const URL = `${API_URL}/v1/currencies/${params.id}`;
		const response = await fetch(URL, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId || '',
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			return NextResponse.json(
				{
					message: errorData?.message || 'Failed to delete currency',
					error: errorData,
				},
				{ status: response.status }
			);
		}

		return NextResponse.json(
			{ message: 'Currency deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				message:
					error instanceof Error ? error.message : 'Internal server error',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			},
			{ status: 500 }
		);
	}
}
