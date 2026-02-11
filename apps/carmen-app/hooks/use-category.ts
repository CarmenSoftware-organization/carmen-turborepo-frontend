import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import {
  getAllApiRequest,
  postApiRequest,
  updateApiRequest,
  requestHeaders,
} from "@/lib/config.api";
import { useCallback, useMemo } from "react";
import { CategoryDto } from "@/dtos/category.dto";
import { formType } from "@/dtos/form.dto";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const categoryApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/products/category`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useCategoryQuery = ({
  token,
  buCode,
  params,
}: {
  token: string;
  buCode: string;
  params?: ParamsGetDto;
}) => {
  const API_URL = categoryApiUrl(buCode);

  const { data, isLoading, error } = useQuery({
    queryKey: ["category", buCode, params],
    queryFn: () => getAllApiRequest(API_URL, token, "Error fetching category", params),
    enabled: !!token && !!buCode,
    staleTime: 5 * 60 * 1000,
  });

  const getCategoryName = useCallback(
    (categoryId: string) => {
      const category = data?.data?.find((cat: CategoryDto) => cat.id === categoryId);
      return category?.name ?? "";
    },
    [data]
  );

  return { categories: data, isLoading, error, getCategoryName };
};

export const useCategoryMutation = (token: string, buCode: string) => {
  const queryClient = useQueryClient();
  const API_URL = categoryApiUrl(buCode);
  return useMutation({
    mutationFn: async (data: CategoryDto) => {
      if (!token || !buCode) throw new Error("Unauthorized");
      return await postApiRequest(API_URL, token, data, "Error creating category");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category", buCode] });
    },
  });
};

export const useUpdateCategory = (token: string, buCode: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CategoryDto) => {
      if (!token || !buCode || !data.id) throw new Error("Unauthorized");
      const API_URL_BY_ID = categoryApiUrl(buCode, data.id);
      return await updateApiRequest(API_URL_BY_ID, token, data, "Error updating category", "PUT");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category", buCode] });
    },
  });
};

export const useDeleteCategory = (token: string, buCode: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!token || !buCode || !id) throw new Error("Unauthorized");
      try {
        const API_URL_BY_ID = categoryApiUrl(buCode, id);
        const response = await axios.delete(API_URL_BY_ID, {
          headers: requestHeaders(token),
        });
        return response.data;
      } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category", buCode] });
    },
  });
};

export const useCategory = () => {
  const { token, buCode } = useAuth();
  const queryClient = useQueryClient();

  const { categories, isLoading, error, getCategoryName } = useCategoryQuery({
    token,
    buCode,
    params: {
      sort: "code",
      perpage: -1,
    },
  });

  const createMutation = useCategoryMutation(token, buCode);
  const updateMutation = useUpdateCategory(token, buCode);
  const deleteMutation = useDeleteCategory(token, buCode);

  const handleSubmit = async (
    data: CategoryDto,
    mode: formType,
    selectedCategory?: CategoryDto
  ) => {
    if (mode === formType.ADD) {
      return await createMutation.mutateAsync(data);
    } else {
      const updatedCategory = { ...data, id: selectedCategory!.id };
      return await updateMutation.mutateAsync(updatedCategory);
    }
  };

  const handleDelete = async (category: CategoryDto) => {
    return await deleteMutation.mutateAsync(category.id ?? "");
  };

  const fetchCategories = () => {
    queryClient.invalidateQueries({ queryKey: ["category", buCode] });
  };

  const categoriesData = useMemo(() => {
    return categories?.data || [];
  }, [categories?.data]);

  return {
    categories: categoriesData,
    isPending:
      isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    isUnauthorized: error?.message === "Unauthorized",
    fetchCategories,
    handleSubmit,
    handleDelete,
    getCategoryName,
  };
};
