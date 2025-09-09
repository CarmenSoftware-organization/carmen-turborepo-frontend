import {
  CreditTermGetAllDto,
  CreateCreditTermFormValues,
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
  buCode: string,
  params?: ParamsGetDto
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["credit-term", buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getAllApiRequest(
        API_URL,
        token,
        buCode,
        "Error fetching credit term",
        params ?? {}
      );
    },
    enabled: !!token && !!buCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const creditTerms = data?.data;

  const isUnauthorized =
    error instanceof Error && error.message.includes("Unauthorized");

  const getCreditTermName = useCallback(
    (creditTermId: string) => {
      if (!creditTerms || !Array.isArray(creditTerms)) return "";
      const creditTerm = creditTerms.find(
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

export const useCreateCreditTerm = (token: string, buCode: string) => {
  return useMutation({
    mutationFn: async (data: CreateCreditTermFormValues) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return postApiRequest(
        API_URL,
        token,
        buCode,
        data,
        "Failed to create credit term"
      );
    },
  });
};

export const useUpdateCreditTerm = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_URL_BY_ID = `${API_URL}/${id}`;

  return useMutation({
    mutationFn: async (data: CreateCreditTermFormValues) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      return updateApiRequest(
        API_URL_BY_ID,
        token,
        buCode,
        data,
        "Failed to update credit term",
        "PATCH"
      );
    },
  });
};

export const useDeleteCreditTerm = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_URL_BY_ID = `${API_URL}/${id}`;

  return useMutation({
    mutationFn: async () => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      return deleteApiRequest(
        API_URL_BY_ID,
        token,
        buCode,
        id,
        "Failed to delete credit term"
      );
    },
  });
};
