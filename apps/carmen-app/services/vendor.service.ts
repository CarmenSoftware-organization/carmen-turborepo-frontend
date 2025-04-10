import { VendorDto, VendorFormDto } from "@/dtos/vendor-management";
import { backendApi } from "@/lib/backend-api";


export const getAllVendorService = async (token: string, tenantId: string,
    params: {
        search?: string;
        page?: string;
        perPage?: string;
        sort?: string;
    } = {}
) => {
    const query = new URLSearchParams();

    if (params.search) {
        query.append('search', params.search);
    }

    if (params.page) {
        query.append('page', params.page);
    }

    if (params.perPage) {
        query.append('perPage', params.perPage);
    }

    if (params.sort) {
        query.append('sort', params.sort);
    }

    const url = `${backendApi}/api/config/vendors?${query}`;
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


export const updateVendorService = async (token: string, tenantId: string, vendor: VendorDto) => {
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

export const deleteVendorService = async (token: string, tenantId: string, vendor: VendorDto) => {
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
