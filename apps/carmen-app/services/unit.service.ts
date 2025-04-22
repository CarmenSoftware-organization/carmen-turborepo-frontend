import { UnitDto } from "@/dtos/unit.dto";
import { backendApi } from "@/lib/backend-api";

export const getAllUnits = async (token: string, tenantId: string,
    params: {
        search?: string;
        page?: string;
        perPage?: string;
        sort?: string;
        filter?: string;
    } = {}
) => {
    // Ensure token and tenantId are present
    if (!token || !tenantId) {
        throw new Error("Authorization token and tenant ID are required");
    }

    const query = new URLSearchParams();

    // Sanitize parameters by filtering out undefined, null, or empty values
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, String(value));
        }
    });

    const queryString = query.toString();

    const url = queryString
        ? `${backendApi}/api/config/units?${queryString}`
        : `${backendApi}/api/config/units`;

    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            if (response.status === 400) {
                console.error('Bad Request: Invalid parameters for API call');
                // Return empty result with proper structure to prevent UI errors
                return { data: [], paginate: { pages: 0, total: 0 } };
            }
            throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching units:', error);
        // Return empty result with proper structure to prevent UI errors
        return { data: [], paginate: { pages: 0, total: 0 } };
    }
};

export const createUnit = async (token: string, tenantId: string, unit: UnitDto) => {
    const url = `${backendApi}/api/config/units`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(unit),
    });
    const data = await response.json();
    return data;
};

export const updateUnit = async (token: string, tenantId: string, unit: UnitDto) => {
    const url = `${backendApi}/api/config/units/${unit.id}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(unit),
    });
    const data = await response.json();
    return data;
};

export const deleteUnit = async (token: string, tenantId: string, unit: UnitDto) => {
    const url = `${backendApi}/api/config/units/${unit.id}`;
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

