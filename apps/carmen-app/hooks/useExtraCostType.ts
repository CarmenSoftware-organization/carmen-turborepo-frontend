import { ExtraCostTypeDto } from "@/dtos/extra-cost-type.dto";
import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import {
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
} from "@/lib/config.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = `${backendApi}/api/config/extra-cost-type`;

export const useExtraCostTypeQuery = (
  token: string,
  tenantId: string,
  params?: ParamsGetDto
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["credit-note", tenantId, params],
    queryFn: async () => {
      if (!token || !tenantId) {
        throw new Error("Unauthorized: Missing token or tenantId");
      }
      return await getAllApiRequest(
        API_URL,
        token,
        tenantId,
        "Error fetching credit term",
        params ?? {}
      );
    },
    enabled: !!token && !!tenantId,
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
  tenantId: string,
  id: string
) => {
  const API_ID = `${API_URL}/${id}`;
  return useQuery({
    queryKey: ["extra-cost", id],
    queryFn: async () => {
      if (!token || !tenantId) {
        throw new Error("Unauthorized: Missing token or tenantId");
      }
      return await getByIdApiRequest(
        API_ID,
        token,
        tenantId,
        "Error fetching extra cost type"
      );
    },
  });
};

export const useExtraCostTypeMutation = (token: string, tenantId: string) => {
  return useMutation({
    mutationFn: async (data: ExtraCostTypeDto) => {
      return await postApiRequest(
        API_URL,
        token,
        tenantId,
        data,
        "Error creating extra cost type"
      );
    },
  });
};

export const useCreateExtraCostType = (token: string, tenantId: string) => {
  return useMutation({
    mutationFn: async (data: ExtraCostTypeDto) => {
      if (!token || !tenantId) {
        throw new Error("Unauthorized: Missing token or tenantId");
      }
      return postApiRequest(
        API_URL,
        token,
        tenantId,
        data,
        "Failed to create extra cost type"
      );
    },
  });
};

export const useUpdateExtraCostType = (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_ID = `${API_URL}/${id}`;
  return useMutation({
    mutationFn: async (data: ExtraCostTypeDto) => {
      if (!token || !tenantId || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      return updateApiRequest(
        API_ID,
        token,
        tenantId,
        data,
        "Failed to update extra cost type",
        "PATCH"
      );
    },
  });
};

export const useDeleteExtraCostType = (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_ID = `${API_URL}/${id}`;
  return useMutation({
    mutationFn: async () => {
      if (!token || !tenantId || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      return updateApiRequest(
        API_ID,
        token,
        tenantId,
        {},
        "Failed to delete extra cost type",
        "DELETE"
      );
    },
  });
};
