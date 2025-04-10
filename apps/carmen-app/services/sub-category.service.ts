import { SubCategoryDto } from "@/dtos/category.dto";
import { backendApi } from "@/lib/backend-api";

export const getSubCategoryService = async (token: string, tenantId: string) => {
    const response = await fetch(`${backendApi}/api/config/product/sub-category`, {
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

export const createSubCategoryService = async (token: string, tenantId: string, data: SubCategoryDto) => {
    console.log('service create sub category', data);
    const response = await fetch(`${backendApi}/api/config/product/sub-category`, {
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

export const updateSubCategoryService = async (token: string, tenantId: string, data: SubCategoryDto) => {
    const response = await fetch(`${backendApi}/api/config/product/sub-category/${data.id}`, {
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

export const deleteSubCategoryService = async (token: string, tenantId: string, id: string) => {
    const response = await fetch(`${backendApi}/api/config/product/sub-category/${id}`, {
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




