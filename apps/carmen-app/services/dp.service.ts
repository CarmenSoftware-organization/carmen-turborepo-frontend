import { backendApi } from "@/lib/backend-api";
import { DeliveryPointDto } from "@/dtos/config.dto";
import axios from "axios";
import { getAllApiRequest, requestHeaders } from "@/lib/config.api";
import { ParamsGetDto } from "@/dtos/param.dto";

const API_URL = `${backendApi}/api/config/delivery-point`;

export const getAllDeliveryPoints = async (
    token: string,
    tenantId: string,
    params: ParamsGetDto
) => {
    return getAllApiRequest(
        API_URL,
        token,
        tenantId,
        params,
        'Failed to fetch delivery points'
    );
};

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

