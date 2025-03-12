import { formType } from '@/constants/enums';
import { CurrencyCreateModel } from '@/dtos/currency.dto';

export const fetchCurrencies = async (
	token: string,
	tenantId: string,
	params: {
		search?: string;
		status?: string;
		page?: string;
		perpage?: string;
		sort?: string;
	} = {}
) => {
	try {
		if (!token) {
			throw new Error('Access token is required');
		}

		const query = new URLSearchParams();

		if (params.search) {
			query.append('search', params.search);
		}

		if (params.status) {
			query.append('filter[is_active:bool]', params.status);
		}

		if (params.page) {
			query.append('page', params.page);
		}

		if (params.perpage) {
			query.append('perpage', params.perpage);
		}

		if (params.sort) {
			query.append('sort', params.sort);
		}

		const url = `/api/configuration/currency?${query}`;

		const options = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId,
				'Content-Type': 'application/json',
			},
		};

		const response = await fetch(url, options);

		if (!response.ok) {
			throw new Error('Failed to fetch currencies');
		}

		const result = await response.json();
		return result;
	} catch (error) {
		console.error('Error fetching currencies:', error);
		throw error;
	}
};

export const deleteCurrency = async (
	id: string,
	token: string,
	tenantId: string
) => {
	const response = await fetch(`/api/configuration/currency/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
			'x-tenant-id': tenantId,
		},
	});

	if (response.status === 401) {
		throw new Error('Unauthorized');
	}

	if (!response.ok) {
		throw new Error('Failed to delete currency');
	}

	return response;
};

export const submitCurrency = async (
	data: CurrencyCreateModel,
	mode: formType,
	token: string,
	tenantId: string,
	defaultValues?: CurrencyCreateModel
) => {
	const url =
		mode === formType.ADD
			? '/api/configuration/currency'
			: `/api/configuration/currency/${defaultValues?.id}`;

	const method = mode === formType.ADD ? 'POST' : 'PATCH';

	const response = await fetch(url, {
		method,
		headers: {
			Authorization: `Bearer ${token}`,
			'x-tenant-id': tenantId,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || `Failed to ${mode} Currency`);
	}

	const result = await response.json();
	return result;
};

export const fetchSystemCurrencies = async (
	token: string,
	tenantId: string,
	page: number,
	perpage: number,
	search: string,
	sort: string
) => {
	const url = `/api/system/system-currency-iso?page=${page}&perpage=${perpage}&search=${search}&sort=${sort}`;
	const options = {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			'x-tenant-id': tenantId,
			'Content-Type': 'application/json',
		},
	};
	const response = await fetch(url, options);
	if (!response.ok) {
		throw new Error('Failed to fetch currencies');
	}
	return await response.json();
};

export const fetchExchangeRates = async (token: string, tenantId: string) => {
	const response = await fetch(`/api/system/currency-api?base_currency=THB`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			'x-tenant-id': tenantId,
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Failed to fetch currency data');
	}

	const responseData = await response.json();
	const data = Array.isArray(responseData) ? responseData : responseData.result;

	if (!Array.isArray(data)) {
		throw new Error('Invalid response format: expected an array of currencies');
	}

	return data;
};

export const prepareCurrentRates = (currencies: CurrencyCreateModel[]) => {
	return currencies
		.filter(
			(
				currency
			): currency is CurrencyCreateModel & {
				id: string;
				code: string;
				exchange_rate: number;
			} => {
				return (
					!!currency.id &&
					!!currency.code &&
					typeof currency.exchange_rate === 'number'
				);
			}
		)
		.map((currency) => ({
			id: currency.id,
			code: currency.code,
			exchange_rate: currency.exchange_rate,
		}));
};

export const findChangedRates = (
	apiData: Array<{ code: string; historical_rate: number }>,
	currentRates: Array<{ id: string; code: string; exchange_rate: number }>
) => {
	return apiData
		.filter((apiCurrency) => {
			const existingCurrency = currentRates.find(
				(currency) => currency.code === apiCurrency.code
			);

			if (!existingCurrency) return false;

			const existingRate = Number(existingCurrency.exchange_rate);
			const newRate = Number(apiCurrency.historical_rate);

			return existingRate.toFixed(2) !== newRate.toFixed(2);
		})
		.map((apiCurrency) => {
			const currency = currentRates.find((c) => c.code === apiCurrency.code);
			if (!currency?.id) return null;

			return {
				at_date: new Date().toISOString(),
				rate: apiCurrency.historical_rate,
				currency_id: currency.id,
			};
		})
		.filter((rate): rate is NonNullable<typeof rate> => rate !== null);
};
