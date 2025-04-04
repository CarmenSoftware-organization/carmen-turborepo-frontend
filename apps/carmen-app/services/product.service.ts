import { ProductFormDto } from "@/dtos/product.dto";
import { backendApi } from "@/lib/backend-api";
export const getProductService = async (accessToken: string, tenantId: string) => {
    const url = `${backendApi}/api/config/products`;
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

export const createProductService = async (accessToken: string, tenantId: string, product: ProductFormDto) => {
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

