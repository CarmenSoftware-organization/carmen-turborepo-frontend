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
import { ADJUSTMENT_TYPE } from "@/dtos/adjustment-type.dto";

export const queryKeyAdjustmentType = "adjustment-type";
export const queryKeyStockIn = "stock-in";
export const queryKeyStockInId = "stock-out-id";
export const queryKeyStockOut = "stock-out";
export const queryKeyStockOutId = "stock-out-id";

export const useAdjustmentTypeQuery = (token: string, buCode: string, params?: ParamsGetDto) => {
  const isEnabled = Boolean(token) && Boolean(buCode);
  const API_URL = `${backendApi}/api/${buCode}/inventory-adjustment`;

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [queryKeyAdjustmentType, buCode, params],
    queryFn: async () => {
      return getAllApiRequest(API_URL, token, "Failed to fetch all adjustment type", params);
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");
  const paginate = data?.paginate;

  return {
    data,
    paginate,
    isLoading: isLoading || (!isEnabled && !data),
    isFetching,
    error,
    isUnauthorized,
  };
};

export const useAdjustmentTypeByIdQuery = (
  token: string,
  buCode: string,
  id: string,
  type: ADJUSTMENT_TYPE
) => {
  const isEnabled = Boolean(token) && Boolean(buCode) && Boolean(id);
  const API_URL = `${backendApi}/api/${buCode}/${type === ADJUSTMENT_TYPE.STOCK_IN ? "stock-in" : "stock-out"}/${id}`;
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [queryKeyAdjustmentType, buCode, id],
    queryFn: async () => {
      return getByIdApiRequest(API_URL, token, "Failed to fetch adjustment type");
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

export const useAdjustmentTypeMutation = (token: string, buCode: string, type: ADJUSTMENT_TYPE) => {
  const queryClient = useQueryClient();

  const API_URL = `${backendApi}/api/${buCode}/${type === ADJUSTMENT_TYPE.STOCK_IN ? "stock-in" : "stock-out"}`;
  const queryKey = type === ADJUSTMENT_TYPE.STOCK_IN ? queryKeyStockIn : queryKeyStockOut;
  return useMutation({
    mutationFn: async (data: unknown) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return postApiRequest(API_URL, token, data, "Failed to create adjustment type");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey, buCode] });
    },
  });
};

export const useUpdateAdjustmentTypeMutation = (
  token: string,
  buCode: string,
  type: ADJUSTMENT_TYPE
) => {
  const queryClient = useQueryClient();

  const baseUrl = `${backendApi}/api/${buCode}/${type === ADJUSTMENT_TYPE.STOCK_IN ? "stock-in" : "stock-out"}`;
  const queryKey = type === ADJUSTMENT_TYPE.STOCK_IN ? queryKeyStockIn : queryKeyStockOut;
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      const API_URL = `${baseUrl}/${id}`;
      return updateApiRequest(API_URL, token, data, "Failed to update adjustment type", "PUT");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey, buCode] });
      queryClient.invalidateQueries({ queryKey: [queryKeyAdjustmentType, buCode] });
    },
  });
};

export const useDeleteAdjustmentTypeMutation = (
  token: string,
  buCode: string,
  type: ADJUSTMENT_TYPE
) => {
  const queryClient = useQueryClient();

  const baseUrl = `${backendApi}/api/${buCode}/${type === ADJUSTMENT_TYPE.STOCK_IN ? "stock-in" : "stock-out"}`;
  const queryKey = type === ADJUSTMENT_TYPE.STOCK_IN ? queryKeyStockIn : queryKeyStockOut;
  return useMutation({
    mutationFn: async (id: string) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      const API_URL = `${baseUrl}/${id}`;
      return deleteApiRequest(API_URL, token, "Failed to delete adjustment type");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey, buCode] });
      queryClient.invalidateQueries({ queryKey: [queryKeyAdjustmentType, buCode] });
    },
  });
};
