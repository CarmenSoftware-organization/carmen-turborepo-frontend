import { getAllApiRequest, getByIdApiRequest } from "@/lib/config.api";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";


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