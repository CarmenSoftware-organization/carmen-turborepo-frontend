import { backendApi } from "@/lib/backend-api";
import axios from "axios";
import { requestHeaders } from "@/lib/config.api";
import { PrSchemaV2Dto } from "@/dtos/pr.dto";

const API_URL = `${backendApi}/api/purchase-request`;

export const getAllPr = async (
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

    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            query.append(key, String(value));
        }
    });

    const queryString = query.toString();
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;

    try {
        const response = await axios.get(url, {
            headers: requestHeaders(token, tenantId)
        });

        console.log('response ss', response);

        return response.data;
    } catch (error) {
        return error
    }
};

export const getPrById = async (
    token: string,
    tenantId: string,
    id: string
) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: requestHeaders(token, tenantId)
        });
        return response.data;
    } catch (error) {
        return error
    }
}

export const createPrService = async (
    token: string,
    tenantId: string,
    data: PrSchemaV2Dto
) => {
    console.log('data createPrService', data);
    try {
        const response = await axios.post(API_URL, data, {
            headers: requestHeaders(token, tenantId)
        });

        return response.data;
    } catch (error) {
        return error
    }
}

export const updatePrService = async (
    token: string,
    tenantId: string,
    id: string,
    data: PrSchemaV2Dto
) => {
    console.log('data updatePrService', data);

    try {
        const response = await axios.put(`${API_URL}/${id}`, data, {
            headers: requestHeaders(token, tenantId)
        });
        console.log('response updatePrService', response);

        return response.data;
    } catch (error) {
        console.log('error updatePrService', error);
        return error
    }
}

export const deletePrService = async (
    token: string,
    tenantId: string,
    id: string
) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: requestHeaders(token, tenantId)
        });

        return response.data;
    } catch (error) {
        return error
    }
}
