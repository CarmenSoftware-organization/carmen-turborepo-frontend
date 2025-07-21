import { ItemGroupDto } from "@/dtos/category.dto";
import { backendApi } from "@/lib/backend-api";

export const getItemGroupService = async (token: string, tenantId: string) => {
    // Ensure token and tenantId are present
    if (!token || !tenantId) {
        console.error("Authorization token and tenant ID are required");
        return { data: [] };
    }

    try {
        const response = await fetch(`${backendApi}/api/config/products/item-group`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-tenant-id': tenantId,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 400) {
                console.error('Bad Request: Invalid parameters for API call');
                return { data: [] };
            }
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching item groups:', error);
        return { data: [] };
    }
}

export const createItemGroupService = async (token: string, tenantId: string, data: ItemGroupDto) => {
    if (!token || !tenantId) {
        console.error("Authorization token and tenant ID are required");
        return null;
    }

    try {
        const response = await fetch(`${backendApi}/api/config/products/item-group`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-tenant-id': tenantId,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating item group:', error);
        return null;
    }
}

export const updateItemGroupService = async (token: string, tenantId: string, data: ItemGroupDto) => {
    if (!token || !tenantId || !data.id) {
        console.error("Authorization token, tenant ID, and item group ID are required");
        return null;
    }

    try {
        const response = await fetch(`${backendApi}/api/config/products/item-group/${data.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-tenant-id': tenantId,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating item group:', error);
        return null;
    }
}

export const deleteItemGroupService = async (token: string, tenantId: string, id: string) => {
    if (!token || !tenantId || !id) {
        console.error("Authorization token, tenant ID, and item group ID are required");
        return null;
    }

    try {
        const response = await fetch(`${backendApi}/api/config/products/item-group/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-tenant-id': tenantId,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting item group:', error);
        return null;
    }
}





