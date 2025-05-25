import { ParamsGetDto } from "@/dtos/param.dto";
import { requestHeaders } from "@/lib/config.api";
import axios from "axios";

export const getAllApiRequest = async (
    api_url: string,
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
        const fullUrl = queryString ? `${api_url}?${queryString}` : api_url;

        const response = await axios.get(fullUrl, {
            headers: requestHeaders(token, tenantId)
        });

        return response.data
    } catch (error) {
        console.error(`${errorContext}:`, error);
        return error;
    }
};