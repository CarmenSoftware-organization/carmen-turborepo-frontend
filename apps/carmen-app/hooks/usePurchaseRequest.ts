import { useMutation, useQuery } from "@tanstack/react-query";
import { ParamsGetDto } from "@/dtos/param.dto";
import { getAllPrService, getPrByIdService } from "@/services/pr.service";
import { PurchaseRequestCreateFormDto, PurchaseRequestUpdateFormDto } from "@/dtos/purchase-request.dto";
import { backendApi } from "@/lib/backend-api";
import { postApiRequest, updateApiRequest } from "@/lib/config.api";

const API_URL = `${backendApi}/api/purchase-request`;


export const usePurchaseRequest = (
    token: string,
    tenantId: string,
    params?: ParamsGetDto
) => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["purchase-request", tenantId, params],
        queryFn: async () => {
            if (!token || !tenantId) {
                throw new Error('Unauthorized: Missing token or tenantId');
            }
            return await getAllPrService(token, tenantId, params ?? {});
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
            return await getPrByIdService(token, tenantId, id);
        },
        enabled: !!token && !!tenantId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const isUnauthorized = error instanceof Error && error.message.includes('Unauthorized');

    return { data, isLoading, error, isUnauthorized };
}

export const usePrMutation = (token: string, tenantId: string) => {
    return useMutation({
        mutationFn: async (data: PurchaseRequestCreateFormDto) => {
            return await postApiRequest(
                API_URL,
                token,
                tenantId,
                data,
                "Error creating PR"
            );
        },
    });
};

export const useUpdateUPr = (token: string, tenantId: string, id: string) => {
    const API_URL_BY_ID = `${API_URL}/${id}`;
    return useMutation({
        mutationFn: async (data: PurchaseRequestUpdateFormDto) => {
            return await updateApiRequest(
                API_URL_BY_ID,
                token,
                tenantId,
                data,
                "Error updating PR",
                "PUT"
            );
        },
    });
};