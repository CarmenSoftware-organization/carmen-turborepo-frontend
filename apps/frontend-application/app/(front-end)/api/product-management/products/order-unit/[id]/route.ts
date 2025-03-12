import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/util/api';
import { extractRequest } from '@/lib/util/auth';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { token, tenantId } = extractRequest(request);

		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Token is missing from the headers' },
				{ status: 400 }
			);
		}
		const URL = `${API_URL}/v1/products/order-unit/${params.id}`;
		const options = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId,
				'Content-Type': 'application/json',
			},
		};
		const res = await fetch(URL, options);
		const orders = await res.json();
		return NextResponse.json({ orders });
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
