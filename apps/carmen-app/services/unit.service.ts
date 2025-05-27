import { UnitDto } from "@/dtos/unit.dto";
import { backendApi } from "@/lib/backend-api";
import axios from "axios";
import { getAllApiRequest, postApiRequest, requestHeaders } from "@/lib/config.api";
import { ParamsGetDto } from "@/dtos/param.dto";

const API_URL = `${backendApi}/api/config/units`;

export const getAllUnits = async (
    token: string,
    tenantId: string,
    params: ParamsGetDto
) => {
    return getAllApiRequest(
        API_URL,
        token,
        tenantId,
        'Failed to fetch units',
        params
    );
};

export const createUnit = async (
    token: string,
    tenantId: string,
    value: UnitDto,
) => {
    return postApiRequest(
        API_URL,
        token,
        tenantId,
        value,
        'Failed to create unit'
    );
}

export const updateUnit = async (token: string, tenantId: string, unit: UnitDto) => {
    try {
        const response = await axios.put(`${API_URL}/${unit.id}`, unit, {
            headers: requestHeaders(token, tenantId)
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update unit:', error);
        return error;
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

