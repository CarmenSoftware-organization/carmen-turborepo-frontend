import { backendApi } from "@/lib/backend-api";
import axios from "axios";
import { getAllApiRequest, getByIdApiRequest, requestHeaders } from "@/lib/config.api";
import { PrSchemaV2Dto } from "@/dtos/pr.dto";
import { ParamsGetDto } from "@/dtos/param.dto";

const API_URL = `${backendApi}/api/purchase-request`;

export const getAllPrService = async (
    token: string,
    tenantId: string,
    params?: ParamsGetDto
) => {
    return getAllApiRequest(
        API_URL,
        token,
        tenantId,
        'Failed to fetch purchase requests',
        params
    );
};

export const getPrByIdService = async (
    token: string,
    tenantId: string,
    id: string
) => {
    const API_URL_BY_ID = `${API_URL}/${id}`;
    return getByIdApiRequest(
        API_URL_BY_ID,
        token,
        tenantId,
        'Failed to fetch purchase request'
    );
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
    try {
        const response = await axios.put(`${API_URL}/${id}`, data, {
            headers: requestHeaders(token, tenantId)
        });

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
