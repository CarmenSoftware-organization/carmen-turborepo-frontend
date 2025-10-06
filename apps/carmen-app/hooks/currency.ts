import { getAllApiRequest } from "@/lib/config.api";
import { backendApi, exchangeRateApiKey } from "@/lib/backend-api";
import { useQuery } from "@tanstack/react-query";
import { ParamsGetDto } from "@/dtos/param.dto";
import { useCallback } from "react";
import { CurrencyGetDto } from "@/dtos/currency.dto";
import { PaginatedResponseDto } from "@/dtos/paginated-response.dto";

const API_URL = `${backendApi}/api/config/currencies`;

export const useCurrencyQuery = (
  token: string,
  buCode: string,
  params?: ParamsGetDto
) => {
  const { data, isLoading, error } = useQuery<
    PaginatedResponseDto<CurrencyGetDto>
  >({
    queryKey: ["currency", buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getAllApiRequest(
        API_URL,
        token,
        "Error fetching currency",
        params ?? {}
      );
    },
    enabled: !!token && !!buCode,
    staleTime: 5 * 60 * 1000,
  });

  const currencies = data;
  const isUnauthorized =
    error instanceof Error && error.message.includes("Unauthorized");

  const getCurrencyName = useCallback(
    (currencyId: string) => {
      const currency = currencies?.data?.find(
        (c: CurrencyGetDto) => c.id === currencyId
      );
      return currency?.name ?? "";
    },
    [currencies?.data]
  );

  return {
    currencies,
    isLoading,
    error,
    isUnauthorized,
    getCurrencyName,
  };
};

const getExchangeRateApiUrl = (base: string): string =>
  `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/${base}`;

export const useExchangeRateQuery = (baseCurrency: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["exchange-rate", baseCurrency],
    queryFn: async () => {
      if (!baseCurrency) {
        throw new Error("Base currency is required");
      }
      const url = getExchangeRateApiUrl(baseCurrency);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
      }
      return response.json();
    },
    enabled: !!baseCurrency,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  if (error) {
    console.error("Error fetching exchange rates:", error);
  }

  return {
    exchangeRates: data,
    isLoading,
    error,
  };
};
