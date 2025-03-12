import { NextRequest, NextResponse } from 'next/server';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
	const token = request.headers.get('Authorization')?.replace('Bearer ', '');
	const tenantId = request.headers.get('x-tenant-id');

	if (!token || !tenantId) {
		return NextResponse.json(
			{ error: 'Unauthorized access - Invalid or expired token' },
			{ status: 401 }
		);
	}

	const { searchParams } = new URL(request.url);
	const search = searchParams.get('search') || '';

	const options = {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			'x-tenant-id': tenantId || '',
		},
	};

	const url = `${apiUrl}/v1/workflows?search=${search}`;

	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			return NextResponse.json(
				{ error: `Failed to fetch data: ${response.statusText}` },
				{ status: response.status }
			);
		}

		const data = await response.json();

		return NextResponse.json(data);
	} catch (error) {
		console.error('Fetch error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch data from API' },
			{ status: 500 }
		);
	}
}
