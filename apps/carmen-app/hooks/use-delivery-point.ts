import { useMutation, useQuery } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { deleteApiRequest, getAllApiRequest, postApiRequest, updateApiRequest } from "@/lib/config.api";
import { useCallback } from "react";
import { DeliveryPointCreateDto, DeliveryPointGetDto, DeliveryPointUpdateDto } from "@/dtos/delivery-point.dto";

const API_URL = `${backendApi}/api/config/delivery-point`;

export const useDeliveryPointQuery = ({
    token,
    tenantId,
    params
}: {
    token: string;
    tenantId: string;
    params?: ParamsGetDto;
}) => {
    console.log('🔍 useDeliveryPointQuery called with:', {
        token: token ? `${token.substring(0, 10)}...` : 'empty',
        tenantId,
        params
    });
    console.log('🔍 API_URL:', API_URL);
    console.log('🔍 backendApi:', backendApi);

    const { data, isLoading, error } = useQuery({
        queryKey: ["delivery-point", tenantId, params],
        queryFn: async () => {
            console.log('🚀 queryFn executing...');
            console.log('🚀 Token check:', { hasToken: !!token, tokenLength: token?.length });
            console.log('🚀 TenantId check:', { hasTenantId: !!tenantId, tenantId });

            if (!token || !tenantId) {
                console.error('❌ Missing token or tenantId:', {
                    hasToken: !!token,
                    hasTenantId: !!tenantId,
                    tokenLength: token?.length,
                    tenantId
                });
                throw new Error("Unauthorized");
            }

            try {
                const result = await getAllApiRequest(
                    API_URL,
                    token,
                    tenantId,
                    "Error fetching delivery point",
                    params
                );
                console.log('✅ API response:', result);
                return result;
            } catch (error) {
                console.error('❌ API error:', error);
                throw error;
            }
        },
        enabled: !!token && !!tenantId,
    });

    console.log('📊 Query state:', {
        data,
        isLoading,
        error,
        enabled: !!token && !!tenantId,
        hasToken: !!token,
        hasTenantId: !!tenantId
    });

    const getDeliveryPointName = useCallback((deliveryPointId: string) => {
        const deliveryPoint = data?.data.find((dp: DeliveryPointGetDto) => dp.id === deliveryPointId);
        return deliveryPoint?.name ?? "";
    }, [data]);

    console.log('data >>> ', data);

    const deliveryPoints = data ?? [];

    console.log('deliveryPoints', deliveryPoints);

    return { deliveryPoints, isLoading, error, getDeliveryPointName };
};

export const useDeliveryPointMutation = (
    token: string,
    tenantId: string,
) => {
    return useMutation({
        mutationFn: async (data: DeliveryPointCreateDto) => {
            if (!token || !tenantId) throw new Error("Unauthorized");
            return await postApiRequest(
                API_URL,
                token,
                tenantId,
                data,
                "Error creating delivery point"
            );
        },
    });
};

export const useUpdateDeliveryPoint = (
    token: string,
    tenantId: string,
    id: string,
) => {
    const API_URL_BY_ID = `${API_URL}/${id}`;
    return useMutation({
        mutationFn: async (data: DeliveryPointUpdateDto) => {
            if (!token || !tenantId || !id) throw new Error("Unauthorized");
            return await updateApiRequest(
                API_URL_BY_ID,
                token,
                tenantId,
                data,
                "Error updating delivery point",
                "PATCH"
            );
        },
    });
};

export const useDeleteDeliveryPoint = (
    token: string,
    tenantId: string,
    id: string,
) => {
    const API_URL_BY_ID = `${API_URL}/${id}`;
    return useMutation({
        mutationFn: async () => {
            if (!token || !tenantId || !id) throw new Error("Unauthorized");
            return await deleteApiRequest(
                API_URL_BY_ID,
                token,
                tenantId,
                id,
                "Error deleting delivery point"
            );
        },
    });
};