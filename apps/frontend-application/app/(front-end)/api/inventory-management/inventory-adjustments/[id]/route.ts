import { NextRequest, NextResponse } from 'next/server';
import { mockAdjustment } from '../../mock_data';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		const adjustment = mockAdjustment.find((r) => r.id === id);

		if (!adjustment) {
			return NextResponse.json(
				{
					success: false,
					message: 'Adjustment not found',
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: adjustment,
		});
	} catch (error) {
		console.error('Error fetching adjustment:', error);
		return NextResponse.json(
			{
				success: false,
				message: 'Failed to fetch adjustment',
			},
			{ status: 500 }
		);
	}
}
