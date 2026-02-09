import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi, xAppId } from "@/lib/backend-api";
import { getAllApiRequest } from "@/lib/config.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const queryKeyDocument = "document";

interface UseDocumentQueryParams {
  token: string;
  buCode: string;
  params?: ParamsGetDto;
}

export const useDocumentQuery = ({ token, buCode, params }: UseDocumentQueryParams) => {
  const API_URL = `${backendApi}/api/${buCode}/documents`;
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeyDocument, buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getAllApiRequest(API_URL, token, "Error fetching documents", params ?? {});
    },
    enabled: !!token && !!buCode,
  });

  const documents = data;
  return {
    documents,
    isLoading,
    error,
  };
};

export const useUploadDocument = (token: string, buCode: string) => {
  const API_URL = `${backendApi}/api/${buCode}/documents/upload`;
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          "x-app-id": xAppId,
        },
      });
      return response.data;
    },
  });
};

export const useDeleteDocument = (token: string, buCode: string) => {
  const API_URL = `${backendApi}/api/${buCode}/documents`;
  return useMutation({
    mutationFn: async (fileToken: string) => {
      const response = await axios.delete(`${API_URL}/${fileToken}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-app-id": xAppId,
        },
      });
      return response.data;
    },
  });
};
