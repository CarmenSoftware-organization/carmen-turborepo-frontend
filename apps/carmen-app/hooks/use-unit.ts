import { backendApi } from "@/lib/backend-api";
import { deleteApiRequest, getAllApiRequest, postApiRequest, updateApiRequest } from "@/lib/config.api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { UnitDto } from "@/dtos/unit.dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = `${backendApi}/api/config/units`;

export const useUnitQuery = ({
    token,
    buCode,
    params
}: {
    token: string;
    buCode: string;
    params?: ParamsGetDto;
}) => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["units", buCode, params],
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
    const API_URL_BY_ID = `${API_URL}/${id}`;
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
    const API_URL_BY_ID = `${API_URL}/${id}`;
    return useMutation({
        mutationFn: async () => {
            return await deleteApiRequest(API_URL_BY_ID, token, id, "Error deleting unit");
        },
    });
};