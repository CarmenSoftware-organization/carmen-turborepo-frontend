import { useQuery } from "@tanstack/react-query";
import { getAllPriceListService, getPriceListByIdService } from "@/services/price-list.service";
import { ParamsGetDto } from "@/dtos/param.dto";

export const usePriceList = (
    token: string,
    tenantId: string,
    params?: ParamsGetDto
) => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["price-list", tenantId, params],
        queryFn: async () => {
            if (!token || !tenantId) {
                throw new Error('Unauthorized: Missing token or tenantId');
            }
            return await getAllPriceListService(token, tenantId, params ?? {});
        },
        enabled: !!token && !!tenantId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const isUnauthorized = error instanceof Error && error.message.includes('Unauthorized');
    return { data, isLoading, error, isUnauthorized };
};

export const usePriceListById = (
    token: string,
    tenantId: string,
    id: string
) => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["price-list", tenantId, id],
        queryFn: async () => {
            if (!token || !tenantId) {
                throw new Error('Unauthorized: Missing token or tenantId');
            }
            return await getPriceListByIdService(token, tenantId, id);
        },
        enabled: !!token && !!tenantId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const isUnauthorized = error instanceof Error && error.message.includes('Unauthorized');

    return { data, isLoading, error, isUnauthorized };
}