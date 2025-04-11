import { ProductFormDto } from "@/dtos/product.dto";
import { backendApi } from "@/lib/backend-api";
export const getProductService = async (accessToken: string, tenantId: string, params: {
    search?: string;
    page?: string;
    perPage?: string;
    sort?: string;
}) => {
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

    const url = `${backendApi}/api/config/products?${query}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "x-tenant-id": tenantId
        },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

export const getProductIdService = async (accessToken: string, tenantId: string, id: string) => {
    const url = `${backendApi}/api/config/products/${id}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "x-tenant-id": tenantId
        },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

export const createProductService = async (accessToken: string, tenantId: string, product: any) => {
    const url = `${backendApi}/api/config/products`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "x-tenant-id": tenantId
        },
        body: JSON.stringify(product)
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

export const updateProductService = async (accessToken: string, tenantId: string, id: string, product: any) => {
    const url = `${backendApi}/api/config/products/${id}`;
    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "x-tenant-id": tenantId
        },
        body: JSON.stringify(product)
    };
    const response = await fetch(url, options);
    const data = await response.json();
    console.log("update response data", data);
    return data;
}

