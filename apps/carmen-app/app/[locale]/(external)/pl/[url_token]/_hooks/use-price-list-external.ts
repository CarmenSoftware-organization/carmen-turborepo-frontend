"use client";

import { backendApi } from "@/lib/backend-api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function usePriceListExternal(urlToken: string) {
  return useQuery({
    queryKey: ["price-list", urlToken],
    queryFn: async () => {
      const { data } = await axios.post(`${backendApi}/api/check-price-list/${urlToken}`);
      return data?.data;
    },
    enabled: !!urlToken,
  });
}
