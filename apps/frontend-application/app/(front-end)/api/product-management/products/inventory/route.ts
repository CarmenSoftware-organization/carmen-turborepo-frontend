import { NextResponse } from 'next/server';

const inventoryData = {
	totalStock: {
		onHand: 3300,
		onOrder: 500
	},
	locations: [
		{
			code: 'MK-001',
			name: 'Main Kitchen Storage',
			type: 'Primary',
			onHand: 1500,
			onOrder: 500,
			minimum: 1000,
			maximum: 3000,
			reorderPoint: 1200,
			parLevel: 2000
		},
		{
			code: 'DR-001',
			name: 'Dry Storage Room',
			type: 'Secondary',
			onHand: 1000,
			onOrder: 0,
			minimum: 800,
			maximum: 2000,
			reorderPoint: 1000,
			parLevel: 1500
		},
		{
			code: 'CS-001',
			name: 'Cold Storage',
			type: 'Cold Storage',
			onHand: 500,
			onOrder: 0,
			minimum: 300,
			maximum: 1000,
			reorderPoint: 400,
			parLevel: 800
		},
		{
			code: 'BQ-001',
			name: 'Banquet Kitchen',
			type: 'Kitchen',
			onHand: 200,
			onOrder: 0,
			minimum: 150,
			maximum: 500,
			reorderPoint: 200,
			parLevel: 400
		},
		{
			code: 'PB-001',
			name: 'Pool Bar',
			type: 'Bar',
			onHand: 100,
			onOrder: 0,
			minimum: 50,
			maximum: 200,
			reorderPoint: 75,
			parLevel: 150
		}
	],
	aggregateSettings: {
		minimum: 2300,
		maximum: 6700,
		reorderPoint: 2875,
		parLevel: 4850
	}
};

export const GET = async () => {
	return NextResponse.json({ data: inventoryData });
};
