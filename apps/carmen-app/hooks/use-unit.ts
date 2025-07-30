import { backendApi } from "@/lib/backend-api";
import { deleteApiRequest, getAllApiRequest, postApiRequest, updateApiRequest } from "@/lib/config.api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { UnitDto } from "@/dtos/unit.dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = `${backendApi}/api/config/units`;

export const useUnitQuery = ({
    token,
    tenantId,
    params
}: {
    token: string;
    tenantId: string;
    params?: ParamsGetDto;
}) => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["units", tenantId, params],
        queryFn: async () => {
            if (!token || !tenantId) throw new Error("Unauthorized");
            return await getAllApiRequest(
                API_URL,
                token,
                tenantId,
                "Error fetching units",
                params
            );
        },
        enabled: !!token && !!tenantId,
    });

    const getUnitName = useCallback((unitId: string) => {
        const unit = data?.data.find((u: UnitDto) => u.id === unitId);
        return unit?.name ?? "";
    }, [data]);

    const units = data;
    return { units, isLoading, error, getUnitName };
};

export const useUnitMutation = (token: string, tenantId: string) => {
    return useMutation({
        mutationFn: async (data: UnitDto) => {
            return await postApiRequest(
                API_URL,
                token,
                tenantId,
                data,
                "Error creating unit"
            );
        },
    });
};

export const useUpdateUnit = (token: string, tenantId: string, id: string) => {
    const API_URL_BY_ID = `${API_URL}/${id}`;
    return useMutation({
        mutationFn: async (data: UnitDto) => {
            return await updateApiRequest(
                API_URL_BY_ID,
                token,
                tenantId,
                data,
                "Error updating unit",
                "PUT"
            );
        },
    });
};


export const useDeleteUnit = (token: string, tenantId: string, id: string) => {
    const API_URL_BY_ID = `${API_URL}/${id}`;
    return useMutation({
        mutationFn: async () => {
            return await deleteApiRequest(API_URL_BY_ID, token, tenantId, id, "Error deleting unit");
        },
    });
};