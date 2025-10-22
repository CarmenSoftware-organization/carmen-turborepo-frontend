import { SubCategoryDto } from "@/dtos/category.dto";
import { backendApi } from "@/lib/backend-api";

export const getSubCategoryService = async (token: string, buCode: string) => {
    const response = await fetch(`${backendApi}/api/config/${buCode}/products/sub-category?perpage=999`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
}

export const createSubCategoryService = async (token: string, buCode: string, data: SubCategoryDto) => {
    const response = await fetch(`${backendApi}/api/config/${buCode}/products/sub-category`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
}

export const updateSubCategoryService = async (token: string, buCode: string, data: SubCategoryDto) => {
    const response = await fetch(`${backendApi}/api/config/${buCode}/products/sub-category/${data.id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
}

export const deleteSubCategoryService = async (token: string, buCode: string, id: string) => {

    console.log('result id', id);

    const response = await fetch(`${backendApi}/api/config/${buCode}/products/sub-category/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    try {
        const result = await response.json();
        return { statusCode: response.status, ...result };
    } catch (error) {
        if (response.ok) {
            return { statusCode: response.status, data: null };
        }
        throw error;
    }
}




