import { formatDateCustom } from '@/lib/formatDate';
import { NextResponse } from 'next/server';
import { Mock_purchaseOrders } from '../mock_data';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = async () => {
	try {
		// Validate that Mock_purchaseOrders exists and is an array
		if (!Array.isArray(Mock_purchaseOrders)) {
			throw new Error('Invalid purchase orders data format');
		}

		const formattedData = Mock_purchaseOrders.map((order) => ({
			...order,
			orderDate: formatDateCustom(order.orderDate ?? ''),
			DeliveryDate: formatDateCustom(order.DeliveryDate ?? ''),
		}));

		// Ensure we're sending a proper JSON response
		return new NextResponse(
			JSON.stringify({
				message: 'Purchase orders fetched successfully',
				data: formattedData,
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	} catch (error) {
		// Proper error response
		return new NextResponse(
			JSON.stringify({
				message: 'Failed to fetch purchase orders',
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
};
