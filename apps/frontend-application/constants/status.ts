import * as m from '@/paraglide/messages.js';
import { PRODUCT_STATUS_FILTER } from '@/lib/util/status';

export const statusProductOptions = [
	{ label: `${m.all_status()}`, value: PRODUCT_STATUS_FILTER.ALL_STATUS },
	{ label: `${m.status_active()}`, value: PRODUCT_STATUS_FILTER.ACTIVE },
	{ label: `${m.status_inactive()}`, value: PRODUCT_STATUS_FILTER.IN_ACTIVE },
	{
		label: `${m.status_discontinued()}`,
		value: PRODUCT_STATUS_FILTER.DISCONTINUED,
	},
];
