import { UnitDto } from "@/dtos/unit.dto";
import { backendApi } from "@/lib/backend-api";
import axios from "axios";
import { getAllApiRequest, postApiRequest, requestHeaders } from "@/lib/config.api";
import { ParamsGetDto } from "@/dtos/param.dto";

const API_URL = `${backendApi}/api/config/units`;

export const getAllUnits = async (
    token: string,
    params?: ParamsGetDto
) => {
    return getAllApiRequest(
        API_URL,
        token,
        'Failed to fetch units',
        params
    );
};

export const createUnit = async (
    token: string,
    value: UnitDto,
) => {
    return postApiRequest(
        API_URL,
        token,
        value,
        'Failed to create unit'
    );
}

export const updateUnit = async (token: string, unit: UnitDto) => {
    try {
        const response = await axios.put(`${API_URL}/${unit.id}`, unit, {
            headers: requestHeaders(token)
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update unit:', error);
        return error;
    }
}

export const deleteUnit = async (token: string, unit: UnitDto) => {
    const url = `${backendApi}/api/config/units/${unit.id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        return true;
    }
    return false;
};

