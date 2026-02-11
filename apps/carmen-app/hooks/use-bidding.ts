import { backendApi } from "@/lib/backend-api";
import { requestHeaders } from "@/lib/config.api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface PriceCompareParams {
  product_id: string;
  unit_id: string;
  currency_id: string;
  at_date?: string;
}

export const fetchPriceCompare = async (
  token: string,
  buCode: string,
  params: PriceCompareParams
) => {
  const { product_id, unit_id, currency_id, at_date } = params;
  const url = `${backendApi}/api/${buCode}/price-list/price-compare?product_id=${product_id}&unit_id=${unit_id}&at_date=${at_date}&currency_id=${currency_id}`;
  const response = await axios.get(url, {
    headers: requestHeaders(token),
  });
  return response.data?.data?.lists;
};

export const usePriceCompareQuery = (
  token: string,
  buCode: string,
  params: PriceCompareParams,
  enabled: boolean = false
) => {
  const { product_id, unit_id, currency_id, at_date } = params;

  return useQuery({
    queryKey: ["price-compare", buCode, product_id, unit_id, currency_id, at_date],
    queryFn: async () => {
      const url = `${backendApi}/api/${buCode}/price-list/price-compare?product_id=${product_id}&unit_id=${unit_id}&at_date=${at_date}&currency_id=${currency_id}`;
      const response = await axios.get(url, {
        headers: requestHeaders(token),
      });

      return response.data?.data?.lists;
    },
    enabled: enabled && !!token && !!buCode && !!product_id && !!unit_id && !!currency_id,
  });
};
