import { backendApi } from "@/lib/backend-api";

export const getProductService = async (accessToken: string, buCode: string, params: {
    search?: string;
    page?: number | string;
    perpage?: number | string;
    sort?: string;
    filter?: string;
}) => {

    if (!accessToken || !buCode) {
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
        ? `${backendApi}/api/config/${buCode}/products?${queryString}`
        : `${backendApi}/api/config/${buCode}/products`;

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

export const getProductIdService = async (accessToken: string, buCode: string, id: string) => {
    const url = `${backendApi}/api/config/${buCode}/products/${id}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createProductService = async (accessToken: string, buCode: string, product: any) => {
    const url = `${backendApi}/api/config/${buCode}/products`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(product)
    };
    const response = await fetch(url, options);
    const data = await response.json();

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
export const updateProductService = async (accessToken: string, buCode: string, id: string, product: any) => {
    const url = `${backendApi}/api/config/${buCode}/products/${id}`;
    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
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

export const deleteProductService = async (token: string, buCode: string, id: string) => {
    if (!token || !buCode || !id) {
        throw new Error("Authorization token, tenant ID, and product ID are required");
    }

    const url = `${backendApi}/api/config/${buCode}/products/${id}`;
    const options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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

export const getCategoryListByItemGroup = async (accessToken: string, buCode: string, id: string) => {
    const url = `${backendApi}/api/config/${buCode}/products/item-group/${id}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

