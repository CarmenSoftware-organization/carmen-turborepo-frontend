import { useMutation, useQuery } from "@tanstack/react-query";
import { ParamsGetDto } from "@/dtos/param.dto";
import { ActionPr, PurchaseRequestCreateFormDto, PurchaseRequestUpdateFormDto } from "@/dtos/purchase-request.dto";
import { backendApi } from "@/lib/backend-api";
import { postApiRequest, updateApiRequest, getByIdApiRequest } from "@/lib/config.api";
import axios from "axios";

export const usePurchaseRequest = (
    token: string,
    buCode: string,
    params?: ParamsGetDto
) => {

    const API_URL = `${backendApi}/api/purchase-request?bu_code=${buCode}`;

    const query = new URLSearchParams();

    Object.entries(params ?? {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, String(value));
        }
    });

    const queryString = query.toString();
    const URL = queryString ? `${API_URL}&${queryString}` : API_URL;

    const { data, isLoading, error } = useQuery({
        queryKey: ["purchase-request", buCode, params],
        queryFn: async () => {
            try {
                const res = await axios.get(URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                return res.data;
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
    const API_URL_ID = `${backendApi}/api/${buCode}/purchase-request/${id}`;

    const { data, isLoading, error } = useQuery({
        queryKey: ["purchase-request", buCode, id],
        queryFn: async () => {
            return await getByIdApiRequest(API_URL_ID, token, "Error fetching purchase request");
        },
        enabled: !!token && !!buCode && !!id,
    });
    const purchaseRequest = data;
    return { purchaseRequest, isLoading, error };
};


export const usePrMutation = (token: string, buCode: string) => {
    const API_URL = `${backendApi}/api/${buCode}/purchase-request`;
    return useMutation({
        mutationFn: async (data: PurchaseRequestCreateFormDto | { state_role: string; body: PurchaseRequestCreateFormDto }) => {
            const requestData = 'body' in data ? data.body : data;
            return await postApiRequest(
                API_URL,
                token,
                requestData,
                "Error creating PR"
            );
        },
    });
};

export const useUpdateUPr = (token: string, buCode: string, id: string, action: ActionPr) => {
    const API_URL_ID = `${backendApi}/api/${buCode}/purchase-request/${id}/${action}`;
    return useMutation({
        mutationFn: async (data: PurchaseRequestUpdateFormDto) => {
            return await updateApiRequest(
                API_URL_ID,
                token,
                data,
                "Error updating PR",
                "PATCH"
            );
        },
    });
};