import { backendApi } from "@/lib/backend-api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useOnHandOrder = (
    token: string,
    tenantId: string,
    locationId: string,
    productId: string
) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["on-hand-order", tenantId, locationId, productId],
        queryFn: async () => {
            const API_URL = `${backendApi}/api/locations/${locationId}/product/${productId}/inventory`;

            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Tenant-Id": tenantId,
                },
            });

            return response.data;
        },
    });

    return { data, isLoading, error };
};