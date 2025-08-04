import { useCallback } from "react";
import {
  VendorGetDto
} from "@/dtos/vendor-management";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllApiRequest, getByIdApiRequest, postApiRequest, updateApiRequest } from "@/lib/config.api";
import { VendorFormValues } from "@/dtos/vendor.dto";

const API_URL = `${backendApi}/api/config/vendors`;

export const useVendor = (
  token: string,
  tenantId: string,
  params?: ParamsGetDto
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor", tenantId, params],
    queryFn: async () => {
      if (!token || !tenantId) {
        throw new Error("Unauthorized: Missing token or tenantId");
      }
      return await getAllApiRequest(
        API_URL,
        token,
        tenantId,
        "Error fetching vendors",
        params ?? {}
      );
    },
    enabled: !!token && !!tenantId,
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
  tenantId: string,
  id: string
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor", tenantId, id],
    queryFn: async () => {
      if (!token || !tenantId || !id) {
        throw new Error("Unauthorized: Missing token or tenantId");
      }
      return await getByIdApiRequest(
        `${API_URL}/${id}`,
        token,
        tenantId,
        "Error fetching vendor"
      );
    },
    enabled: !!token && !!tenantId && !!id,
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
  tenantId: string
) => {
  return useMutation({
    mutationFn: async (data: VendorFormValues) => {
      return await postApiRequest(
        API_URL,
        token,
        tenantId,
        data,
        "Error creating vendor"
      );
    },
  });
};

export const useUpdateVendor = (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_ID = `${API_URL}/${id}`;
  return useMutation({
    mutationFn: async (data: VendorFormValues) => {
      if (!token || !tenantId || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      return updateApiRequest(
        API_ID,
        token,
        tenantId,
        data,
        "Failed to update vendor",
        "PATCH"
      );
    },
  });
};