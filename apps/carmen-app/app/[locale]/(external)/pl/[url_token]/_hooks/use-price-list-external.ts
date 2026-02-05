"use client";

import { backendApi } from "@/lib/backend-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  PricelistExternalDto,
  PricelistExternalDetailDto,
  MoqTierDto,
} from "../_components/pl-external.dto";

// Re-export types for convenience
export type { PricelistExternalDto, PricelistExternalDetailDto, MoqTierDto };

export function usePriceListExternal(urlToken: string) {
  return useQuery({
    queryKey: ["price-list", urlToken],
    queryFn: async () => {
      const { data } = await axios.post(`${backendApi}/api/check-price-list/${urlToken}`);
      return data?.data as PricelistExternalDto;
    },
    enabled: !!urlToken,
  });
}

// Mutation hook for updating external price list
export function useUpdatePriceListExternal(urlToken: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: PricelistExternalDto) => {
      // Transform form data to API payload (PriceListUpdateDto format)
      const payload = {
        products: formData.tb_pricelist_detail.map((item) => ({
          id: item.product_id,
          moqs: (item.moq_tiers || []).map((tier) => ({
            minQuantity: tier.minimum_quantity,
            unit: item.unit_name || "",
            price: tier.price,
            leadTimeDays: tier.lead_time_days ?? 0,
          })),
        })),
      };

      const { data } = await axios.patch(
        `${backendApi}/api/price-list-external/${urlToken}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-list", urlToken] });
    },
  });
}

// Mutation hook for submitting external price list
export function useSubmitPriceListExternal(urlToken: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: PricelistExternalDto) => {
      // Transform form data to API payload (PriceListUpdateDto format)
      const payload = {
        products: formData.tb_pricelist_detail.map((item) => ({
          id: item.product_id,
          moqs: (item.moq_tiers || []).map((tier) => ({
            minQuantity: tier.minimum_quantity,
            unit: item.unit_name || "",
            price: tier.price,
            leadTimeDays: tier.lead_time_days ?? 0,
          })),
        })),
      };

      const { data } = await axios.post(
        `${backendApi}/api/price-list-external/${urlToken}/submit`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-list", urlToken] });
    },
  });
}
