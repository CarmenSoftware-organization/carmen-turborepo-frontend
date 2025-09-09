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

const buTypeApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/vendor-business-type`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useBuTypeQuery = (
  token: string,
  buCode: string,
  params?: ParamsGetDto
) => {
  const API_URL = buTypeApiUrl(buCode);
  const { data, isLoading, error } = useQuery({
    queryKey: ["bu-type", buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getAllApiRequest(
        API_URL,
        token,
        "Error fetching bu type",
        params ?? {}
      );
    },
    enabled: !!token && !!buCode,
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

export const useBuTypeMutation = (token: string, buCode: string) => {
  const API_URL = buTypeApiUrl(buCode);
  return useMutation({
    mutationFn: async (data: BuTypeFormDto) => {
      return await postApiRequest(
        API_URL,
        token,
        data,
        "Error creating bu type"
      );
    },
  });
};

export const useUpdateBuType = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_ID = buTypeApiUrl(buCode, id);
  return useMutation({
    mutationFn: async (data: BuTypeEditDto) => {
      return await updateApiRequest(
        API_ID,
        token,
        data,
        "Error updating bu type",
        "PATCH"
      );
    },
  });
};

export const useDeleteBuType = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_ID = buTypeApiUrl(buCode, id);
  return useMutation({
    mutationFn: async () => {
      return await deleteApiRequest(
        API_ID,
        token,
        id,
        "Error deleting bu type"
      );
    },
  });
};
