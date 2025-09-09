import { useMutation, useQuery } from "@tanstack/react-query";
import { ParamsGetDto } from "@/dtos/param.dto";
import { ActionPr, PurchaseRequestCreateFormDto, PurchaseRequestUpdateFormDto } from "@/dtos/purchase-request.dto";
import { backendApi } from "@/lib/backend-api";
import { getAllApiRequest, postApiRequest, updateApiRequest, getByIdApiRequest } from "@/lib/config.api";

const purchaseRequestApiUrl = (buCode: string, id?: string, action?: string) => {
    const baseUrl = `${backendApi}/api/config/${buCode}/purchase-request`;
    return id ? `${baseUrl}/${id}/${action}` : `${baseUrl}`;
};

export const usePurchaseRequest = (
    token: string,
    buCode: string,
    params?: ParamsGetDto
) => {

    const API_URL = purchaseRequestApiUrl(buCode);
    const { data, isLoading, error } = useQuery({
        queryKey: ["purchase-request", buCode, params],
        queryFn: async () => {
            try {
                const result = await getAllApiRequest(
                    API_URL,
                    token,
                    "Error fetching products",
                    params
                );
                return result;
            } catch (error) {
                console.log('error', error);
                throw error;
            }
        },
        enabled: !!token && !!buCode,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return { data, isLoading, error };
};

export const usePurchaseRequestById = (token: string, buCode: string, id: string) => {
    const API_URL = purchaseRequestApiUrl(buCode, id);
    const { data, isLoading, error } = useQuery({
        queryKey: ["purchase-request", buCode, id],
        queryFn: async () => {
            return await getByIdApiRequest(API_URL, token, "Error fetching purchase request");
        },
        enabled: !!token && !!buCode && !!id,
    });
    const purchaseRequest = data;
    return { purchaseRequest, isLoading, error };
};


export const usePrMutation = (token: string, buCode: string) => {
    const API_URL = purchaseRequestApiUrl(buCode);

    return useMutation({
        mutationFn: async (data: PurchaseRequestCreateFormDto) => {
            return await postApiRequest(
                API_URL,
                token,
                data,
                "Error creating PR"
            );
        },
    });
};

export const useUpdateUPr = (token: string, buCode: string, id: string, action: ActionPr) => {
    const API_URL_BY_ID = purchaseRequestApiUrl(buCode, id, action);

    return useMutation({
        mutationFn: async (data: PurchaseRequestUpdateFormDto) => {
            return await updateApiRequest(
                API_URL_BY_ID,
                token,
                data,
                "Error updating PR",
                "PATCH"
            );
        },
    });
};