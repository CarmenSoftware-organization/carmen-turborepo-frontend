import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { getAllApiRequest, postApiRequest, updateApiRequest, requestHeaders } from "@/lib/config.api";
import { useCallback, useMemo } from "react";
import { ItemGroupDto } from "@/dtos/category.dto";
import { formType } from "@/dtos/form.dto";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const itemGroupApiUrl = (buCode: string, id?: string) => {
    const baseUrl = `${backendApi}/api/config/${buCode}/products/item-group`;
    return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useItemGroupQuery = ({
    token,
    buCode,
    params
}: {
    token: string;
    buCode: string;
    params?: ParamsGetDto;
}) => {

    const API_URL = itemGroupApiUrl(buCode);

    const { data, isLoading, error } = useQuery({
        queryKey: ["itemgroup", buCode, params],
        queryFn: async () => {
            try {
                const result = await getAllApiRequest(
                    API_URL,
                    token,
                    "Error fetching item group",
                    params
                );
                return result;
            } catch (error) {
                console.log('error', error);
                throw error;
            }
        },
        enabled: !!token && !!buCode,
        staleTime: 60000,
    });

    const getItemGroupName = useCallback((itemGroupId: string) => {
        const itemGroup = data?.data?.find((ig: ItemGroupDto) => ig.id === itemGroupId);
        return itemGroup?.name ?? "";
    }, [data]);

    return { itemGroups: data, isLoading, error, getItemGroupName };
};

export const useItemGroupMutation = (
    token: string,
    buCode: string,
) => {
    const queryClient = useQueryClient();
    const API_URL = itemGroupApiUrl(buCode);
    return useMutation({
        mutationFn: async (data: ItemGroupDto) => {
            if (!token || !buCode) throw new Error("Unauthorized");
            return await postApiRequest(
                API_URL,
                token,
                data,
                "Error creating item group"
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['itemgroup', buCode] });
        },
    });
};

export const useUpdateItemGroup = (
    token: string,
    buCode: string,
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: ItemGroupDto) => {
            if (!token || !buCode || !data.id) throw new Error("Unauthorized");
            const API_URL_BY_ID = itemGroupApiUrl(buCode, data.id);
            return await updateApiRequest(
                API_URL_BY_ID,
                token,
                data,
                "Error updating item group",
                "PUT"
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['itemgroup', buCode] });
        },
    });
};

export const useDeleteItemGroup = (
    token: string,
    buCode: string,
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            if (!token || !buCode || !id) throw new Error("Unauthorized");
            try {
                const API_URL_BY_ID = itemGroupApiUrl(buCode, id);
                const response = await axios.delete(API_URL_BY_ID, {
                    headers: requestHeaders(token),
                });
                return response.data;
            } catch (error) {
                console.error("Error deleting item group:", error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['itemgroup', buCode] });
        },
    });
};

export const useItemGroup = () => {
    const { token, buCode } = useAuth();
    const queryClient = useQueryClient();
    const { itemGroups, isLoading, error, getItemGroupName } = useItemGroupQuery({
        token,
        buCode,
        params: {
            perpage: -1
        }
    });

    const createMutation = useItemGroupMutation(token, buCode);
    const updateMutation = useUpdateItemGroup(token, buCode);
    const deleteMutation = useDeleteItemGroup(token, buCode);

    const handleSubmit = async (data: ItemGroupDto, mode: formType, selectedItemGroup?: ItemGroupDto) => {
        if (mode === formType.ADD) {
            return await createMutation.mutateAsync(data);
        } else {
            const updatedItemGroup = { ...data, id: selectedItemGroup!.id };
            return await updateMutation.mutateAsync(updatedItemGroup);
        }
    };

    const handleDelete = async (itemGroup: ItemGroupDto) => {
        return await deleteMutation.mutateAsync(itemGroup.id ?? '');
    };

    const fetchItemGroups = () => {
        queryClient.invalidateQueries({ queryKey: ['itemgroup', buCode] });
    };

    const itemGroupsData = useMemo(() => {
        return itemGroups?.data || [];
    }, [itemGroups?.data]);

    return {
        itemGroups: itemGroupsData,
        isPending: isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
        isUnauthorized: error?.message === 'Unauthorized',
        fetchItemGroups,
        handleSubmit,
        handleDelete,
        getItemGroupName
    };
};
