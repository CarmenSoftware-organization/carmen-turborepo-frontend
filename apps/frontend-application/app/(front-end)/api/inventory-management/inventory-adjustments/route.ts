import { NextResponse } from 'next/server';
import { mockAdjustment } from '../mock_data';

export async function GET() {
	try {
		return NextResponse.json({
			success: true,
			data: mockAdjustment,
		});
	} catch (error) {
		console.error('Error fetching cuisine types:', error);
		return NextResponse.json(
			{
				success: false,
				data: [],
				message: 'Failed to fetch recipes',
			},
			{ status: 500 }
		);
	}
}
