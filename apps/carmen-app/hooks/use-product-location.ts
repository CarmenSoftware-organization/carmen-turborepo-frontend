import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import { getAllApiRequest } from "@/lib/config.api";
import { useQuery } from "@tanstack/react-query";

export const useProductLocation = (
    token: string,
    buCode: string,
    id: string,
    params?: ParamsGetDto
) => {
    const API_URL = `${backendApi}/api/${buCode}/products/locations/${id}`
    const { data, isLoading, error } = useQuery({
        queryKey: ["product-location", buCode, id],
        queryFn: async () => {
            if (!token || !buCode) {
                throw new Error("Unauthorized: Missing token or buCode");
            }
            return await getAllApiRequest(
                API_URL,
                token,
                "Error fetching product location",
                params
            );
        },
        enabled: !!token && !!buCode && !!id,
    });

    const productLocation = data;
    const inventoryUnit = productLocation?.data?.data.inventory_unit;

    return {
        productLocation,
        inventoryUnit,
        isLoading,
        error,
    };
};
