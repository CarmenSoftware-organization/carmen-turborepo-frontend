import { backendApi } from "@/lib/backend-api";
import {
  getAllApiRequest,
  postApiRequest,
  updateApiRequest,
  requestHeaders,
} from "@/lib/config.api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { UnitDto, CreateUnitDto, UpdateUnitDto } from "@/dtos/unit.dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import axios from "axios";

const unitApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/units`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useUnitQuery = ({
  token,
  buCode,
  params,
}: {
  token: string;
  buCode: string;
  params?: ParamsGetDto;
}) => {
  const API_URL = unitApiUrl(buCode);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["units", params],
    queryFn: async () => {
      if (!token || !buCode) throw new Error("Unauthorized");
      return await getAllApiRequest(API_URL, token, "Error fetching units", params);
    },
    enabled: !!token && !!buCode,
  });

  const getUnitName = useCallback(
    (unitId: string) => {
      const unit = data?.data.find((u: UnitDto) => u.id === unitId);
      return unit?.name ?? "";
    },
    [data]
  );

  const units = data;
  return { units, isLoading, error, getUnitName, refetch };
};

export const useUnitMutation = (token: string, buCode: string) => {
  const API_URL = unitApiUrl(buCode);
  return useMutation({
    mutationFn: async (data: CreateUnitDto) => {
      return await postApiRequest(API_URL, token, data, "Error creating unit");
    },
  });
};

export const useUpdateUnit = (token: string, buCode: string, id: string) => {
  const API_URL_BY_ID = unitApiUrl(buCode, id);
  return useMutation({
    mutationFn: async (data: UpdateUnitDto) => {
      return await updateApiRequest(API_URL_BY_ID, token, data, "Error updating unit", "PUT");
    },
  });
};

export const useDeleteUnit = (token: string, buCode: string) => {
  return useMutation({
    mutationFn: async (id: string) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      try {
        const API_URL_BY_ID = unitApiUrl(buCode, id);
        const response = await axios.delete(API_URL_BY_ID, {
          headers: requestHeaders(token),
        });
        return response.data;
      } catch (error) {
        console.error("Error deleting unit:", error);
        throw error;
      }
    },
  });
};

export const useOrderUnitByProduct = ({
  token,
  buCode,
  productId,
  enabled = true,
}: {
  token: string;
  buCode: string;
  productId: string;
  enabled?: boolean;
}) => {
  const API_URL = `${backendApi}/api/${buCode}/unit/order/product/${productId}`;

  const { data, isLoading, error } = useQuery({
    queryKey: ["order-units-by-product", buCode, productId],
    queryFn: async () => {
      if (!token || !buCode || !productId) throw new Error("Missing required parameters");

      const response = await getAllApiRequest(
        API_URL,
        token,
        "Error fetching order units by product"
      );
      return response;
    },
    enabled: !!token && !!buCode && !!productId && enabled,
  });

  return { data, isLoading, error };
};
