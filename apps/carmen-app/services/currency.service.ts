import { CurrencyDto } from "@/dtos/config.dto";
import { backendApi } from "@/lib/backend-api";
import axios from "axios";
import { requestHeaders } from "@/lib/config.api";

const API_URL = `${backendApi}/api/config/currencies`;

export const getCurrenciesService = async (
    token: string,
    tenantId: string,
    params: {
        search?: string;
        page?: string;
        perPage?: string;
        sort?: string;
        filter?: string;
    } = {}
) => {
    try {

        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                query.append(key, String(value));
            }
        });

        const queryString = query.toString();

        const url = queryString ? `${API_URL}?${queryString}` : API_URL;

        const response = await axios.get(url, {
            headers: requestHeaders(token, tenantId)
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch currencies:', error);
    }
};

export const createCurrency = async (token: string, tenantId: string, currency: CurrencyDto) => {
    try {
        const response = await axios.post(API_URL, currency, {
            headers: requestHeaders(token, tenantId)
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create currency:', error);
    }
}

export const updateCurrency = async (token: string, tenantId: string, currency: CurrencyDto) => {
    try {
        const response = await axios.patch(`${API_URL}/${currency.id}`, currency, {
            headers: requestHeaders(token, tenantId)
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update currency:', error);
    }
}


export const deleteCurrency = async (token: string, tenantId: string, currency: CurrencyDto) => {
    const url = `${backendApi}/api/config/currencies/${currency.id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
}

export const toggleCurrencyStatus = async (token: string, tenantId: string, currencyId: string, isActive: boolean) => {
    const url = `${backendApi}/api/config/currencies/${currencyId}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            is_active: !isActive,
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to toggle currency status');
    }
    const data = await response.json();
    return data;
}