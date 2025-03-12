import { API_URL } from "@/lib/util/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const token = request.headers.get('Authorization')?.replace('Bearer ', '');
		const tenantId = request.headers.get('x-tenant-id');
		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Token or tenant ID is missing from the headers' },
				{ status: 400 }
			);
		}
		const options = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId || '',
				'Content-Type': 'application/json',
			},
		};

		const response = await fetch(`${API_URL}/v1/product-item-group`, options);

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
		return NextResponse.json({ error: error }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const token = request.headers.get('Authorization')?.replace('Bearer ', '');
		const tenantId = request.headers.get('x-tenant-id');
		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Unauthorized access - Invalid or expired token' },
				{ status: 401 }
			);
		}
		const data = await request.json();
		if (
			!data.name ||
			!data.description ||
			!data.product_subcategory_id ||
			!data.code
		) {
			return NextResponse.json(
				{ error: 'field item category are required' },
				{ status: 400 }
			);
		}

		const options = {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId || '',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				product_subcategory_id: data.product_subcategory_id,
				name: data.name,
				description: data.description,
				code: data.code,
				is_active: data.is_active ?? true,
			}),
		};

		const response = await fetch(`${API_URL}/v1/product-item-group`, options);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch units: ${response.status} ${response.statusText}`
			);
		}

		const result = await response.json();
		return NextResponse.json({
			result,
		});
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
