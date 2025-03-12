import { API_URL } from '@/lib/util/api';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const { username, password } = body;

		// Construct the request for the external API
		const URL = `${API_URL}/v1/auth/login`;

		const response = await fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});

		const data = await response.json();

		if (!response.ok) {
			console.error('Authentication error:', data.error);
			return NextResponse.json(
				{ error: data.error || 'Authentication failed' },
				{ status: response.status }
			);
		}

		// Return the response data to the client
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error('Error processing signin:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
