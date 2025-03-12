import { NextResponse } from 'next/server';
import { staticCreditNotes } from '../mock_data';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const GET = async () => {
	try {
		// Return the static credit notes with 200 status code
		return NextResponse.json(
			{
				message: 'Credit notes fetched successfully',
				data: staticCreditNotes,
			},
			{ status: 200 }
		);
	} catch (error) {
		// Return error response with 500 status code
		return NextResponse.json(
			{
				message: 'Failed to fetch credit notes',
				error:
					error instanceof Error ? error.message : 'Unknown error occurred',
			},
			{ status: 500 }
		);
	}
};
