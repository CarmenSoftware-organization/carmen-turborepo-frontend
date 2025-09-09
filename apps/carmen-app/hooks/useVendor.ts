import { useCallback } from "react";
import {
  VendorGetDto
} from "@/dtos/vendor-management";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllApiRequest, getByIdApiRequest, postApiRequest, updateApiRequest } from "@/lib/config.api";
import { VendorFormValues } from "@/dtos/vendor.dto";

const vendorApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/vendors`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useVendor = (
  token: string,
  buCode: string,
  params?: ParamsGetDto
) => {
  const API_URL = vendorApiUrl(buCode);
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor", buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getAllApiRequest(
        API_URL,
        token,
        "Error fetching vendors",
        params ?? {}
      );
    },
    enabled: !!token && !!buCode,
  });

  const vendors = data;

  const getVendorName = useCallback(
    (vendorId: string) => {
      const vendor = vendors?.data?.find((v: VendorGetDto) => v.id === vendorId);
      return vendor?.name ?? "";
    },
    [vendors]
  );

  const isUnauthorized =
    error instanceof Error && error.message.includes("Unauthorized");

  return {
    vendors,
    getVendorName,
    isLoading,
    isUnauthorized,
  };
}

export const useVendorById = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_ID = vendorApiUrl(buCode, id);
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor", buCode, id],
    queryFn: async () => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getByIdApiRequest(
        API_ID,
        token,
        "Error fetching vendor"
      );
    },
    enabled: !!token && !!buCode && !!id,
  });

  const vendor = data;
  const isUnauthorized =
    error instanceof Error && error.message.includes("Unauthorized");

  return {
    vendor,
    isLoading,
    isUnauthorized,
  };
}

export const useVendorMutation = (
  token: string,
  buCode: string
) => {
  const API_URL = vendorApiUrl(buCode);
  return useMutation({
    mutationFn: async (data: VendorFormValues) => {
      return await postApiRequest(
        API_URL,
        token,
        data,
        "Error creating vendor"
      );
    },
  });
};

export const useUpdateVendor = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_ID = vendorApiUrl(buCode, id);
  return useMutation({
    mutationFn: async (data: VendorFormValues) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      return updateApiRequest(
        API_ID,
        token,
        data,
        "Failed to update vendor",
        "PATCH"
      );
    },
  });
};