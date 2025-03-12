import { GoodsReceiveNoteStatus, PurchaseOrderStatus } from '../types';

export const enum PD_STATUS {
	ACTIVE = 'active',
	IN_ACTIVE = 'inactive',
	DISCONTINUED = 'discontinued',
}

export const enum PRODUCT_STATUS_FILTER {
	ALL_STATUS = '',
	ACTIVE = PD_STATUS.ACTIVE,
	IN_ACTIVE = PD_STATUS.IN_ACTIVE,
	DISCONTINUED = PD_STATUS.DISCONTINUED,
}

export const statusGrnColor = (status: GoodsReceiveNoteStatus): string => {
	switch (status) {
		case 'Pending':
			return 'bg-yellow-200 text-yellow-800';
		case 'Received':
			return 'bg-green-100 text-green-800';
		case 'Partial':
			return 'bg-blue-100 text-blue-800';
		case 'Cancelled':
			return 'bg-red-100 text-red-800';
		case 'Voided':
			return 'bg-gray-100 text-gray-800';
		default:
			return 'bg-indigo-100 text-indigo-800';
	}
};

export const statusPoColor = (status: PurchaseOrderStatus): string => {
	switch (status) {
		case PurchaseOrderStatus.Open:
			return 'bg-green-200 text-green-800';
		case PurchaseOrderStatus.Voided:
			return 'bg-gray-300 text-gray-800';
		case PurchaseOrderStatus.Closed:
			return 'bg-blue-200 text-blue-800';
		case PurchaseOrderStatus.Draft:
			return 'bg-yellow-200 text-yellow-800';
		case PurchaseOrderStatus.Sent:
			return 'bg-purple-200 text-purple-800';
		case PurchaseOrderStatus.Partial:
			return 'bg-orange-200 text-orange-800';
		case PurchaseOrderStatus.FullyReceived:
			return 'bg-teal-200 text-teal-800';
		case PurchaseOrderStatus.Cancelled:
			return 'bg-red-200 text-red-800';
		case PurchaseOrderStatus.Deleted:
			return 'bg-black text-white';
		default:
			return 'bg-gray-100 text-gray-800';
	}
};
