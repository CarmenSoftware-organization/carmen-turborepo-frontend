import { NextResponse } from 'next/server';
import { mockGoodsReceiveNotes } from '../mock_data';
import { formatDateCustom } from '@/lib/formatDate';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const GET = async () => {
	try {
		const formattedData = mockGoodsReceiveNotes.map((note) => ({
			...note,
			date: formatDateCustom(note.date),
			invoiceDate: formatDateCustom(note.invoiceDate),
		}));

		return NextResponse.json(
			{
				message: 'Goods received notes fetched successfully',
				data: formattedData,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: 'Failed to fetch goods received notes',
				error:
					error instanceof Error ? error.message : 'Unknown error occurred',
			},
			{ status: 500 }
		);
	}
};
