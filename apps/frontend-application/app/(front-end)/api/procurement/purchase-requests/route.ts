import { NextResponse } from 'next/server';
import { prData } from '../mock_data';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = async () => {
    try {
        return NextResponse.json({
            data: prData
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
