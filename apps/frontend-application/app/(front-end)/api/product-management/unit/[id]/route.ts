import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/util/api';
import { UnitUpdateSchema } from '@/dtos/unit.dto';

export const DELETE = async (
	request: NextRequest,
	{ params }: { params: { id: string } }
) => {
	try {
		const token = request.headers.get('Authorization')?.replace('Bearer ', '');
		const tenantId = request.headers.get('x-tenant-id');
		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Unauthorized access - Invalid or expired token' },
				{ status: 401 }
			);
		}
		const URL = `${API_URL}/v1/units/${params.id}`;
		const response = await fetch(URL, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId || '',
				'Content-Type': 'application/json',
			},
		});
		if (!response.ok) {
			throw new Error(
				`Failed to delete unit: ${response.status} ${response.statusText}`
			);
		}
		return NextResponse.json(
			{ message: 'Unit deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Unexpected error:', error);
		return NextResponse.json(
			{
				message: 'Unexpected Internal Server Error',
				error: String(error),
			},
			{ status: 500 }
		);
	}
};

export const PATCH = async (
	request: NextRequest,
	{ params }: { params: { id: string } }
) => {
	try {
		const token = request.headers.get('Authorization')?.replace('Bearer ', '');
		const tenantId = request.headers.get('x-tenant-id');
		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Unauthorized access - Invalid or expired token' },
				{ status: 401 }
			);
		}
		const body = await request.json();
		const result = UnitUpdateSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json(
				{
					error: 'Validation failed',
					details: result.error.issues,
				},
				{ status: 400 }
			);
		}
		const validatedData = result.data;
		const URL = `${API_URL}/v1/units/${params.id}`;
		const options = {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId || '',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: validatedData.name,
				description: validatedData.description,
				is_active: validatedData.is_active ?? true,
			}),
		};
		const response = await fetch(URL, options);
		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			throw new Error(
				`Failed to update unit: ${response.status} ${response.statusText}`,
				{ cause: errorData }
			);
		}
		const data = await response.json();
		return NextResponse.json({ id: data.id }, { status: 200 });
	} catch (error) {
		console.error('Unexpected error:', error);
		return NextResponse.json(
			{
				message: 'Unexpected Internal Server Error',
				error: String(error),
			},
			{ status: 500 }
		);
	}
};
