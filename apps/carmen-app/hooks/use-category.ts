import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteApiRequest, getAllApiRequest, postApiRequest, updateApiRequest } from "@/lib/config.api";
import { useCallback } from "react";

const categoryApiUrl = (buCode: string, id?: string) => {
    const baseUrl = `${backendApi}/api/config/${buCode}/category`;
    return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useCategoryQuery = ({
    token,
    buCode,
}: {
    token: string;
    buCode: string;
}) => {
    const API_URL = categoryApiUrl(buCode);
    const { data, isLoading, error } = useQuery({
        queryKey: ["category", buCode],
        queryFn: async () => {
            if (!token || !buCode) throw new Error("Unauthorized");
            return await getAllApiRequest(API_URL, token, "Error fetching categories");
        },
        enabled: !!token && !!buCode,
    });

    return { data, isLoading, error };
};
