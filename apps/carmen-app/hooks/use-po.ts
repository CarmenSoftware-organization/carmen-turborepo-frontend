import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import {
  getAllApiRequest,
  getApiUrl,
  getByIdApiRequest,
  postApiRequest,
  requestHeaders,
  updateApiRequest,
} from "@/lib/config.api";
import axios from "axios";

const queryKey = "purchase-order";

export const usePoQuery = (token: string, buCode: string, params?: ParamsGetDto) => {
  const pathName = `api/${buCode}/purchase-order`;
  const API_URL = getApiUrl(pathName);
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return getAllApiRequest(API_URL, token, "Failed to fetch po", params);
    },
    enabled: !!token && !!buCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");
  const poData = data?.data;
  const paginate = data?.paginate;

  return { poData, paginate, isLoading, error, isUnauthorized };
};

export const usePoIdQuery = (token: string, buCode: string, id: string) => {
  const pathName = `api/${buCode}/purchase-order`;
  const API_URL = getApiUrl(pathName, id);

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, buCode, id],
    queryFn: async () => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing token, buCode, or id");
      }
      const response = await axios.get(API_URL, {
        headers: requestHeaders(token),
      });
      return response.data;
    },
    enabled: !!token && !!buCode && !!id,
    staleTime: 5 * 60 * 1000,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");

  const po = data?.data;

  return { po, isLoading, error, isUnauthorized };
};

export const usePoMutation = (token: string, buCode: string) => {
  const queryClient = useQueryClient();
  const pathName = `api/${buCode}/purchase-order`;

  const API_URL = getApiUrl(pathName);

  return useMutation<CommonResponseDto>({
    mutationFn: async (data) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return postApiRequest(API_URL, token, data, "Failed to create po");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey, buCode] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    },
  });
};
