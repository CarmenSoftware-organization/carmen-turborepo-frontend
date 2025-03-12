import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/util/api';
import { extractRequest } from '@/lib/util/auth';

const apiUrl =
	process.env.CURRENCY_API_URL || 'http://localhost:4000/api/v1/currencies';

// Add these types at the top of the file

interface CurrencyResponse {
	result: {
		code: string;
		name: string;
		historical_rate: number;
		symbol: string;
	}[];
}

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

interface TransformedCurrencyData {
	code: string;
	name: string;
	exchange_rate: number;
	symbol: string;
	is_active: boolean;
}

interface CurrencyApiResponse {
	success: boolean;
	data: TransformedCurrencyData[];
}

// Add this interface
interface CurrencyPayload {
	list: TransformedCurrencyData[];
}

const transformCurrencyData = (
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

const fetchCurrencyData = async (
	baseUrl: string,
	token: string,
	tenantId: string
): Promise<CurrencyResponse> => {
	const response = await fetch(
		`${baseUrl}/api/system/currency-api?base_currency=THB`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId,
				'Content-Type': 'application/json',
			},
		}
	);

	if (!response.ok) {
		throw new ApiError(response.status, 'Failed to fetch currency data');
	}

	return response.json();
};

const postCurrencyData = async (
	data: TransformedCurrencyData[],
	token: string,
	tenantId: string
): Promise<CurrencyApiResponse> => {
	const payload: CurrencyPayload = {
		list: data,
	};

	try {
		const response = await fetch(`${API_URL}/v1/currencies/batch`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		const responseData = await response.json();

		return { success: true, data: responseData };
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		console.error('Unexpected error in postCurrencyData:', error);
		throw new ApiError(500, 'Unexpected error while posting currency data', {
			originalError: error instanceof Error ? error.message : 'Unknown error',
			requestPayload: payload,
		});
	}
};

export async function GET(request: NextRequest) {
	const token = request.headers.get('Authorization')?.replace('Bearer ', '');
	const tenantId = request.headers.get('x-tenant-id');

	if (!token || !tenantId) {
		return NextResponse.json(
			{ error: 'Unauthorized access - Invalid or expired token' },
			{ status: 401 }
		);
	}

	const { searchParams } = new URL(request.url);
	const search = searchParams.get('search') || '';

	const options = {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			'x-tenant-id': tenantId || '',
		},
	};

	const url = `${apiUrl}?search=${search}`;

	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			return NextResponse.json(
				{ error: `Failed to fetch data: ${response.statusText}` },
				{ status: response.status }
			);
		}

		const data = await response.json();

		return NextResponse.json(data);
	} catch (error) {
		console.error('Fetch error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch data from API' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const { token, tenantId } = extractRequest(request);
		const body = await request.json();
		const currencyCodes = body.data;

		if (!Array.isArray(currencyCodes) || currencyCodes.length === 0) {
			return NextResponse.json(
				{
					success: false,
					message:
						'Request body must contain a non-empty array of currency codes',
				},
				{ status: 400 }
			);
		}

		const currencyData = await fetchCurrencyData(
			request.nextUrl.origin,
			token || '',
			tenantId || ''
		);

		const transformedCurrencies = transformCurrencyData(
			currencyData,
			currencyCodes
		);

		if (!transformedCurrencies.length) {
			return NextResponse.json(
				{
					success: false,
					message: 'No matching currencies found',
				},
				{ status: 404 }
			);
		}

		const result = await postCurrencyData(
			transformedCurrencies,
			token || '',
			tenantId || ''
		);

		if (result.success) {
			return NextResponse.json({ success: true, data: transformedCurrencies });
		} else {
			return NextResponse.json({ success: false, data: result.data });
		}
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
