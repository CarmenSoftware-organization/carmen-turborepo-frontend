"use client";

import { ItemGroupDto } from "@/dtos/category.dto";
import { useAuth } from "@/context/AuthContext";
import { createItemGroupService, deleteItemGroupService, getItemGroupService, updateItemGroupService } from "@/services/item-group.service";
import { formType } from "@/dtos/form.dto";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useItemGroupsQuery = () => {
    const { token, buCode } = useAuth();

    return useQuery({
        queryKey: ['itemGroups', buCode],
        queryFn: async () => {
            const response = await getItemGroupService(token, buCode);
            if (response.statusCode === 401) {
                throw new Error('Unauthorized');
            }
            return response.data as ItemGroupDto[];
        },
        enabled: !!token && !!buCode,
        staleTime: 60000,
    });
};

export const useCreateItemGroupMutation = () => {
    const { token, buCode } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ItemGroupDto) => {
            return await createItemGroupService(token, buCode, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['itemGroups', buCode] });
        },
    });
};

export const useUpdateItemGroupMutation = () => {
    const { token, buCode } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ItemGroupDto) => {
            return await updateItemGroupService(token, buCode, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['itemGroups', buCode] });
        },
    });
};

export const useDeleteItemGroupMutation = () => {
    const { token, buCode } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (itemGroupId: string) => {
            return await deleteItemGroupService(token, buCode, itemGroupId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['itemGroups', buCode] });
        },
    });
};

// Legacy hook for backward compatibility
export const useItemGroup = () => {
    const { data: itemGroups = [], isLoading, error } = useItemGroupsQuery();
    const createMutation = useCreateItemGroupMutation();
    const updateMutation = useUpdateItemGroupMutation();
    const deleteMutation = useDeleteItemGroupMutation();
    const queryClient = useQueryClient();
    const { buCode } = useAuth();

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
        queryClient.invalidateQueries({ queryKey: ['itemGroups', buCode] });
    };

    return {
        itemGroups,
        isPending: isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
        isUnauthorized: error?.message === 'Unauthorized',
        isLoading,
        fetchItemGroups,
        handleSubmit,
        handleDelete
    };
};