import { CreateStoreLocationDto } from "@/dtos/config.dto";
import { backendApi } from "@/lib/backend-api";

export const getAllStoreLocations = async (token: string, tenantId: string,
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

    const url = `${backendApi}/api/config/locations?${query.toString()}`;
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

export const createStoreLocation = async (token: string, tenantId: string, storeLocation: CreateStoreLocationDto) => {
    const url = `${backendApi}/api/config/locations`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeLocation),
    });
    const data = await response.json();
    console.log('data', data);
    return data;
}

export const updateStoreLocation = async (token: string, tenantId: string, storeLocation: CreateStoreLocationDto & { id: string }) => {
    const url = `${backendApi}/api/config/locations/${storeLocation.id}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeLocation),
    });
    const data = await response.json();
    return data;
};

export const deleteStoreLocation = async (token: string, tenantId: string, id: string) => {
    const url = `${backendApi}/api/config/locations/${id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        return true;
    }
    return false;
};

