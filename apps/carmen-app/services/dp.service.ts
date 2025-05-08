import { backendApi } from "@/lib/backend-api";
import { DeliveryPointDto } from "@/dtos/config.dto";
import axios from "axios";
import { requestHeaders } from "@/lib/config.api";

const API_URL = `${backendApi}/api/config/delivery-point`;

export const getAllDeliveryPoints = async (
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
        console.log('error', error);
        return error;
    }
}

export const createDeliveryPoint = async (token: string, tenantId: string, deliveryPoint: DeliveryPointDto) => {
    try {
        const response = await axios.post(API_URL, deliveryPoint, {
            headers: requestHeaders(token, tenantId)
        });
        return response.data;
    } catch (error) {
        console.log('error', error);
        throw error;
    }
}

export const updateDeliveryPoint = async (token: string, tenantId: string, deliveryPoint: DeliveryPointDto) => {
    try {
        const response = await axios.patch(`${API_URL}/${deliveryPoint.id}`, deliveryPoint, {
            headers: requestHeaders(token, tenantId)
        });
        return response.data;
    } catch (error) {
        console.log('error', error);
        throw error;
    }
}

export const inactiveDeliveryPoint = async (token: string, tenantId: string, deliveryPoint: DeliveryPointDto) => {
    try {
        const response = await axios.put(`${API_URL}/${deliveryPoint.id}`,
            { ...deliveryPoint, is_active: !deliveryPoint.is_active },
            { headers: requestHeaders(token, tenantId) }
        );
        return response.data;
    } catch (error) {
        console.log('error', error);
        throw error;
    }
}

