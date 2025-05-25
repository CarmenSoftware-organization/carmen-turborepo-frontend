import axios from "axios";
import { requestHeaders } from "@/lib/config.api";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";

const API_URL = `${backendApi}/api/config/locations`;

export const getAllLocations = async (
    token: string,
    tenantId: string,
    params: ParamsGetDto
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
        return error;
    }
}