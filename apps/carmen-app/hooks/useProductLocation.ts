import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import { getAllApiRequest } from "@/lib/config.api";
import { useQuery } from "@tanstack/react-query";


export const useProductLocation = (
    token: string,
    tenantId: string,
    id: string,
    params?: ParamsGetDto
) => {
    const API_URL = `${backendApi}/api/products/locations/${id}`;

    const { data, isLoading, error } = useQuery({
        queryKey: ["product-location", tenantId, id],
        queryFn: async () => {
            if (!token || !tenantId) {
                throw new Error("Unauthorized: Missing token or tenantId");
            }
            return await getAllApiRequest(
                API_URL,
                token,
                tenantId,
                "Error fetching product location",
                params
            );
        },
        enabled: !!token && !!tenantId && !!id,
    });

    const productLocation = data;
    const inventoryUnit = productLocation?.data?.data.inventory_unit;

    console.log('productLocation', productLocation);


    return {
        productLocation,
        inventoryUnit,
        isLoading,
        error,
    };
};
