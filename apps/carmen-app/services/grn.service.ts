import { backendApi } from "@/lib/backend-api";
import axios, { AxiosError } from "axios";
import { requestHeaders } from "@/lib/config.api";

const API_URL = `${backendApi}/api/good-received-note`;

export const getGrn = async (
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

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 401) {
            // Return specific error object for 401 errors
            return {
                status: 401,
                message: "Unauthorized - Your session may have expired. Please login again.",
                isAuthError: true,
            };
        }

        console.log('error', error);
        return {
            status: axiosError.response?.status ?? 500,
            message: axiosError.message ?? "An unknown error occurred",
            error: axiosError
        };
    }
};
