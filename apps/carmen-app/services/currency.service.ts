import { CurrencyDto } from "@/dtos/currency.dto";
import { backendApi } from "@/lib/backend-api";

export const getAllCurrencies = async (token: string) => {
    const url = `${backendApi}/api/config/currencies`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data;
}

export const createCurrency = async (token: string, currency: CurrencyDto) => {
    const url = `${backendApi}/api/config/currencies`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(currency),
    });
    const data = await response.json();
    return data;
}

export const updateCurrency = async (token: string, currency: CurrencyDto) => {
    const url = `${backendApi}/api/config/currencies/${currency.id}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(currency),
    });
    const data = await response.json();
    return data;
}


export const deleteCurrency = async (token: string, currency: CurrencyDto) => {
    const url = `${backendApi}/api/config/currencies/${currency.id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
}

