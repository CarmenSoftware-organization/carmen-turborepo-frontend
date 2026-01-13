import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import { getAllApiRequest, postApiRequest } from "@/lib/config.api";
import { useMutation, useQuery } from "@tanstack/react-query";

type ExchangeRateDto = {
  currency_id: string;
  at_date: string;
  exchange_rate: number;
};

export const useExchangeRateQuery = (token: string, buCode: string, params?: ParamsGetDto) => {
  const API_URL = `${backendApi}/api/config/${buCode}/exchange-rate/`;
  const { data, isLoading, error } = useQuery({
    queryKey: ["credit-term", buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getAllApiRequest(API_URL, token, "Error fetching credit term", params ?? {});
    },
    enabled: !!token && !!buCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");

  const excData = data?.data;
  return {
    excData,
    isLoading,
    error,
    isUnauthorized,
  };
};

export const useCreateCreditTerm = (token: string, buCode: string) => {
  const API_URL = `${backendApi}/api/config/${buCode}/exchange-rate/`;
  return useMutation({
    mutationFn: async (data: ExchangeRateDto) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return postApiRequest(API_URL, token, data, "Failed to create credit term");
    },
  });
};
