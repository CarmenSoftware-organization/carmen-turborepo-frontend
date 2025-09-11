import { useMutation, useQuery } from "@tanstack/react-query";
import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import {
    deleteApiRequest,
    getAllApiRequest,
    getByIdApiRequest,
    postApiRequest,
    updateApiRequest,
} from "@/lib/config.api";
import { CreateGRNDto } from "@/dtos/grn.dto";

const grnApiUrl = (buCode: string, id?: string) => {
    const baseUrl = `${backendApi}/api/${buCode}/good-received-note`;
    return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useGrnQuery = (token: string, buCode: string, params?: ParamsGetDto) => {
    const API_URL = grnApiUrl(buCode);
    const { data, isLoading, error } = useQuery({
        queryKey: ["grn", buCode, params],
        queryFn: () => getAllApiRequest(API_URL, token, "Error fetching GRNs", params),
        enabled: !!token && !!buCode,
    });
    return { data, isLoading, error };
};

export const useGrnByIdQuery = (token: string, buCode: string, id: string) => {
    const API_URL = grnApiUrl(buCode, id);
    const { data, isLoading, error } = useQuery({
        queryKey: ["grn", buCode, id],
        queryFn: () => getByIdApiRequest(API_URL, token, "Error fetching GRN"),
        enabled: !!token && !!buCode && !!id,
    });
    return { data, isLoading, error };
};

export const useGrnMutation = (token: string, buCode: string) => {
    const API_URL = grnApiUrl(buCode);
    const { mutate, isPending, error } = useMutation({
        mutationFn: (data: CreateGRNDto) => postApiRequest(API_URL, token, data, "Error creating GRN"),
    });
    return { mutate, isPending, error };
};

export const useGrnUpdate = (token: string, buCode: string, id: string) => {
    const API_URL = grnApiUrl(buCode, id);
    const { mutate, isPending, error } = useMutation({
        mutationFn: (data: CreateGRNDto) => updateApiRequest(API_URL, token, data, "Error updating GRN", "PATCH"),
    });
    return { mutate, isPending, error };
};

export const useGrnDelete = (token: string, buCode: string, id: string) => {
    const API_URL = grnApiUrl(buCode, id);
    const { mutate, error } = useMutation({
        mutationFn: () => deleteApiRequest(API_URL, token, id, "Error deleting GRN"),
    });
    return { mutate, error };
};