import { useMutation, useQuery } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { deleteApiRequest, getAllApiRequest, postApiRequest, updateApiRequest } from "@/lib/config.api";
import { useCallback } from "react";
import { DeliveryPointCreateDto, DeliveryPointGetDto, DeliveryPointUpdateDto } from "@/dtos/delivery-point.dto";

const deliveryPointApiUrl = (buCode: string, id?: string) => {
    const baseUrl = `${backendApi}/api/config/${buCode}/delivery-point`;
    return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useDeliveryPointQuery = ({
    token,
    buCode,
    params
}: {
    token: string;
    buCode: string;
    params?: ParamsGetDto;
}) => {

    const API_URL = deliveryPointApiUrl(buCode);

    const { data, isLoading, error } = useQuery({
        queryKey: ["delivery-point", params],
        queryFn: async () => {
            try {
                const result = await getAllApiRequest(
                    API_URL,
                    token,
                    "Error fetching delivery point",
                    params
                );
                return result;
            } catch (error) {
                console.log('error', error);
                throw error;
            }
        },
        enabled: !!token && !!buCode,
    });
    const getDeliveryPointName = useCallback((deliveryPointId: string) => {
        const deliveryPoint = data?.data.find((dp: DeliveryPointGetDto) => dp.id === deliveryPointId);
        return deliveryPoint?.name ?? "";
    }, [data]);
    const deliveryPoints = data;
    return { deliveryPoints, isLoading, error, getDeliveryPointName };
};

export const useDeliveryPointMutation = (
    token: string,
    buCode: string,
) => {
    const API_URL = deliveryPointApiUrl(buCode);
    return useMutation({
        mutationFn: async (data: DeliveryPointCreateDto) => {
            if (!token || !buCode) throw new Error("Unauthorized");
            return await postApiRequest(
                API_URL,
                token,
                data,
                "Error creating delivery point"
            );
        },
    });
};

export const useUpdateDeliveryPoint = (
    token: string,
    buCode: string,
) => {
    return useMutation({
        mutationFn: async (data: DeliveryPointUpdateDto) => {
            if (!token || !buCode || !data.id) throw new Error("Unauthorized");
            const API_URL_BY_ID = deliveryPointApiUrl(buCode, data.id);
            return await updateApiRequest(
                API_URL_BY_ID,
                token,
                data,
                "Error updating delivery point",
                "PATCH"
            );
        },
    });
};

export const useDeleteDeliveryPoint = (
    token: string,
    buCode: string,
) => {
    return useMutation({
        mutationFn: async (id: string) => {
            if (!token || !buCode || !id) throw new Error("Unauthorized");
            const API_URL_BY_ID = deliveryPointApiUrl(buCode, id);
            return await deleteApiRequest(
                API_URL_BY_ID,
                token,
                id,
                "Error deleting delivery point"
            );
        },
    });
};