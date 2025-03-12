import { API_URL } from '@/lib/util/api';
import { extractRequest } from '@/lib/util/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const { token, tenantId } = extractRequest(request);

	if (!token || !tenantId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const url = `${API_URL}/v1/unit-comment`;

	const options = {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			'x-tenant-id': tenantId || '',
			'Content-Type': 'application/json',
		},
	};

	try {
		const response = await fetch(url, options);
		console.log(response);

		if (!response.ok) {
			return NextResponse.json(
				{ error: `Failed to fetch data: ${response.statusText}` },
				{ status: response.status }
			);
		}
		const result = await response.json();

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}


export async function POST(request: NextRequest) {
	const { token, tenantId } = extractRequest(request);

	if (!token || !tenantId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	const body = await request.json();
	const url = `${API_URL}/v1/unit-comment`;
	const options = {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'x-tenant-id': tenantId || '',
			'Content-Type': 'application/json',
		},
	}
	try {
		const response = await fetch(url, { ...options, body: JSON.stringify(body) });
		if (!response.ok) {
			return NextResponse.json(
				{ error: `Failed to fetch data: ${response.statusText}` },
				{ status: response.status }
			);
		}
		const result = await response.json();
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}