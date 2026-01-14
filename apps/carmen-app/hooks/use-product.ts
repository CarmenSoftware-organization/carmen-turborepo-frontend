import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { getAllApiRequest, getByIdApiRequest, postApiRequest, updateApiRequest, deleteApiRequest } from "@/lib/config.api";

// API URL helper
const productApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/products`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}`;
};

// Interfaces
interface UseProductQueryParams {
  token: string;
  buCode: string;
  params?: ParamsGetDto;
}

interface UseProductByIdParams {
  token: string;
  buCode: string;
  id: string;
  enabled?: boolean;
}

interface UseCategoryByItemGroupParams {
  token: string;
  buCode: string;
  itemGroupId: string;
  enabled?: boolean;
}

// Query Hooks
export const useProductsQuery = ({ token, buCode, params }: UseProductQueryParams) => {
  const API_URL = productApiUrl(buCode);

  return useQuery({
    queryKey: ["products", buCode, params],
    queryFn: () => {
      if (!token || !buCode) throw new Error("Unauthorized");
      return getAllApiRequest(API_URL, token, "Error fetching products", params);
    },
    staleTime: 60000, // 1 minute
    enabled: !!token && !!buCode,
  });
};

export const useProductByIdQuery = ({ token, buCode, id, enabled = true }: UseProductByIdParams) => {
  const API_URL_BY_ID = productApiUrl(buCode, id);

  return useQuery({
    queryKey: ["product", buCode, id],
    queryFn: () => {
      if (!token || !buCode || !id) throw new Error("Unauthorized");
      return getByIdApiRequest(API_URL_BY_ID, token, "Error fetching product");
    },
    staleTime: 60000,
    enabled: enabled && !!token && !!buCode && !!id,
  });
};

export const useCategoryByItemGroupQuery = ({
  token,
  buCode,
  itemGroupId,
  enabled = true
}: UseCategoryByItemGroupParams) => {
  const API_URL = `${backendApi}/api/config/${buCode}/products/item-group/${itemGroupId}`;

  return useQuery({
    queryKey: ["category-by-item-group", buCode, itemGroupId],
    queryFn: () => {
      if (!token || !buCode || !itemGroupId) throw new Error("Unauthorized");
      return getByIdApiRequest(API_URL, token, "Error fetching category by item group");
    },
    staleTime: 300000, // 5 minutes (rarely changes)
    enabled: enabled && !!token && !!buCode && !!itemGroupId,
  });
};

// Mutation Hooks
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, buCode, product }: {
      token: string;
      buCode: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product: any;
    }) => {
      if (!token || !buCode) throw new Error("Unauthorized");
      const API_URL = productApiUrl(buCode);
      return postApiRequest(API_URL, token, product, "Error creating product");
    },
    onSuccess: (_data, variables) => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: ["products", variables.buCode] });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, buCode, id, product }: {
      token: string;
      buCode: string;
      id: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product: any;
    }) => {
      if (!token || !buCode || !id) throw new Error("Unauthorized");
      const API_URL_BY_ID = productApiUrl(buCode, id);
      return updateApiRequest(API_URL_BY_ID, token, product, "Error updating product", "PATCH");
    },
    onSuccess: async (_data, variables) => {
      // Invalidate both list and detail queries and wait for them to refetch
      await queryClient.invalidateQueries({ queryKey: ["products", variables.buCode] });
      await queryClient.invalidateQueries({ queryKey: ["product", variables.buCode, variables.id] });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, buCode, id }: {
      token: string;
      buCode: string;
      id: string;
    }) => {
      if (!token || !buCode || !id) throw new Error("Unauthorized");
      const API_URL_BY_ID = productApiUrl(buCode, id);
      return deleteApiRequest(API_URL_BY_ID, token, "Error deleting product");
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products", variables.buCode] });
      queryClient.removeQueries({ queryKey: ["product", variables.buCode, variables.id] });
    },
  });
};
