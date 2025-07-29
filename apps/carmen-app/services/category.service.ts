import { CategoryDto } from "@/dtos/category.dto";
import { backendApi } from "@/lib/backend-api";

export const getCategoryService = async (token: string, tenantId: string, params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: string;
}) => {

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);

    const response = await fetch(`${backendApi}/api/config/products/category?${queryParams.toString()}`, {
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

export const createCategoryService = async (token: string, tenantId: string, category: CategoryDto) => {
    const response = await fetch(`${backendApi}/api/config/products/category`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
    });
    const data = await response.json();
    return data;
}

export const updateCategoryService = async (token: string, tenantId: string, category: CategoryDto) => {
    const response = await fetch(`${backendApi}/api/config/products/category/${category.id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
    });
    const data = await response.json();
    return data;
}


export const deleteCategoryService = async (token: string, tenantId: string, categoryId: string) => {
    const response = await fetch(`${backendApi}/api/config/products/category/${categoryId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
}


