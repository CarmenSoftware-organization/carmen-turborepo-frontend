import { API_URL } from '@/lib/util/api';
import { extractRequest } from '@/lib/util/auth';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
	try {
		const { token, tenantId } = extractRequest(request);
		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Token or tenant ID is missing from the headers' },
				{ status: 400 }
			);
		}

		const searchParams = request.nextUrl.searchParams;
		const queryString = searchParams.toString();

		const apiUrl = queryString
			? `${API_URL}/v1/delivery-point?${queryString}`
			: `${API_URL}/v1/delivery-point`;

		const options = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId,
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
		const { token, tenantId } = extractRequest(request);
		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Token or tenant ID is missing from the headers' },
				{ status: 401 }
			);
		}
		const body = await request.json();
		const apiUrl = `${API_URL}/v1/delivery-point`;
		const options = {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: body.name,
				is_active: body.is_active ?? true,
			}),
		};

		const response = await fetch(apiUrl, options);

		if (!response.ok) {
			throw new Error(
				`Failed to create delivery point: ${response.status} ${response.statusText}`
			);
		}
		const result = await response.json();
		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Internal Server Error', error: error },
			{ status: 500 }
		);
	}
};
