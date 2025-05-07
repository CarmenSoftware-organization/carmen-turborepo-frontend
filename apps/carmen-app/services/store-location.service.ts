import { CreateStoreLocationDto } from "@/dtos/config.dto";
import { backendApi } from "@/lib/backend-api";
import axios from "axios";
import { requestHeaders } from "@/lib/config.api";

const API_URL = `${backendApi}/api/config/locations`;

export const getAllStoreLocations = async (token: string, tenantId: string,
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
        console.error('Failed to fetch store locations:', error);
        throw error;
    }
}

export const createStoreLocation = async (token: string, tenantId: string, storeLocation: CreateStoreLocationDto) => {
    try {
        const response = await axios.post(API_URL, storeLocation, {
            headers: requestHeaders(token, tenantId)
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create store location:', error);
        throw error;
    }
}

export const updateStoreLocation = async (token: string, tenantId: string, storeLocation: CreateStoreLocationDto & { id: string }) => {
    try {
        const response = await axios.patch(`${API_URL}/${storeLocation.id}`, storeLocation, {
            headers: requestHeaders(token, tenantId)
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update store location:', error);
        throw error;
    }
}

export const deleteStoreLocation = async (token: string, tenantId: string, id: string) => {
    const url = `${backendApi}/api/config/locations/${id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        return true;
    }
    return false;
};

