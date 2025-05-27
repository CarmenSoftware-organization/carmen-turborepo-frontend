import { deleteApiRequest, getAllApiRequest, getByIdApiRequest, postApiRequest, updateApiRequest } from "@/lib/config.api";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { CreatePriceListDto, UpdatePriceListDto } from "@/dtos/price-list.dto";


const API_URL = `${backendApi}/api/config/price-list`;

export const getAllPriceListService = async (
    token: string,
    tenantId: string,
    params?: ParamsGetDto
) => {
    return getAllApiRequest(
        API_URL,
        token,
        tenantId,
        'Failed to fetch price list',
        params
    );
};

export const getPriceListByIdService = async (
    token: string,
    tenantId: string,
    id: string
) => {
    const API_URL_BY_ID = `${API_URL}/${id}`;
    return getByIdApiRequest(
        API_URL_BY_ID,
        token,
        tenantId,
        'Failed to fetch price list'
    );
};

export const createPriceListService = async (
    token: string,
    tenantId: string,
    data: CreatePriceListDto
) => {
    return postApiRequest(
        API_URL,
        token,
        tenantId,
        data,
        'Failed to create price list'
    );
};


export const updatePriceListService = async (
    token: string,
    tenantId: string,
    id: string,
    data: UpdatePriceListDto
) => {
    const API_URL_BY_ID = `${API_URL}/${id}`;
    return updateApiRequest(
        API_URL_BY_ID,
        token,
        tenantId,
        data,
        'Failed to update price list',
        'PUT'
    );
};

export const deletePriceListService = async (
    token: string,
    tenantId: string,
    id: string
) => {
    const API_URL_BY_ID = `${API_URL}/${id}`;
    return deleteApiRequest(
        API_URL_BY_ID,
        token,
        tenantId,
        'Failed to delete price list'
    );
};
