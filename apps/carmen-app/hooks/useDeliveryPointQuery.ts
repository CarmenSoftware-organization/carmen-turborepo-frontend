"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DeliveryPointDto } from "@/dtos/config.dto";
import { createDeliveryPoint, getAllDeliveryPoints, inactiveDeliveryPoint, updateDeliveryPoint } from "@/services/dp.service";
import { useAuth } from "@/context/AuthContext";

export const DELIVERY_POINT_KEYS = {
    all: ["deliveryPoints"] as const,
    lists: () => [...DELIVERY_POINT_KEYS.all, "list"] as const,
    list: (filters: Record<string, string>) => [...DELIVERY_POINT_KEYS.lists(), filters] as const,
    details: () => [...DELIVERY_POINT_KEYS.all, "detail"] as const,
    detail: (id: string) => [...DELIVERY_POINT_KEYS.details(), id] as const,
};

export const useDeliveryPointQuery = () => {
    const { token, tenantId } = useAuth();
    const queryClient = useQueryClient();

    const useGetDeliveryPoints = (params: {
        search?: string;
        page?: string;
        perPage?: string;
        sort?: string;
        filter?: string;
    } = {}) => {
        return useQuery({
            queryKey: DELIVERY_POINT_KEYS.list(params),
            queryFn: () => getAllDeliveryPoints(token, tenantId, params),
            enabled: !!token && !!tenantId,
            staleTime: 1000 * 60 * 5, // 5 minutes
        });
    };

    const createDeliveryPointMutation = useMutation({
        mutationFn: (data: DeliveryPointDto) => createDeliveryPoint(token, tenantId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DELIVERY_POINT_KEYS.lists() });
        },
    });

    const updateDeliveryPointMutation = useMutation({
        mutationFn: (data: DeliveryPointDto) => updateDeliveryPoint(token, tenantId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DELIVERY_POINT_KEYS.lists() });
        },
    });

    const toggleDeliveryPointStatusMutation = useMutation({
        mutationFn: (data: DeliveryPointDto) => inactiveDeliveryPoint(token, tenantId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DELIVERY_POINT_KEYS.lists() });
        },
    });

    return {
        useGetDeliveryPoints,
        createDeliveryPointMutation,
        updateDeliveryPointMutation,
        toggleDeliveryPointStatusMutation,
    };
}; 