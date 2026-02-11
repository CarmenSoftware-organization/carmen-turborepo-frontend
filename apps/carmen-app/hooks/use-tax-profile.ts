import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import {
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
  requestHeaders,
} from "@/lib/config.api";
import { TaxProfileEditDto, TaxProfileFormData, TaxProfileGetAllDto } from "@/dtos/tax-profile.dto";
import axios from "axios";

const taxProfileApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/tax-profile`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useTaxProfileQuery = (
  token: string,
  buCode: string,
  params?: ParamsGetDto
) => {

  const API_URL = taxProfileApiUrl(buCode);

  const { data, isLoading, error } = useQuery({
    queryKey: ["tax-profile", buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getAllApiRequest(
        API_URL,
        token,
        "Error fetching tax profile",
        params ?? {}
      );
    },
    enabled: !!token && !!buCode,
    staleTime: 5 * 60 * 1000,
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
  buCode: string,
  id: string
) => {
  const API_ID = taxProfileApiUrl(buCode, id);
  return useQuery({
    queryKey: ["tax-profile", buCode, id],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getByIdApiRequest(
        API_ID,
        token,
        "Error fetching tax profile"
      );
    },
    enabled: !!token && !!buCode && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTaxProfileMutation = (token: string, buCode: string) => {
  const API_URL = taxProfileApiUrl(buCode);

  return useMutation({
    mutationFn: async (data: TaxProfileFormData) => {
      return await postApiRequest(
        API_URL,
        token,
        data,
        "Error creating tax profile"
      );
    },
  });
};

export const useUpdateTaxProfile = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_ID = taxProfileApiUrl(buCode, id);
  return useMutation({
    mutationFn: async (data: TaxProfileEditDto) => {
      return await updateApiRequest(
        API_ID,
        token,
        data,
        "Error updating tax profile",
        "PATCH"
      );
    },
  });
};

export const useDeleteTaxProfile = (
  token: string,
  buCode: string
) => {
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const API_URL = taxProfileApiUrl(buCode, id);
        const response = await axios.delete(API_URL, {
          headers: requestHeaders(token),
        });
        return response.data;
      } catch (error) {
        console.error("Error deleting tax profile:", error);
        throw error;
      }
    },
  });
};
