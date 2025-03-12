import { API_URL } from '@/lib/util/api';
import { extractRequest } from '@/lib/util/auth';
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;

export async function GET() {
	try {
		const API_URL_RATES = `https://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`;
		const API_URL_SYMBOLS = `https://api.exchangeratesapi.io/v1/symbols?access_key=${API_KEY}`;

		const [ratesResponse, symbolsResponse] = await Promise.all([
			fetch(API_URL_RATES),
			fetch(API_URL_SYMBOLS),
		]);

		const ratesData = await ratesResponse.json();
		const symbolsData = await symbolsResponse.json();

		const mappedData = Object.keys(ratesData.rates).reduce(
			(acc, key) => {
				if (symbolsData.symbols[key]) {
					acc[key] = {
						rate: ratesData.rates[key],
						description: symbolsData.symbols[key],
					};
				}
				return acc;
			},
			{} as Record<string, { rate: number; description: string }>
		);

		return NextResponse.json({ data: mappedData }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const { token, tenantId } = extractRequest(request);

		if (!token || !tenantId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const { currency_id, rate } = body;
		const api_url = `${API_URL}/v1/exchangerate`;

		const payload = {
			at_date: new Date().toISOString(),
			rate: rate,
			currency_id: currency_id,
		};

		const options = {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		};
		const response = await fetch(api_url, options);
		if (!response.ok) {
			throw new Error('Failed to update exchange rate');
		}
		return NextResponse.json(
			{ message: 'Exchange rate updated successfully' },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
