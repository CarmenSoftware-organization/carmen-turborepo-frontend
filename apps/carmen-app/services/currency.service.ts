import { CurrencyDto } from "@/dtos/config.dto";
import { backendApi } from "@/lib/backend-api";

export const getCurrenciesService = async (
    token: string,
    tenantId: string,
    params: {
        search?: string;
        page?: string;
        perPage?: string;
    } = {}
) => {

    const query = new URLSearchParams();
    if (params.search) {
        query.append('search', params.search);
    }

    if (params.page) {
        query.append('page', params.page);
    }

    if (params.perPage) {
        query.append('perPage', params.perPage);
    }

    const url = `${backendApi}/api/config/currencies?${query}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
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

