"use client";

import { useAuth } from "@/context/AuthContext";
import { SubCategoryDto } from "@/dtos/category.dto";
import { createSubCategoryService, deleteSubCategoryService, getSubCategoryService, updateSubCategoryService } from "@/services/sub-category.service";
import { formType } from "@/dtos/form.dto";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useSubCategoriesQuery = () => {
    const { token, buCode } = useAuth();

    return useQuery({
        queryKey: ['subCategories', buCode],
        queryFn: async () => {
            const response = await getSubCategoryService(token, buCode);
            if (response.statusCode === 401) {
                throw new Error('Unauthorized');
            }
            return response.data as SubCategoryDto[];
        },
        enabled: !!token && !!buCode,
        staleTime: 60000,
    });
};

export const useCreateSubCategoryMutation = () => {
    const { token, buCode } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: SubCategoryDto) => {
            return await createSubCategoryService(token, buCode, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subCategories', buCode] });
        },
    });
};

export const useUpdateSubCategoryMutation = () => {
    const { token, buCode } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: SubCategoryDto) => {
            return await updateSubCategoryService(token, buCode, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subCategories', buCode] });
        },
    });
};

export const useDeleteSubCategoryMutation = () => {
    const { token, buCode } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (subCategoryId: string) => {
            return await deleteSubCategoryService(token, buCode, subCategoryId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subCategories', buCode] });
        },
    });
};

// Legacy hook for backward compatibility
export const useSubCategory = () => {
    const { data: subCategories = [], isLoading, error } = useSubCategoriesQuery();
    const createMutation = useCreateSubCategoryMutation();
    const updateMutation = useUpdateSubCategoryMutation();
    const deleteMutation = useDeleteSubCategoryMutation();
    const queryClient = useQueryClient();
    const { buCode } = useAuth();

    const handleSubmit = async (data: SubCategoryDto, mode: formType, selectedSubCategory?: SubCategoryDto) => {
        if (mode === formType.ADD) {
            return await createMutation.mutateAsync(data);
        } else {
            const updatedSubCategory = { ...data, id: selectedSubCategory!.id };
            return await updateMutation.mutateAsync(updatedSubCategory);
        }
    };

    const handleDelete = async (subCategory: SubCategoryDto) => {
        return await deleteMutation.mutateAsync(subCategory.id ?? '');
    };

    const fetchSubCategories = () => {
        queryClient.invalidateQueries({ queryKey: ['subCategories', buCode] });
    };

    return {
        subCategories,
        isPending: isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
        isUnauthorized: error?.message === 'Unauthorized',
        fetchSubCategories,
        handleSubmit,
        handleDelete
    };
};