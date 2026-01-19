import { ParamsGetDto } from "@/dtos/param.dto";
import {
  CreatePrtDto,
  UpdatePrtDto,
} from "@/app/[locale]/(root)/procurement/purchase-request-template/_schema/prt.schema";
import { backendApi } from "@/lib/backend-api";
import {
  getAllApiRequest,
  postApiRequest,
  requestHeaders,
  updateApiRequest,
} from "@/lib/config.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface CreatePrtResponse {
  data: {
    id: string;
  };
  paginate: null;
  status: number;
  success: boolean;
  message: string;
  timestamp: string;
}

const prTemplateApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/${buCode}/purchase-request-template`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const usePrTemplateQuery = (token: string, buCode: string, params?: ParamsGetDto) => {
  const API_URL = prTemplateApiUrl(buCode);

  const { data, isLoading, error } = useQuery({
    queryKey: ["pr-template", buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getAllApiRequest(API_URL, token, "Error fetching PR ", params ?? {});
    },
    enabled: !!token && !!buCode,
    staleTime: 5 * 60 * 1000,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");

  const prTmplData = data?.data;
  const paginate = data?.paginate;

  return {
    prTmplData,
    paginate,
    isLoading,
    error,
    isUnauthorized,
  };
};

export const usePrTemplateByIdQuery = (token: string, buCode: string, id: string) => {
  const API_URL = prTemplateApiUrl(buCode, id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["pr-template", buCode, id],
    queryFn: async () => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing token, buCode, or id");
      }
      const response = await axios.get(API_URL, {
        headers: requestHeaders(token),
      });
      return response.data;
    },
    enabled: !!token && !!buCode && !!id,
    staleTime: 5 * 60 * 1000,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");

  const prTemplate = data?.data;

  return {
    prTemplate,
    isLoading,
    error,
    isUnauthorized,
  };
};

export const useCreatePrTemplate = (token: string, buCode: string) => {
  const queryClient = useQueryClient();
  const API_URL = prTemplateApiUrl(buCode);
  return useMutation<CreatePrtResponse, Error, CreatePrtDto>({
    mutationFn: async (data: CreatePrtDto) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return postApiRequest(API_URL, token, data, "Failed to create pr template");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pr-template", buCode] });
    },
  });
};

export const useUpdatePrTemplate = (token: string, buCode: string, id: string) => {
  const queryClient = useQueryClient();
  const API_URL_BY_ID = prTemplateApiUrl(buCode, id);
  return useMutation({
    mutationFn: async (data: UpdatePrtDto) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      return updateApiRequest(API_URL_BY_ID, token, data, "Failed to update pr template", "PUT");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pr-template", buCode, id] });
    },
  });
};

export const useDeletePrTemplate = (token: string, buCode: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      const API_URL_BY_ID = prTemplateApiUrl(buCode, id);
      const response = await axios.delete(API_URL_BY_ID, {
        headers: requestHeaders(token),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pr-template", buCode] });
    },
  });
};
