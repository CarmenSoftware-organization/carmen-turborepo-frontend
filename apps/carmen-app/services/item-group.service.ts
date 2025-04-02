import { ItemGroupDto } from "@/dtos/category.dto";
import { backendApi } from "@/lib/backend-api";

export const getItemGroupService = async (token: string, tenantId: string) => {
    const response = await fetch(`${backendApi}/api/config/product-item-group`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
}

export const createItemGroupService = async (token: string, tenantId: string, data: ItemGroupDto) => {
    const response = await fetch(`${backendApi}/api/config/product-item-group`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
}

export const updateItemGroupService = async (token: string, tenantId: string, data: ItemGroupDto) => {
    const response = await fetch(`${backendApi}/api/config/product-item-group/${data.id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
}

export const deleteItemGroupService = async (token: string, tenantId: string, id: string) => {
    const response = await fetch(`${backendApi}/api/config/product-item-group/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
    });
    const result = await response.json();
    return result;
}




