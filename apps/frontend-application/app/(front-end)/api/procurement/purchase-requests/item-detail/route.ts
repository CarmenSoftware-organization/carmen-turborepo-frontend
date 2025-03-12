import { NextResponse } from 'next/server';
import { itemDetails } from '../../mock_data';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = async () => {
    try {
        return NextResponse.json({
            data: itemDetails
        });
    } catch (error) {
        // Return error response with 500 status code
        return NextResponse.json(
            {
                message: 'Failed to fetch Pruchase requests',
                error:
                    error instanceof Error ? error.message : 'Unknown error occurred',
            },
            { status: 500 }
        );
    }
};
