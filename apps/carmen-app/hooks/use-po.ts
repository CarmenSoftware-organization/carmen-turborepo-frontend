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

interface CreatePoResponse {
  data: {
    id: string;
    po_no: string;
  };
  paginate: null;
  status: number;
  success: boolean;
  message: string;
  timestamp: string;
}

const queryKey = "purchase-order";

export const usePoQuery = (token: string, buCode: string, params?: ParamsGetDto) => {
  const isEnabled = Boolean(token) && Boolean(buCode);
  const pathName = `api/${buCode}/purchase-order`;
  const API_URL = getApiUrl(pathName);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [queryKey, buCode, params],
    queryFn: async () => {
      return getAllApiRequest(API_URL, token, "Failed to fetch all PO", params);
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");
  const poData = data?.data ?? [];
  const paginate = data?.paginate;

  return {
    poData,
    paginate,
    isLoading: isLoading || (!isEnabled && !data),
    isFetching,
    error,
    isUnauthorized,
  };
};

export const usePoIdQuery = (token: string, buCode: string, id: string) => {
  const isEnabled = Boolean(token) && Boolean(buCode) && Boolean(id);
  const pathName = `api/${buCode}/purchase-order`;
  const API_URL = getApiUrl(pathName, id);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [queryKey, buCode, id],
    queryFn: async () => {
      return await getByIdApiRequest(API_URL, token, "Error fetching PO by ID");
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");
  const po = data?.data;

  return {
    po,
    isLoading: isLoading || (!isEnabled && !data),
    isFetching,
    error,
    isUnauthorized,
  };
};

export const usePoMutation = (token: string, buCode: string) => {
  const queryClient = useQueryClient();
  const pathName = `api/${buCode}/purchase-order`;
  const API_URL = getApiUrl(pathName);

  return useMutation<CreatePoResponse, Error, unknown>({
    mutationFn: async (data: unknown) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return postApiRequest(API_URL, token, data, "Failed to create po");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey, buCode] });
    },
  });
};

export const usePoUpdateMutation = (token: string, buCode: string) => {
  const queryClient = useQueryClient();
  const pathName = `api/${buCode}/purchase-order`;

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      const API_URL = getApiUrl(pathName, id);
      return updateApiRequest(API_URL, token, data, "Failed to update po", "PUT");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKey, buCode] });
      queryClient.invalidateQueries({ queryKey: [queryKey, buCode, variables.id] });
    },
  });
};

export const usePoDeleteMutation = (token: string, buCode: string) => {
  const queryClient = useQueryClient();
  const pathName = `api/${buCode}/purchase-order`;

  return useMutation({
    mutationFn: async (id: string) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      const API_URL = getApiUrl(pathName, id);
      return deleteApiRequest(API_URL, token, "Failed to delete PO");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey, buCode] });
    },
  });
};
