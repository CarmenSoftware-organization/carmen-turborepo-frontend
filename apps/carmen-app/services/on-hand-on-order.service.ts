import { backendApi } from "@/lib/backend-api";

export const getOnHandOnOrderService = async (token: string, buCode: string, locationId: string, productId: string) => {
    if (!token || !buCode || !locationId || !productId) {
        console.error("Authorization token, tenant ID, location ID, and product ID are required");
        return null;
    }

    try {
        const API_URL = `${backendApi}/api/locations/${locationId}/product/${productId}/inventory`;
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-tenant-id': buCode,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching on-hand-on-order:', error);
        throw error;
    }
}

