import { backendApi } from "@/lib/backend-api";
import axios from "axios";
import { requestHeaders } from "@/lib/config.api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { CurrencyCreateDto, CurrencyUpdateDto } from "@/dtos/currency.dto";

const API_URL = `${backendApi}/api/config/currencies`;

export const getCurrenciesService = async (
    token: string,
    buCode: string,
    params?: ParamsGetDto
) => {
    try {

        const query = new URLSearchParams();
        Object.entries(params ?? {}).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                query.append(key, String(value));
            }
        });

        const queryString = query.toString();

        const url = queryString ? `${API_URL}?${queryString}` : API_URL;

        const response = await axios.get(url, {
            headers: requestHeaders(token, buCode)
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch currencies:', error);
        return error;
    }
};

export const createCurrency = async (token: string, buCode: string, currency: CurrencyCreateDto) => {
    try {
        const response = await axios.post(API_URL, currency, {
            headers: requestHeaders(token, buCode)
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create currency:', error);
        return error;
    }
}

export const updateCurrency = async (token: string, buCode: string, currency: CurrencyUpdateDto) => {
    try {
        const response = await axios.patch(`${API_URL}/${currency.id}`, currency, {
            headers: requestHeaders(token, buCode)
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update currency:', error);
        return error;
    }
}


export const deleteCurrency = async (token: string, buCode: string, id: string) => {
    const url = `${backendApi}/api/config/currencies/${id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': buCode,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
}

export const toggleCurrencyStatus = async (token: string, buCode: string, id: string, isActive: boolean) => {
    const url = `${backendApi}/api/config/currencies/${id}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': buCode,
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