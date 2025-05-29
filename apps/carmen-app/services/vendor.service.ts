import { ParamsGetDto } from "@/dtos/param.dto";
import { VendorFormValues } from "@/dtos/vendor.dto";
import { backendApi } from "@/lib/backend-api";
import { getAllApiRequest, getByIdApiRequest } from "@/lib/config.api";
const API_URL = `${backendApi}/api/config/vendors`;

export const getAllVendorService = async (
    token: string,
    tenantId: string,
    params: ParamsGetDto
) => {
    return getAllApiRequest(
        API_URL,
        token,
        tenantId,
        'Failed to fetch vendors',
        params
    );
}


export const getVendorIdService = async (
    token: string,
    tenantId: string,
    id: string
) => {
    return getByIdApiRequest(
        `${API_URL}/${id}`,
        token,
        tenantId,
        'Failed to fetch vendor'
    );
}
export const createVendorService = async (token: string, tenantId: string, vendor: VendorFormValues) => {

    try {
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
    } catch (error) {
        console.error('Failed to create vendor:', error);
        return { success: false, message: 'Failed to create vendor' };
    }
};


export const updateVendorService = async (token: string, tenantId: string, vendor: VendorFormValues) => {
    try {
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
    } catch (error) {
        console.error('Failed to update vendor:', error);
        return { success: false, message: 'Failed to update vendor' };
    }
};

export const deleteVendorService = async (token: string, tenantId: string, id: string) => {
    try {
        const url = `${backendApi}/api/config/vendors/${id}`;
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
        }
    } catch (error) {
        console.error('Failed to delete vendor:', error);
        return false;
    }
};
