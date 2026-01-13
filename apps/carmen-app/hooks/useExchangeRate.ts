import { useQuery } from "@tanstack/react-query";
import { exchangeRateApiKey } from "@/lib/backend-api";

type ExchangeRateResponse = {
  result: string;
  base_code: string;
  conversion_rates: Record<string, number>;
  time_last_update_utc: string;
};

type UseExchangeRateProps = {
  baseCurrency: string;
};

const fetchExchangeRates = async (baseCurrency: string): Promise<ExchangeRateResponse> => {
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/${baseCurrency}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rates: ${response.status}`);
  }

  const data: ExchangeRateResponse = await response.json();

  if (data.result !== "success") {
    throw new Error("Exchange rate API returned an error");
  }

  return data;
};

export const useExchangeRate = ({ baseCurrency }: UseExchangeRateProps) => {
  if (!baseCurrency) {
    throw new Error("Base currency is required");
  }

  const query = useQuery({
    queryKey: ["exchangeRates", baseCurrency],
    queryFn: () => fetchExchangeRates(baseCurrency),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    exchangeRates: query.data?.conversion_rates || {},
    lastUpdated: query.data?.time_last_update_utc || "",
    baseCurrency: query.data?.base_code || baseCurrency,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
};
