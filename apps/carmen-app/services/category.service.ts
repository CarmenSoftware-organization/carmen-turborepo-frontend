import { CategoryDto } from "@/dtos/category.dto";
import { backendApi } from "@/lib/backend-api";

export const getCategoryService = async (token: string, tenantId: string) => {
    const response = await fetch(`${backendApi}/api/config/products/category`, {
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


