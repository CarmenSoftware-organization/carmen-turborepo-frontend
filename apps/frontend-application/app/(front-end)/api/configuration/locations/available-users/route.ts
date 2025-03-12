import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/util/api';
import { extractRequest } from '@/lib/util/auth';

export async function GET(request: NextRequest) {
	const { token, tenantId } = extractRequest(request);

	if (!token || !tenantId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	const api_url = `${API_URL}/v1/user/business-unit`;
	const options = {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			'x-tenant-id': tenantId,
			'Content-Type': 'application/json',
		},
	};
	try {
		const response = await fetch(api_url, options);
		if (response.status === 401) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		const result = await response.json();
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
