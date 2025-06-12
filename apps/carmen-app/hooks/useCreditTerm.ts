import {
  CreditTermGetAllDto,
  CreateCreditTermDto,
} from "@/dtos/credit-term.dto";
import { ParamsGetDto } from "@/dtos/param.dto";
import {
  deleteApiRequest,
  getAllApiRequest,
  postApiRequest,
  updateApiRequest,
} from "@/lib/config.api";
import { backendApi } from "@/lib/backend-api";
import { useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

const API_URL = `${backendApi}/api/config/credit-term`;

export const useCreditTermQuery = (
  token: string,
  tenantId: string,
  params?: ParamsGetDto
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["credit-term", tenantId, params],
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const creditTerms = data;
  const isUnauthorized =
    error instanceof Error && error.message.includes("Unauthorized");

  const getCreditTermName = useCallback(
    (creditTermId: string) => {
      const creditTerm = creditTerms?.find(
        (ct: CreditTermGetAllDto) => ct.id === creditTermId
      );
      return creditTerm?.name ?? "";
    },
    [creditTerms]
  );

  return {
    creditTerms,
    isLoading,
    error,
    isUnauthorized,
    getCreditTermName,
  };
};

export const useCreateCreditTerm = (token: string, tenantId: string) => {
  return useMutation({
    mutationFn: async (data: CreateCreditTermDto) => {
      if (!token || !tenantId) {
        throw new Error("Unauthorized: Missing token or tenantId");
      }
      return postApiRequest(
        API_URL,
        token,
        tenantId,
        data,
        "Failed to create credit term"
      );
    },
  });
};

export const useUpdateCreditTerm = (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_URL_BY_ID = `${API_URL}/${id}`;

  return useMutation({
    mutationFn: async (data: CreateCreditTermDto) => {
      if (!token || !tenantId || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      return updateApiRequest(
        API_URL_BY_ID,
        token,
        tenantId,
        data,
        "Failed to update credit term",
        "PATCH"
      );
    },
  });
};

export const useDeleteCreditTerm = (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_URL_BY_ID = `${API_URL}/${id}`;

  return useMutation({
    mutationFn: async () => {
      if (!token || !tenantId || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      return deleteApiRequest(
        API_URL_BY_ID,
        token,
        tenantId,
        "Failed to delete credit term"
      );
    }
  });
};
