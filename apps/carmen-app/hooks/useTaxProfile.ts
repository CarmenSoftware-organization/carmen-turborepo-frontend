import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import {
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
  deleteApiRequest,
} from "@/lib/config.api";
import { TaxProfileBaseDto, TaxProfileGetAllDto } from "@/dtos/tax-profile.dto";

const API_URL = `${backendApi}/api/config/tax-profile`;

export const useTaxProfileQuery = (
  token: string,
  tenantId: string,
  params?: ParamsGetDto
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tax-profile", tenantId, params],
    queryFn: async () => {
      if (!token || !tenantId) {
        throw new Error("Unauthorized: Missing token or tenantId");
      }
      return await getAllApiRequest(
        API_URL,
        token,
        tenantId,
        "Error fetching tax profile",
        params ?? {}
      );
    },
    enabled: !!token && !!tenantId,
  });

  const taxProfiles = data;
  const isUnauthorized =
    error instanceof Error && error.message.includes("Unauthorized");

  const getTaxProfileName = useCallback(
    (taxProfileId: string) => {
      const taxProfile = taxProfiles?.find(
        (tp: TaxProfileGetAllDto) => tp.id === taxProfileId
      );
      return taxProfile?.name ?? "";
    },
    [taxProfiles]
  );

  return {
    taxProfiles,
    getTaxProfileName,
    isLoading,
    error,
    isUnauthorized,
  };
};

export const useTaxProfileByIdQuery = (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_ID = `${API_URL}/${id}`;
  return useQuery({
    queryKey: ["tax-profile-id", id],
    queryFn: async () => {
      if (!token || !tenantId) {
        throw new Error("Unauthorized: Missing token or tenantId");
      }
      return await getByIdApiRequest(
        API_ID,
        token,
        tenantId,
        "Error fetching tax profile"
      );
    },
    enabled: !!token && !!tenantId && !!id,
  });
};

export const useTaxProfileMutation = (token: string, tenantId: string) => {
  return useMutation({
    mutationFn: async (data: TaxProfileBaseDto) => {
      return await postApiRequest(
        API_URL,
        token,
        tenantId,
        data,
        "Error creating tax profile"
      );
    },
  });
};

export const useUpdateTaxProfile = (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_ID = `${API_URL}/${id}`;
  return useMutation({
    mutationFn: async (data: TaxProfileBaseDto) => {
      return await updateApiRequest(
        API_ID,
        token,
        tenantId,
        data,
        "Error updating tax profile",
        "PATCH"
      );
    },
  });
};

export const useDeleteTaxProfile = (
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
        "Error deleting tax profile"
      );
    },
  });
};
