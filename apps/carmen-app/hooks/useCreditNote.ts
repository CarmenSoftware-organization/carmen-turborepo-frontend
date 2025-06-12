import { CreditNoteGetAllDto } from "@/dtos/credit-note.dto";
import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import { getAllApiRequest, getByIdApiRequest } from "@/lib/config.api";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = `${backendApi}/api/credit-note`;

export const useCreditNoteQuery = (
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

export const useCreditNoteByIdQuery = (token: string, tenantId: string, id: string) => {
    const API_ID = `${API_URL}/${id}`;
    return useQuery({
        queryKey: ["credit-note-id", id],
        queryFn: async () => {
            if (!token || !tenantId) {
                throw new Error("Unauthorized: Missing token or tenantId");
            }
            return await getByIdApiRequest(
                API_ID,
                token,
                tenantId,
                "Error fetching credit note"
            );
        },
    });
};