import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProductService,
  getProductIdService,
  createProductService,
  updateProductService,
  deleteProductService,
  getCategoryListByItemGroup,
} from "@/services/product.service";

interface UseProductQueryParams {
  token: string;
  buCode: string;
  params?: {
    search?: string;
    page?: number | string;
    perpage?: number | string;
    sort?: string;
    filter?: string;
  };
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

export const useProductsQuery = ({ token, buCode, params }: UseProductQueryParams) => {
  return useQuery({
    queryKey: ["products", buCode, params],
    queryFn: () => getProductService(token, buCode, params || {}),
    staleTime: 60000, // 1 minute
    enabled: !!token && !!buCode,
  });
};

export const useProductByIdQuery = ({ token, buCode, id, enabled = true }: UseProductByIdParams) => {
  return useQuery({
    queryKey: ["product", buCode, id],
    queryFn: () => getProductIdService(token, buCode, id),
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
  return useQuery({
    queryKey: ["category-by-item-group", buCode, itemGroupId],
    queryFn: () => getCategoryListByItemGroup(token, buCode, itemGroupId),
    staleTime: 300000, // 5 minutes (rarely changes)
    enabled: enabled && !!token && !!buCode && !!itemGroupId,
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, buCode, product }: {
      token: string;
      buCode: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product: any;
    }) => createProductService(token, buCode, product),
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
    }) => updateProductService(token, buCode, id, product),
    onSuccess: (_data, variables) => {
      // Invalidate both list and detail
      queryClient.invalidateQueries({ queryKey: ["products", variables.buCode] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.buCode, variables.id] });
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
    }) => deleteProductService(token, buCode, id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products", variables.buCode] });
      queryClient.removeQueries({ queryKey: ["product", variables.buCode, variables.id] });
    },
  });
};
