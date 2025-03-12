import { API_URL } from '@/lib/util/api';
import { extractRequest } from '@/lib/util/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const { token, tenantId } = extractRequest(request);

	if (!token || !tenantId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const searchParams = request.nextUrl.searchParams;
	const queryString = searchParams.toString();

	const apiUrl = queryString
		? `${API_URL}/v1/locations?${queryString}`
		: `${API_URL}/v1/locations`;

	const options = {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			'x-tenant-id': tenantId || '',
			'Content-Type': 'application/json',
		},
	};

	try {
		const response = await fetch(apiUrl, options);
		if (!response.ok) {
			return NextResponse.json(
				{ error: `Failed to fetch data: ${response.statusText}` },
				{ status: response.status }
			);
		}

		const result = await response.json();

		return NextResponse.json(result);
	} catch (error) {
		console.error('Fetch error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch data from API' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const { token, tenantId } = extractRequest(request);

		if (!token || !tenantId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();

		const response = await fetch(API_URL + '/v1/locations', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId || '',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(
				{ error: data.message || 'Failed to create currency' },
				{ status: response.status }
			);
		}

		return NextResponse.json({ id: data.id });
	} catch (error) {
		console.error('location creation error:', error);

		return NextResponse.json(
			{
				error: 'Internal server error',
				message:
					error instanceof Error ? error.message : 'Unknown error occurred',
			},
			{ status: 500 }
		);
	}
}
