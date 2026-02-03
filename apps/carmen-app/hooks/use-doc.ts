import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi, xAppId } from "@/lib/backend-api";
import { getAllApiRequest } from "@/lib/config.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useDocumentQuery = (token: string, buCode: string, params?: ParamsGetDto) => {
  const API_URL = `${backendApi}/api/${buCode}/documents`;
  const { data, isLoading, error } = useQuery({
    queryKey: ["document", buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getAllApiRequest(API_URL, token, "Error fetching bu type", params ?? {});
    },
    enabled: !!token && !!buCode,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");
  const docData = data?.data;
  const pagination = data?.pagination;
  return {
    docData,
    pagination,
    isLoading,
    error,
    isUnauthorized,
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
