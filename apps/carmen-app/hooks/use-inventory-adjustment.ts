import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ParamsGetDto } from "@/dtos/param.dto";
import {
  deleteApiRequest,
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
} from "@/lib/config.api";
import { backendApi } from "@/lib/backend-api";
import { InventoryAdjustmentPayloadDto } from "@/dtos/inventory-adjustment.dto";
import { STOCK_IN_OUT_TYPE } from "@/dtos/stock-in-out.dto";

export const queryKeyInventoryAdjustment = "inventory-adjustment";
export const queryKeyStockIn = "stock-in";
export const queryKeyStockInId = "stock-out-id";
export const queryKeyStockOut = "stock-out";
export const queryKeyStockOutId = "stock-out-id";

export const useInventoryAdjustmentQuery = (
  token: string,
  buCode: string,
  params?: ParamsGetDto
) => {
  const isEnabled = Boolean(token) && Boolean(buCode);
  const API_URL = `${backendApi}/api/${buCode}/inventory-adjustment`;

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [queryKeyInventoryAdjustment, buCode, params],
    queryFn: async () => {
      return getAllApiRequest(API_URL, token, "Failed to fetch all inventory adjustment", params);
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");
  const paginate = data?.paginate;
  const adjDatas = data?.data ?? [];

  return {
    adjDatas,
    paginate,
    isLoading: isLoading || (!isEnabled && !data),
    isFetching,
    error,
    isUnauthorized,
  };
};

export const useInventoryAdjustmentByIdQuery = (
  token: string,
  buCode: string,
  id: string,
  type: STOCK_IN_OUT_TYPE
) => {
  const isEnabled = Boolean(token) && Boolean(buCode) && Boolean(id);
  const API_URL = `${backendApi}/api/${buCode}/${type === STOCK_IN_OUT_TYPE.STOCK_IN ? "stock-in" : "stock-out"}/${id}`;
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [queryKeyInventoryAdjustment, buCode, id],
    queryFn: async () => {
      return getByIdApiRequest(API_URL, token, "Failed to fetch inventory adjustment");
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");

  return {
    data,
    isLoading: isLoading || (!isEnabled && !data),
    isFetching,
    error,
    isUnauthorized,
  };
};

export const useInventoryAdjustmentMutation = (
  token: string,
  buCode: string,
  type: STOCK_IN_OUT_TYPE
) => {
  const queryClient = useQueryClient();
  const idTouse = type === STOCK_IN_OUT_TYPE.STOCK_IN ? "stock-in" : "stock-out";
  const baseUrl = `${backendApi}/api/${buCode}`; // Defined baseUrl for consistency

  return useMutation({
    mutationFn: (data: InventoryAdjustmentPayloadDto) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      const API_URL = `${baseUrl}/${idTouse}`;
      // Assuming createApiRequest is equivalent to postApiRequest for this context
      return postApiRequest(API_URL, token, data, "Failed to create inventory adjustment");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeyInventoryAdjustment, buCode] });
    },
  });
};

export const useUpdateInventoryAdjustmentMutation = (
  token: string,
  buCode: string,
  type: STOCK_IN_OUT_TYPE
) => {
  const queryClient = useQueryClient();
  const idTouse = type === STOCK_IN_OUT_TYPE.STOCK_IN ? "stock-in" : "stock-out";
  const baseUrl = `${backendApi}/api/${buCode}`; // Defined baseUrl for consistency

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: InventoryAdjustmentPayloadDto }) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      const API_URL = `${baseUrl}/${idTouse}/${id}`;
      return updateApiRequest(API_URL, token, data, "Failed to update inventory adjustment", "PUT");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeyInventoryAdjustment, buCode] });
    },
  });
};

export const useDeleteInventoryAdjustmentMutation = (
  token: string,
  buCode: string,
  type: STOCK_IN_OUT_TYPE
) => {
  const queryClient = useQueryClient();
  const idTouse = type === STOCK_IN_OUT_TYPE.STOCK_IN ? "stock-in" : "stock-out";
  const baseUrl = `${backendApi}/api/${buCode}`; // Defined baseUrl for consistency

  return useMutation({
    mutationFn: (id: string) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      const API_URL = `${baseUrl}/${idTouse}/${id}`;
      return deleteApiRequest(API_URL, token, "Failed to delete inventory adjustment");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeyInventoryAdjustment, buCode] });
    },
  });
};
