import { backendApi } from "@/lib/backend-api";
import { DeliveryPointDto } from "@/dtos/config.dto";

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
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            query.append(key, String(value));
        }
    });

    const queryString = query.toString();

    const url = queryString
        ? `${backendApi}/api/config/delivery-point?${queryString}`
        : `${backendApi}/api/config/delivery-point`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

export const createDeliveryPoint = async (token: string, tenantId: string, deliveryPoint: DeliveryPointDto) => {
    const url = `${backendApi}/api/config/delivery-point`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(deliveryPoint),
    });
    const data = await response.json();
    return data;
}

export const updateDeliveryPoint = async (token: string, tenantId: string, deliveryPoint: DeliveryPointDto) => {
    const url = `${backendApi}/api/config/delivery-point/${deliveryPoint.id}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(deliveryPoint),
    });
    const data = await response.json();
    console.log('data', data);
    return data;
}

export const inactiveDeliveryPoint = async (token: string, tenantId: string, deliveryPoint: DeliveryPointDto) => {
    const url = `${backendApi}/api/config/delivery-point/${deliveryPoint.id}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...deliveryPoint, is_active: !deliveryPoint.is_active }),
    });
    const data = await response.json();
    console.log('data', data);
    return data;
}

