import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { getAllApiRequest, postApiRequest, updateApiRequest, requestHeaders } from "@/lib/config.api";
import { useCallback, useMemo } from "react";
import { SubCategoryDto } from "@/dtos/category.dto";
import { formType } from "@/dtos/form.dto";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const subCategoryApiUrl = (buCode: string, id?: string) => {
    const baseUrl = `${backendApi}/api/config/${buCode}/products/sub-category`;
    return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useSubCategoryQuery = ({
    token,
    buCode,
    params
}: {
    token: string;
    buCode: string;
    params?: ParamsGetDto;
}) => {

    const API_URL = subCategoryApiUrl(buCode);

    const { data, isLoading, error } = useQuery({
        queryKey: ["subcategory", buCode, params],
        queryFn: async () => {
            try {
                const result = await getAllApiRequest(
                    API_URL,
                    token,
                    "Error fetching subcategory",
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

    const getSubCategoryName = useCallback((subCategoryId: string) => {
        const subCategory = data?.data?.find((subCat: SubCategoryDto) => subCat.id === subCategoryId);
        return subCategory?.name ?? "";
    }, [data]);

    return { subCategories: data, isLoading, error, getSubCategoryName };
};

export const useSubCategoryMutation = (
    token: string,
    buCode: string,
) => {
    const queryClient = useQueryClient();
    const API_URL = subCategoryApiUrl(buCode);
    return useMutation({
        mutationFn: async (data: SubCategoryDto) => {
            if (!token || !buCode) throw new Error("Unauthorized");
            return await postApiRequest(
                API_URL,
                token,
                data,
                "Error creating subcategory"
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subcategory', buCode] });
        },
    });
};

export const useUpdateSubCategory = (
    token: string,
    buCode: string,
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: SubCategoryDto) => {
            if (!token || !buCode || !data.id) throw new Error("Unauthorized");
            const API_URL_BY_ID = subCategoryApiUrl(buCode, data.id);
            return await updateApiRequest(
                API_URL_BY_ID,
                token,
                data,
                "Error updating subcategory",
                "PUT"
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subcategory', buCode] });
        },
    });
};

export const useDeleteSubCategory = (
    token: string,
    buCode: string,
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            if (!token || !buCode || !id) throw new Error("Unauthorized");
            try {
                const API_URL_BY_ID = subCategoryApiUrl(buCode, id);
                const response = await axios.delete(API_URL_BY_ID, {
                    headers: requestHeaders(token),
                });
                return response.data;
            } catch (error) {
                console.error("Error deleting subcategory:", error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subcategory', buCode] });
        },
    });
};

// Legacy hook for backward compatibility
// This hook is used by existing components and uses AuthContext internally
export const useSubCategory = () => {
    const { token, buCode } = useAuth();
    const queryClient = useQueryClient();

    const { subCategories, isLoading, error, getSubCategoryName } = useSubCategoryQuery({
        token,
        buCode,
        params: {
            perpage: -1
        }
    });

    const createMutation = useSubCategoryMutation(token, buCode);
    const updateMutation = useUpdateSubCategory(token, buCode);
    const deleteMutation = useDeleteSubCategory(token, buCode);

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
        queryClient.invalidateQueries({ queryKey: ['subcategory', buCode] });
    };

    const subCategoriesData = useMemo(() => {
        return subCategories?.data || [];
    }, [subCategories?.data]);

    return {
        subCategories: subCategoriesData,
        isPending: isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
        isUnauthorized: error?.message === 'Unauthorized',
        fetchSubCategories,
        handleSubmit,
        handleDelete,
        getSubCategoryName
    };
};
