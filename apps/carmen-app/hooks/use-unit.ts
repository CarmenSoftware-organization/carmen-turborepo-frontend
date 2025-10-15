import { backendApi } from "@/lib/backend-api";
import { deleteApiRequest, getAllApiRequest, postApiRequest, updateApiRequest } from "@/lib/config.api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { UnitDto } from "@/dtos/unit.dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

const unitApiUrl = (buCode: string, id?: string) => {
    const baseUrl = `${backendApi}/api/config/${buCode}/units`;
    return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useUnitQuery = ({
    token,
    buCode,
    params
}: {
    token: string;
    buCode: string;
    params?: ParamsGetDto;
}) => {
    const API_URL = unitApiUrl(buCode);
    const { data, isLoading, error } = useQuery({
        queryKey: ["units", params],
        queryFn: async () => {
            if (!token || !buCode) throw new Error("Unauthorized");
            return await getAllApiRequest(
                API_URL,
                token,
                "Error fetching units",
                params
            );
        },
        enabled: !!token && !!buCode,
    });

    const getUnitName = useCallback((unitId: string) => {
        const unit = data?.data.find((u: UnitDto) => u.id === unitId);
        return unit?.name ?? "";
    }, [data]);

    const units = data;
    return { units, isLoading, error, getUnitName };
};

export const useUnitMutation = (token: string, buCode: string) => {
    const API_URL = unitApiUrl(buCode);
    return useMutation({
        mutationFn: async (data: UnitDto) => {
            return await postApiRequest(
                API_URL,
                token,
                data,
                "Error creating unit"
            );
        },
    });
};

export const useUpdateUnit = (token: string, buCode: string, id: string) => {
    const API_URL_BY_ID = unitApiUrl(buCode, id);
    return useMutation({
        mutationFn: async (data: UnitDto) => {
            return await updateApiRequest(
                API_URL_BY_ID,
                token,
                data,
                "Error updating unit",
                "PUT"
            );
        },
    });
};


export const useDeleteUnit = (token: string, buCode: string, id: string) => {
    const API_URL_BY_ID = unitApiUrl(buCode, id);
    return useMutation({
        mutationFn: async () => {
            return await deleteApiRequest(
                API_URL_BY_ID,
                token,
                id,
                "Error deleting unit");
        },
    });
};

// Get order units by product
export const useOrderUnitByProduct = ({
    token,
    buCode,
    productId,
    enabled = true
}: {
    token: string;
    buCode: string;
    productId: string;
    enabled?: boolean;
}) => {
    const API_URL = `${backendApi}/api/${buCode}/unit/order/product/${productId}`;

    const { data, isLoading, error } = useQuery({
        queryKey: ["order-units-by-product", buCode, productId],
        queryFn: async () => {
            if (!token || !buCode || !productId) throw new Error("Missing required parameters");

            const response = await getAllApiRequest(
                API_URL,
                token,
                "Error fetching order units by product"
            );
            return response;
        },
        enabled: !!token && !!buCode && !!productId && enabled,
    });

    return { data, isLoading, error };
};