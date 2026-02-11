import { ExtraCostTypeDto } from "@/dtos/extra-cost-type.dto";
import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import {
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
  requestHeaders,
} from "@/lib/config.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import axios from "axios";

const extraCostTypeApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/extra-cost-type`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useExtraCostTypeQuery = (
  token: string,
  buCode: string,
  params?: ParamsGetDto
) => {
  const API_URL = extraCostTypeApiUrl(buCode);

  const { data, isLoading, error } = useQuery({
    queryKey: ["extra-cost-type", buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getAllApiRequest(
        API_URL,
        token,
        "Error fetching extra cost type",
        params ?? {}
      );
    },
    enabled: !!token && !!buCode,
    staleTime: 5 * 60 * 1000,
  });

  const extraCostTypes = data;
  const isUnauthorized =
    error instanceof Error && error.message.includes("Unauthorized");

  const getExtraCostTypeName = useCallback(
    (extraCostTypeId: string) => {
      const extraCostType = extraCostTypes?.find(
        (ec: ExtraCostTypeDto) => ec.id === extraCostTypeId
      );
      return extraCostType?.name ?? "";
    },
    [extraCostTypes]
  );

  return {
    extraCostTypes,
    getExtraCostTypeName,
    isLoading,
    error,
    isUnauthorized,
  };
};

export const useExtraCostTypeByIdQuery = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_ID = extraCostTypeApiUrl(buCode, id);
  return useQuery({
    queryKey: ["extra-cost", id],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getByIdApiRequest(
        API_ID,
        token,
        "Error fetching extra cost type"
      );
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useExtraCostTypeMutation = (token: string, buCode: string) => {
  const API_URL = extraCostTypeApiUrl(buCode);

  return useMutation({
    mutationFn: async (data: ExtraCostTypeDto) => {
      return await postApiRequest(
        API_URL,
        token,
        data,
        "Error creating extra cost type"
      );
    },
  });
};

export const useCreateExtraCostType = (token: string, buCode: string) => {
  const API_URL = extraCostTypeApiUrl(buCode);
  return useMutation({
    mutationFn: async (data: ExtraCostTypeDto) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return postApiRequest(
        API_URL,
        token,
        data,
        "Failed to create extra cost type"
      );
    },
  });
};

export const useUpdateExtraCostType = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_ID = extraCostTypeApiUrl(buCode, id);
  return useMutation({
    mutationFn: async (data: ExtraCostTypeDto) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      return updateApiRequest(
        API_ID,
        token,
        data,
        "Failed to update extra cost type",
        "PATCH"
      );
    },
  });
};

export const useDeleteExtraCostType = (
  token: string,
  buCode: string
) => {
  return useMutation({
    mutationFn: async (id: string) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      try {
        const API_ID = extraCostTypeApiUrl(buCode, id);
        const response = await axios.delete(API_ID, {
          headers: requestHeaders(token),
        });
        return response.data;
      } catch (error) {
        console.error("Error deleting extra cost type:", error);
        throw error;
      }
    },
  });
};
