import { backendApi } from "@/lib/backend-api";

export const getProductService = async (accessToken: string, tenantId: string, params: {
    search?: string;
    page?: string;
    perPage?: string;
    sort?: string;
    filter?: string;
}) => {

    if (!accessToken || !tenantId) {
        throw new Error("Authorization token and tenant ID are required");
    }

    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, String(value));
        }
    });

    const queryString = query.toString();

    const url = queryString
        ? `${backendApi}/api/config/products?${queryString}`
        : `${backendApi}/api/config/products`;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // Check if response was not successful
    if (!response.ok) {
        return {
            error: true,
            status: response.status,
            message: data.message ?? `Error creating product: ${response.statusText}`,
            data: null
        };
    }

    return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    if (!response.ok) {
        return {
            error: true,
            status: response.status,
            message: data.message ?? `Error updating product: ${response.statusText}`,
            data: null
        };
    }
    return data;
}

export const deleteProductService = async (token: string, tenantId: string, id: string) => {
    if (!token || !tenantId || !id) {
        throw new Error("Authorization token, tenant ID, and product ID are required");
    }

    const url = `${backendApi}/api/config/products/${id}`;
    const options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "x-tenant-id": tenantId
        },
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            return {
                error: true,
                status: response.status,
                message: data.message ?? `Error deleting product: ${response.statusText}`,
                data: null
            };
        }

        return data;
    } catch (error) {
        console.error('Error deleting product:', error);
        return {
            error: true,
            status: 500,
            message: 'Error deleting product',
            data: null
        };
    }
}

export const getCategoryListByItemGroup = async (accessToken: string, tenantId: string, id: string) => {
    const url = `${backendApi}/api/config/products/item-group/${id}`;
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
    console.log('data', data);

    return data;
}

