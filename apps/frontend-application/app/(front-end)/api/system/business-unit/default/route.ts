import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/util/api';

interface BusinessUnit {
	id: string;
	name: string;
	is_default: boolean;
}

interface BusinessUnitResponse {
	data: BusinessUnit[];
	error?: string;
}

export async function PATCH(request: NextRequest) {
	try {
		const token = request.headers.get('Authorization');
		const tenantId = request.headers.get('x-tenant-id');

		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Missing authorization token or tenant ID' },
				{ status: 401 }
			);
		}

		const url = `${API_URL}/v1/user/business-unit/default`;
		const options = {
			method: 'PATCH',
			headers: {
				Authorization: token,
				'x-tenant-id': tenantId,
				'Content-Type': 'application/json',
			},
		};

		console.log('url', url);
		console.log('options', options);

		const response = await fetch(url, options);

		console.log('response nest', response);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			return NextResponse.json(
				{
					error: errorData.message || 'Failed to update default business unit',
				},
				{ status: response.status }
			);
		}

		const data: BusinessUnitResponse = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error('Business unit update error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
