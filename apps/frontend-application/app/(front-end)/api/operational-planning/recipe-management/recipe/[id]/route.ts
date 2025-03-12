import { NextRequest, NextResponse } from 'next/server';
import { mockRecipes } from '../../mock-data';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

		const recipe = mockRecipes.find((r) => r.id === id);

		if (!recipe) {
			return NextResponse.json(
				{
					success: false,
					message: 'Recipe not found',
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: recipe,
		});
	} catch (error) {
		console.error('Error fetching recipe:', error);
		return NextResponse.json(
			{
				success: false,
				message: 'Failed to fetch recipe',
			},
			{ status: 500 }
		);
	}
}
