import { VendorFormDto } from "@/dtos/vendor-management";
import { backendApi } from "@/lib/backend-api";


export const getAllVendorService = async (token: string, tenantId: string,
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

        const url = queryString
            ? `${backendApi}/api/config/vendors?${queryString}`
            : `${backendApi}/api/config/vendors`;

        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-tenant-id': tenantId,
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch vendors:', error);
    }
}

export const getVendorIdService = async (token: string, tenantId: string, id: string) => {
    const url = `${backendApi}/api/config/vendors/${id}`;
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}



export const createVendorService = async (token: string, tenantId: string, vendor: VendorFormDto) => {
    const url = `${backendApi}/api/config/vendors`;
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendor),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
};


export const updateVendorService = async (token: string, tenantId: string, vendor: VendorFormDto) => {
    const url = `${backendApi}/api/config/vendors/${vendor.id}`;
    const options = {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendor),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
};

export const deleteVendorService = async (token: string, tenantId: string, vendor: VendorFormDto) => {
    const url = `${backendApi}/api/config/vendors/${vendor.id}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
    };
    const response = await fetch(url, options);
    if (response.ok) {
        return true;
    } else {
        return false;
    };
};
