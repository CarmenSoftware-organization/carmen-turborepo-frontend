import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ParamsGetDto } from "@/dtos/param.dto";
import {
  deleteApiRequest,
  getAllApiRequest,
  getApiUrl,
  getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
} from "@/lib/config.api";
import { AdjustmentTypeFormValues } from "@/dtos/adjustment-type.dto";

export const adjustmentTypeQueryKey = "adjustment-type";

export const useAdjustmentTypeQuery = (token: string, buCode: string, params?: ParamsGetDto) => {
  const isEnabled = Boolean(token) && Boolean(buCode);
  const pathName = `api/config/${buCode}/adjustment-type`;
  const API_URL = getApiUrl(pathName);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [adjustmentTypeQueryKey, buCode, params],
    queryFn: async () => {
      return getAllApiRequest(
        API_URL,
        token,
        "Failed to fetch all inventory adjustment types",
        params
      );
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");
  const adjustmentTypeData = data?.data ?? [];
  const paginate = data?.paginate;

  return {
    adjustmentTypeData,
    paginate,
    isLoading: isLoading || (!isEnabled && !data),
    isFetching,
    error,
    isUnauthorized,
  };
};

export const useAdjustmentTypeByIdQuery = (token: string, buCode: string, id: string) => {
  const isEnabled = Boolean(token) && Boolean(buCode) && Boolean(id);
  const pathName = `api/config/${buCode}/adjustment-type`;
  const API_URL = getApiUrl(pathName, id);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [adjustmentTypeQueryKey, buCode, id],
    queryFn: async () => {
      return getByIdApiRequest(API_URL, token, "Failed to fetch inventory adjustment type");
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

export const useAdjustmentTypeCreateMutation = (token: string, buCode: string) => {
  const queryClient = useQueryClient();
  const pathName = `api/config/${buCode}/adjustment-type`;
  const API_URL = getApiUrl(pathName);

  return useMutation({
    mutationFn: (data: AdjustmentTypeFormValues) =>
      postApiRequest(API_URL, token, data, "Failed to create inventory adjustment type"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [adjustmentTypeQueryKey, buCode] });
    },
  });
};

export const useUpdateAdjustmentTypeMutation = (token: string, buCode: string) => {
  const queryClient = useQueryClient();
  const pathName = `api/config/${buCode}/adjustment-type`;

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdjustmentTypeFormValues }) => {
      const API_URL = getApiUrl(pathName, id);
      return updateApiRequest(
        API_URL,
        token,
        data,
        "Failed to update inventory adjustment type",
        "PUT"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [adjustmentTypeQueryKey, buCode] });
    },
  });
};

export const useDeleteAdjustmentTypeMutation = (token: string, buCode: string) => {
  const queryClient = useQueryClient();
  const pathName = `api/config/${buCode}/adjustment-type`;

  return useMutation({
    mutationFn: (id: string) => {
      const API_URL = getApiUrl(pathName, id);
      return deleteApiRequest(API_URL, token, "Failed to delete inventory adjustment type");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [adjustmentTypeQueryKey, buCode] });
    },
  });
};
