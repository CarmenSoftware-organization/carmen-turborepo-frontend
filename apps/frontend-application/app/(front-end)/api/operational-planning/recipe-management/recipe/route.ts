import { NextResponse } from 'next/server';
import { mockRecipes } from '../mock-data';

export async function GET() {
	try {
		return NextResponse.json({
			success: true,
			data: mockRecipes,
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
