import { NextResponse } from 'next/server';
import { mockCategories } from '../mock-data';

export async function GET() {
	try {
		return NextResponse.json({
			success: true,
			data: mockCategories,
		});
	} catch (error) {
		console.error('Error fetching cuisine types:', error);
		return NextResponse.json(
			{
				success: false,
				data: [],
				message: 'Failed to fetch cuisine types',
			},
			{ status: 500 }
		);
	}
}
