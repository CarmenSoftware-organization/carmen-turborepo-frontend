import { getAllApiRequest, getByIdApiRequest } from "@/lib/config.api";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";

const API_URL = `${backendApi}/api/config/locations`;

export const getAllLocations = async (
    token: string,
    tenantId: string,
    params: ParamsGetDto
) => {
    return getAllApiRequest(
        API_URL,
        token,
        'Failed to fetch locations',
        params
    );
};

export const getLocationByIdService = async (
    token: string,
    tenantId: string,
    id: string
) => {
    return getByIdApiRequest(
        `${API_URL}/${id}`,
        token,
        'Failed to fetch location'
    );
};
