import { useMutation, useQuery } from "@tanstack/react-query";
import {
    createPriceListService,
    deletePriceListService,
    getAllPriceListService,
    getPriceListByIdService,
    updatePriceListService
} from "@/services/price-list.service";
import { ParamsGetDto } from "@/dtos/param.dto";
import { CreatePriceListDto, UpdatePriceListDto } from "@/dtos/price-list.dto";

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

export const useCreatePriceList = (
    token: string,
    tenantId: string
) => {
    return useMutation({
        mutationFn: async (dataPriceList: CreatePriceListDto) => {
            return await createPriceListService(token, tenantId, dataPriceList);
        },
    });
}

export const useUpdatePriceList = (
    token: string,
    tenantId: string,
    id: string,
    dataPriceList: UpdatePriceListDto
) => {
    const { data, error, isPending } = useMutation({
        mutationFn: async () => {
            return await updatePriceListService(token, tenantId, id, dataPriceList);
        },
    });

    return { data, error, isPending };
};


export const useDeletePriceList = (
    token: string,
    tenantId: string
) => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await deletePriceListService(token, tenantId, id);
        },
    });
}
