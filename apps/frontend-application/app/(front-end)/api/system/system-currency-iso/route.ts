import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_SYSTEM_API_URL;

if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined in the environment variables.');
}

export async function GET(request: NextRequest) {
    // Extract token and handle missing Authorization header
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const tenantId = request.headers.get('x-tenant-id');
		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Unauthorized access - Invalid or expired token' },
				{ status: 401 }
			);
		}

		// Parse URL search parameters
		const { searchParams } = new URL(request.url);
		const search = searchParams.get('search') || '';
		const page = searchParams.get('page') || '1';
		const perpage = searchParams.get('perpage') || '10';
		const sort = searchParams.get('sort') || 'name';

		// Construct API URL with query parameters
		const apiUrl = new URL(`${API_URL}/v1/system-currency-iso`);

		apiUrl.searchParams.set('search', search);
		apiUrl.searchParams.set('page', page);
		apiUrl.searchParams.set('perpage', perpage);
		apiUrl.searchParams.set('sort', sort);

		// Define fetch options
		const options = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId || '',
			},
		};

    try {
        // Fetch data from the external API
        const response = await fetch(apiUrl.toString(), options);

        if (!response.ok) {
            // Handle non-2xx responses
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
            { error: 'An error occurred while fetching data from the API' },
            { status: 500 }
        );
    }
}
