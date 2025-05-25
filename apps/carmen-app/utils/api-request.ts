import { ParamsGetDto } from "@/dtos/param.dto";
import { requestHeaders } from "@/lib/config.api";
import axios from "axios";

export const getAllApiRequest = async (
    API_URL: string,
    token: string,
    tenantId: string,
    params: ParamsGetDto,
    errorContext: string
) => {
    try {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.append(key, String(value));
            }
        });

        const queryString = query.toString();
        const URL = queryString ? `${API_URL}?${queryString}` : API_URL;

        const response = await axios.get(URL, {
            headers: requestHeaders(token, tenantId)
        });

        return response.data
    } catch (error) {
        console.error(`${errorContext}:`, error);
        return error;
    }
};

export const postApiRequest = async <T = unknown, R = unknown>(
    API_URL: string,
    token: string,
    tenantId: string,
    data: T,
    errorContext: string
) => {
    try {
        const response = await axios.post<R>(API_URL, data, {
            headers: requestHeaders(token, tenantId)
        });

        return response.data;
    } catch (error) {
        console.error(`${errorContext}:`, error);
        return error;
    }
};

