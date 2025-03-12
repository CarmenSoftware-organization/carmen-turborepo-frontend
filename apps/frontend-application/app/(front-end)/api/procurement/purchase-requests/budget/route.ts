import { NextResponse } from 'next/server';
import { budgetData } from '../../mock_data';
export const dynamic = 'force-dynamic';
export const GET = async () => {
    try {
        return NextResponse.json({
            data: budgetData
        });
    } catch (error) {
        return NextResponse.json(
            {
                message: 'Failed to fetch budget',
                error:
                    error instanceof Error ? error.message : 'Unknown error occurred',
            },
            { status: 500 }
        );
    }
};
