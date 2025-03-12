import { NextResponse } from 'next/server';
import { API_URL } from '@/lib/util/api';
export async function POST(req: Request) {
	try {
		const token = req.headers.get('Authorization')?.replace('Bearer ', '');
		console.log('token', token);

		if (!token) {
			return NextResponse.json(
				{ error: 'Token or tenant ID is missing from the headers' },
				{ status: 400 }
			);
		}
		const body = await req.json();
		if (!body.password || !body.old_password) {
			return NextResponse.json(
				{ message: 'Missing required fields: password or old password' },
				{ status: 400 }
			);
		}
		const response = await fetch(`${API_URL}/v1/auth/change-password`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',

			},
			body: JSON.stringify({
				new_pass: body.password,
				old_pass: body.old_password,
			}),
		});

		if (!response.ok) {
			const errorDetails = await response.json();
			return NextResponse.json(
				{ message: 'Failed to change password', error: errorDetails },
				{ status: response.status }
			);
		}
		const result = await response.json();
		return NextResponse.json(
			{ message: 'Password changed successfully', data: result },
			{ status: 200 }
		);
	} catch (error: unknown) {
		console.error('Error changing password:', error);
		return NextResponse.json(
			{ message: 'An unexpected error occurred', error: (error instanceof Error) ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
}
