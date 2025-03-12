export enum SORT_OPTIONS {
	NAME = 'name',
	CODE = 'iso_code',
	SYMBOL = 'symbol',
}

export const sortFields = [
	{ key: SORT_OPTIONS.NAME, label: 'Name' },
	{ key: SORT_OPTIONS.CODE, label: 'ISO Code' },
	{ key: SORT_OPTIONS.SYMBOL, label: 'Symbol' },
];

export const toggleSort = (
	field: SORT_OPTIONS,
	currentValue: string
): string => {
	if (currentValue === field) {
		return `${field}:desc`;
	} else if (currentValue === `${field}:desc`) {
		return field;
	} else {
		return field;
	}
};

export const isValidSortOption = (value: string): value is SORT_OPTIONS =>
	Object.values(SORT_OPTIONS).includes(value as SORT_OPTIONS);

interface TransformedCurrencyData {
	code: string;
	name: string;
	exchange_rate: number;
	symbol: string;
	is_active: boolean;
}

interface CurrencyResponse {
	result: {
		code: string;
		name: string;
		historical_rate: number;
		symbol: string;
	}[];
}

export const transformCurrencyData = (
	data: CurrencyResponse,
	currencyCodes: string[]
): TransformedCurrencyData[] => {
	return data.result
		.filter((currency) => currencyCodes.includes(currency.code))
		.map((currency) => ({
			code: currency.code,
			name: currency.name,
			exchange_rate: Number(currency.historical_rate.toFixed(2)),
			symbol: currency.symbol,
			is_active: true,
		}));
};

class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
		public details?: unknown
	) {
		super(message);
		this.name = 'ApiError';
	}
}

export const fetchCurrencyData = async (
	token: string,
	tenantId: string
): Promise<CurrencyResponse> => {
	const response = await fetch(`/api/system/currency-api?base_currency=THB`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			'x-tenant-id': tenantId,
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new ApiError(response.status, 'Failed to fetch currency data');
	}

	return response.json();
};