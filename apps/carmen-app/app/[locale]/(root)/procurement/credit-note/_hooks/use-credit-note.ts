import { CreditNoteFormDto, CreditNoteGetAllDto } from "@/dtos/credit-note.dto";
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

const creditNoteApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/credit-note`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useCreditNoteQuery = (
  token: string,
  buCode: string,
  params?: ParamsGetDto
) => {
  const API_URL = creditNoteApiUrl(buCode);
  const { data, isLoading, error } = useQuery({
    queryKey: ["credit-note", params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getAllApiRequest(
        API_URL,
        token,
        "Error fetching credit note",
        params ?? {}
      );
    },
    enabled: !!token && !!buCode,
  });

  const creditNotes = data;
  const isUnauthorized =
    error instanceof Error && error.message.includes("Unauthorized");

  const getCreditNoteName = useCallback(
    (creditNoteId: string) => {
      const creditNote = creditNotes?.find(
        (cn: CreditNoteGetAllDto) => cn.id === creditNoteId
      );
      return creditNote?.name ?? "";
    },
    [creditNotes]
  );

  return {
    creditNotes,
    getCreditNoteName,
    isLoading,
    error,
    isUnauthorized,
  };
};

export const useCreditNoteByIdQuery = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_ID = creditNoteApiUrl(buCode, id);
  return useQuery({
    queryKey: ["credit-note-id", id],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getByIdApiRequest(
        API_ID,
        token,
        "Error fetching credit note"
      );
    },
  });
};

export const useCreditNoteMutation = (token: string, buCode: string) => {
  const API_URL = creditNoteApiUrl(buCode);
  return useMutation({
    mutationFn: async (data: CreditNoteFormDto) => {
      return await postApiRequest(
        API_URL,
        token,
        data,
        "Error creating credit note"
      );
    },
  });
};

export const useCreateCreditNote = (token: string, buCode: string) => {
  const API_URL = creditNoteApiUrl(buCode);
  return useMutation({
    mutationFn: async (data: CreditNoteFormDto) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return postApiRequest(
        API_URL,
        token,
        data,
        "Failed to create credit note"
      );
    },
  });
};

export const useUpdateCreditNote = (
  token: string,
  buCode: string,
  id: string
) => {
  const API_ID = creditNoteApiUrl(buCode, id);
  return useMutation({
    mutationFn: async (data: CreditNoteFormDto) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      return updateApiRequest(
        API_ID,
        token,
        data,
        "Failed to update credit note",
        "PATCH"
      );
    },
  });
};
