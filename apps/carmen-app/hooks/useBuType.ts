import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import {
  getAllApiRequest,
//   getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
  deleteApiRequest,
} from "@/lib/config.api";
import {
  BuTypeEditDto,
  BuTypeFormDto,
  BuTypeGetAllDto,
} from "@/dtos/bu-type.dto";

const API_URL = `${backendApi}/api/config/vendor-business-type`;

export const useBuTypeQuery = (
  token: string,
  tenantId: string,
  params?: ParamsGetDto
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bu-type", tenantId, params],
    queryFn: async () => {
      if (!token || !tenantId) {
        throw new Error("Unauthorized: Missing token or tenantId");
      }
      return await getAllApiRequest(
        API_URL,
        token,
        tenantId,
        "Error fetching bu type",
        params ?? {}
      );
    },
    enabled: !!token && !!tenantId,
  });

  const buTypes = data;
  const isUnauthorized =
    error instanceof Error && error.message.includes("Unauthorized");

  const getBuTypeName = useCallback(
    (buTypeId: string) => {
      const buType = buTypes?.find((bt: BuTypeGetAllDto) => bt.id === buTypeId);
      return buType?.name ?? "";
    },
    [buTypes]
  );

  return {
    buTypes,
    getBuTypeName,
    isLoading,
    error,
    isUnauthorized,
  };
};

export const useBuTypeMutation = (token: string, tenantId: string) => {
  return useMutation({
    mutationFn: async (data: BuTypeFormDto) => {
      return await postApiRequest(
        API_URL,
        token,
        tenantId,
        data,
        "Error creating bu type"
      );
    },
  });
};

export const useUpdateBuType = (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_ID = `${API_URL}/${id}`;
  return useMutation({
    mutationFn: async (data: BuTypeEditDto) => {
      return await updateApiRequest(
        API_ID,
        token,
        tenantId,
        data,
        "Error updating bu type",
        "PATCH"
      );
    },
  });
};

export const useDeleteBuType = (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_ID = `${API_URL}/${id}`;
  return useMutation({
    mutationFn: async () => {
      return await deleteApiRequest(
        API_ID,
        token,
        tenantId,
        id,
        "Error deleting bu type"
      );
    },
  });
};
