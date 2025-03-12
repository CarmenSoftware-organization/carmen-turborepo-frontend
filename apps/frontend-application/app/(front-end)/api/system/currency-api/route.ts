import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api.freecurrencyapi.com/v1';
const CURRENCIES = '/currencies';
const HISTORICAL = '/historical';
const API_KEY = process.env.NEXT_PUBLIC_FREE_CURRENCY_API_KEY;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
			const url = new URL(request.url);
			const baseCurrency = url.searchParams.get('base_currency') || 'THB';

			const currencies = `${BASE_URL}${CURRENCIES}?apikey=${API_KEY}`;
			const historical = `${BASE_URL}${HISTORICAL}?apikey=${API_KEY}&base_currency=${baseCurrency}`;

			const [currenciesResponse, historicalResponse] = await Promise.all([
				fetch(currencies),
				fetch(historical),
			]);

			const currenciesData = await currenciesResponse.json();
			const historicalData = await historicalResponse.json();

			const date = Object.keys(historicalData.data)[0];
			const rateData = historicalData.data[date];

			const result = Object.keys(currenciesData.data).map((currencyKey) => {
				return {
					code: currencyKey,
					name: currenciesData.data[currencyKey].name,
					historical_rate: rateData[currencyKey],
					symbol: currenciesData.data[currencyKey].symbol,
				};
			});

			return NextResponse.json({ result });
		} catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
