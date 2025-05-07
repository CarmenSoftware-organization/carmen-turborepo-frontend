import { UnitDto } from "@/dtos/unit.dto";
import { backendApi } from "@/lib/backend-api";
import axios from "axios";
import { requestHeaders } from "@/lib/config.api";

const API_URL = `${backendApi}/api/config/units`;

export const getAllUnits = async (
    token: string, tenantId: string,
    params: {
        search?: string;
        page?: string;
        perPage?: string;
        sort?: string;
        filter?: string;
    } = {}
) => {

    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, String(value));
        }
    });

    const queryString = query.toString();

    const url = queryString ? `${API_URL}?${queryString}` : API_URL;

    try {
        const response = await axios.get(url, {
            headers: requestHeaders(token, tenantId)
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching units:', error);
        throw error;
    }
};

export const createUnit = async (token: string, tenantId: string, unit: UnitDto) => {
    try {
        const response = await axios.post(API_URL, unit, {
            headers: requestHeaders(token, tenantId)
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create unit:', error);
    }
}

export const updateUnit = async (token: string, tenantId: string, unit: UnitDto) => {
    try {
        const response = await axios.put(`${API_URL}/${unit.id}`, unit, {
            headers: requestHeaders(token, tenantId)
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update unit:', error);
    }
}

export const deleteUnit = async (token: string, tenantId: string, unit: UnitDto) => {
    const url = `${backendApi}/api/config/units/${unit.id}`;
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

