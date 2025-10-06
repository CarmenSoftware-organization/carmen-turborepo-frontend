import { backendApi } from "@/lib/backend-api";
import axios from "axios";
import { getAllApiRequest, requestHeaders } from "@/lib/config.api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { DeliveryPointCreateDto, DeliveryPointUpdateDto } from "@/dtos/delivery-point.dto";

const API_URL = `${backendApi}/api/config/delivery-point`;

export const getAllDeliveryPoints = async (
    token: string,
    buCode: string,
    params: ParamsGetDto
) => {
    return getAllApiRequest(
        API_URL,
        token,
        'Failed to fetch delivery points',
        params
    );
};

export const createDeliveryPoint = async (token: string, deliveryPoint: DeliveryPointCreateDto) => {
    try {
        const response = await axios.post(API_URL, deliveryPoint, {
            headers: requestHeaders(token)
        });
        return response.data;
    } catch (error) {
        console.log('error', error);
        throw error;
    }
}

export const updateDeliveryPoint = async (token: string, deliveryPoint: DeliveryPointUpdateDto) => {
    try {
        const response = await axios.patch(`${API_URL}/${deliveryPoint.id}`, deliveryPoint, {
            headers: requestHeaders(token)
        });
        return response.data;
    } catch (error) {
        console.log('error', error);
        throw error;
    }
}

export const inactiveDeliveryPoint = async (token: string, deliveryPoint: DeliveryPointUpdateDto) => {
    try {
        const response = await axios.put(`${API_URL}/${deliveryPoint.id}`,
            { ...deliveryPoint, is_active: !deliveryPoint.is_active },
            { headers: requestHeaders(token) }
        );
        return response.data;
    } catch (error) {
        console.log('error', error);
        throw error;
    }
}

