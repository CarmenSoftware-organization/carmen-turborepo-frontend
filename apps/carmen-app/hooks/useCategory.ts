"use client";

import { createCategoryService, deleteCategoryService, getCategoryService, updateCategoryService } from "@/services/category.service";
import { useAuth } from "@/context/AuthContext";
import { CategoryDto } from "@/dtos/category.dto";
import { formType } from "@/dtos/form.dto";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCategoriesQuery = () => {
    const { token, buCode } = useAuth();

    return useQuery({
        queryKey: ['categories', buCode],
        queryFn: async () => {
            const response = await getCategoryService(token, buCode, { sort: 'code' });
            if (response.statusCode === 401) {
                throw new Error('Unauthorized');
            }
            return response.data as CategoryDto[];
        },
        enabled: !!token && !!buCode,
        staleTime: 60000,
    });
};

export const useCreateCategoryMutation = () => {
    const { token, buCode } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CategoryDto) => {
            return await createCategoryService(token, buCode, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories', buCode] });
        },
    });
};

export const useUpdateCategoryMutation = () => {
    const { token, buCode } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CategoryDto) => {
            return await updateCategoryService(token, buCode, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories', buCode] });
        },
    });
};

export const useDeleteCategoryMutation = () => {
    const { token, buCode } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (categoryId: string) => {
            return await deleteCategoryService(token, buCode, categoryId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories', buCode] });
        },
    });
};

// Legacy hook for backward compatibility
export const useCategory = () => {
    const { data: categories = [], isLoading, error } = useCategoriesQuery();
    const createMutation = useCreateCategoryMutation();
    const updateMutation = useUpdateCategoryMutation();
    const deleteMutation = useDeleteCategoryMutation();
    const queryClient = useQueryClient();
    const { buCode } = useAuth();

    const handleSubmit = async (data: CategoryDto, mode: formType, selectedCategory?: CategoryDto) => {
        if (mode === formType.ADD) {
            return await createMutation.mutateAsync(data);
        } else {
            const updatedCategory = { ...data, id: selectedCategory!.id };
            return await updateMutation.mutateAsync(updatedCategory);
        }
    };

    const handleDelete = async (category: CategoryDto) => {
        return await deleteMutation.mutateAsync(category.id ?? '');
    };

    const fetchCategories = () => {
        queryClient.invalidateQueries({ queryKey: ['categories', buCode] });
    };

    return {
        categories,
        isPending: isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
        isUnauthorized: error?.message === 'Unauthorized',
        fetchCategories,
        handleSubmit,
        handleDelete
    };
};

