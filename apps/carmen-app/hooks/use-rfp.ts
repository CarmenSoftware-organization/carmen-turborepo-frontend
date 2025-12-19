import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RfpCreateDto, RfpUpdateDto, RfpDto, RfpDetailDto } from "@/dtos/rfp.dto";
import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import {
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
  requestHeaders,
} from "@/lib/config.api";
import axios from "axios";

const rfpApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/${buCode}/request-for-pricing`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useRfps = (token: string, buCode: string, params?: ParamsGetDto) => {
  const API_URL = rfpApiUrl(buCode);

  const { data, isLoading, error } = useQuery({
    queryKey: ["rfps", buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      return await getAllApiRequest(
        API_URL,
        token,
        "Error fetching request price lists",
        params ?? {}
      );
    },
    enabled: !!token && !!buCode,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");
  const rfps = data?.data;

  return {
    rfps,
    isLoading,
    error,
    isUnauthorized,
  };
};

export const useRfpById = (token: string, buCode: string, id: string) => {
  const API_ID = rfpApiUrl(buCode, id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["rfp", buCode, id],
    queryFn: async () => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      return await getByIdApiRequest(API_ID, token, "Error fetching request price list details");
    },
    enabled: !!token && !!buCode && !!id,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");

  return {
    data,
    isLoading,
    error,
    isUnauthorized,
  };
};

export const useCreateRfp = (token: string, buCode: string) => {
  const queryClient = useQueryClient();
  const API_URL = rfpApiUrl(buCode);

  return useMutation<RfpDto, Error, RfpCreateDto>({
    mutationFn: async (data: RfpCreateDto) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      return (await postApiRequest(
        API_URL,
        token,
        data,
        "Error creating request price list"
      )) as RfpDto;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfps", buCode] });
    },
  });
};

export const useUpdateRfp = (token: string, buCode: string, id: string) => {
  const queryClient = useQueryClient();
  const API_ID = rfpApiUrl(buCode, id);

  return useMutation<RfpDetailDto, Error, RfpUpdateDto>({
    mutationFn: async (data: RfpUpdateDto) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }

      return (await updateApiRequest(
        API_ID,
        token,
        data,
        "Error updating request price list",
        "PATCH"
      )) as RfpDetailDto;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfps", buCode] });
      queryClient.invalidateQueries({ queryKey: ["rfp", buCode, id] });
    },
  });
};

export const useDeleteRfp = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      try {
        const API_URL = rfpApiUrl(buCode, id);
        const response = await axios.delete(API_URL, {
          headers: requestHeaders(token),
        });
        return response.data;
      } catch (error) {
        console.error("Error deleting request price list:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfps", buCode] });
    },
  });
};
