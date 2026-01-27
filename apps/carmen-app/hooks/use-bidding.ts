import { backendApi } from "@/lib/backend-api";
import { requestHeaders } from "@/lib/config.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface PriceCompareParams {
  product_id: string;
  unit_id: string;
  currency_id: string;
  at_date?: string;
}

export interface PriceCompareResponse {
  product_id: string;
  unit_id: string;
  currency_id: string;
  data: unknown;
}

const priceCompareApiUrl = (buCode: string, params: PriceCompareParams) => {
  const { product_id, unit_id, currency_id, at_date } = params;
  const dateParam = at_date || new Date().toISOString().split("T")[0];
  return `${backendApi}/api/${buCode}/pricelist/price-compare?product_id=${product_id}&unit_id=${unit_id}&at_date=${dateParam}&currency_id=${currency_id}`;
};

// Plain async function for fetching single price compare
export const fetchPriceCompare = async (
  token: string,
  buCode: string,
  params: PriceCompareParams
): Promise<unknown> => {
  if (!token || !buCode) {
    throw new Error("Missing required parameters");
  }

  const { product_id, unit_id, currency_id } = params;

  if (!product_id || !unit_id || !currency_id) {
    throw new Error("Missing required query parameters");
  }

  const API_URL = priceCompareApiUrl(buCode, params);

  const response = await axios.get(API_URL, {
    headers: requestHeaders(token),
  });

  return response.data;
};

// Hook for single price compare query
export const usePriceCompare = (
  token: string,
  buCode: string,
  params: PriceCompareParams,
  enabled: boolean = true
) => {
  const { product_id, unit_id, currency_id, at_date } = params;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["price-compare", buCode, product_id, unit_id, currency_id, at_date],
    queryFn: () => fetchPriceCompare(token, buCode, params),
    enabled: enabled && !!token && !!buCode && !!product_id && !!unit_id && !!currency_id,
    staleTime: 5 * 60 * 1000,
  });

  return { data, isLoading, error, refetch };
};

// Hook for bulk price compare (multiple items in parallel)
export const usePriceCompareBulk = (token: string, buCode: string) => {
  return useMutation({
    mutationFn: async (items: PriceCompareParams[]): Promise<PriceCompareResponse[]> => {
      if (!token || !buCode) {
        throw new Error("Missing required parameters");
      }

      const results = await Promise.all(
        items.map(async (item) => {
          try {
            const data = await fetchPriceCompare(token, buCode, item);
            return {
              product_id: item.product_id,
              unit_id: item.unit_id,
              currency_id: item.currency_id,
              data,
            };
          } catch (error) {
            console.error(`Failed to fetch price compare for product ${item.product_id}:`, error);
            return {
              product_id: item.product_id,
              unit_id: item.unit_id,
              currency_id: item.currency_id,
              data: null,
            };
          }
        })
      );

      return results;
    },
  });
};
