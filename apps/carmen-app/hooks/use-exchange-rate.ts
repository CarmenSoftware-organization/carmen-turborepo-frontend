import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import { getAllApiRequest, postApiRequest, updateApiRequest } from "@/lib/config.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ExchangeRateDto = {
  currency_id: string;
  at_date: string;
  exchange_rate: number;
};

export const useExchangeRateQuery = (token: string, buCode: string, params?: ParamsGetDto) => {
  const API_URL = `${backendApi}/api/config/${buCode}/exchange-rate/`;
  const { data, isLoading, error } = useQuery({
    queryKey: ["exchange-rate", buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getAllApiRequest(API_URL, token, "Error fetching exchange rate", params ?? {});
    },
    enabled: !!token && !!buCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");

  const excData = data?.data;
  const paginate = data?.paginate;

  return {
    excData,
    isLoading,
    error,
    isUnauthorized,
    totalItems: paginate?.total ?? 0,
    totalPages: paginate?.pages ?? 1,
    currentPage: paginate?.page ?? 1,
    perpage: paginate?.perpage ?? 10,
  };
};

export const useExchangeRateMutation = (token: string, buCode: string) => {
  const queryClient = useQueryClient();
  const API_URL = `${backendApi}/api/config/${buCode}/exchange-rate/`;
  return useMutation({
    mutationFn: async (data: ExchangeRateDto[]) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return postApiRequest(API_URL, token, data, "Failed to create exchange rate");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchange-rate", buCode] });
      queryClient.invalidateQueries({ queryKey: ["currencies", buCode] });
    },
  });
};

export const useExchangeRateUpdate = (token: string, buCode: string, idRecord: string) => {
  const queryClient = useQueryClient();
  const API_URL = `${backendApi}/api/config/${buCode}/exchange-rate/${idRecord}`;
  return useMutation({
    mutationFn: async (data: { exchange_rate: number }) => {
      if (!idRecord) {
        throw new Error("Missing record ID for update");
      }
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return updateApiRequest(API_URL, token, data, "Failed to update exchange rate", "PATCH");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchange-rate", buCode] });
      queryClient.invalidateQueries({ queryKey: ["currencies", buCode] });
    },
  });
};
