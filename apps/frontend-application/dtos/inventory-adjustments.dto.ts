interface AdjustmentItem {
	id: string;
	productName: string;
	sku: string;
	description?: string;
	location: string;
	locationCode: string;
	uom: string;
	requiredQuantity: number;
	approvedQuantity: number;
	issuedQuantity: number;
	price: number;
	status: 'pending' | 'approved' | 'rejected' | 'completed';
	onHand: number;
	onOrder: number;
	lastPrice?: number;
	lastVendor?: string;
	lots: {
		id: string;
		lotNumber: string;
		quantity: number;
		uom: string;
	}[];
	unitCost: number;
	totalCost: number;
}

export interface InventoryAdjustment {
	id: string;
	date: string;
	type: string;
	status: string;
	location: string;
	locationCode: string;
	department: string;
	reason: string;
	description: string;
	items: AdjustmentItem[];
	totals: {
		inQty: number;
		outQty: number;
		totalCost: number;
	};
}

export interface Item {
	id: string;
	code: string;
	name: string;
	description?: string;
	unit: string;
	quantity: number;
	currentStock: number;
	adjustedStock: number;
	status: 'good' | 'damaged' | 'expired';
}
