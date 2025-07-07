import { useMutation, useQuery } from "@tanstack/react-query";
import { ParamsGetDto } from "@/dtos/param.dto";
import { CreatePriceListDto, UpdatePriceListDto } from "@/dtos/price-list.dto";
import { backendApi } from "@/lib/backend-api";
import {
  deleteApiRequest,
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
} from "@/lib/config.api";

const API_URL = `${backendApi}/api/config/price-list`;
const queryKey = "price-list";

export const usePriceList = (
  token: string,
  tenantId: string,
  params?: ParamsGetDto
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, tenantId, params],
    queryFn: async () => {
      if (!token || !tenantId) {
        throw new Error("Unauthorized: Missing token or tenantId");
      }
      return getAllApiRequest(
        API_URL,
        token,
        tenantId,
        "Failed to fetch price list",
        params
      );
    },
    enabled: !!token && !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isUnauthorized =
    error instanceof Error && error.message.includes("Unauthorized");
  return { data, isLoading, error, isUnauthorized };
};

export const usePriceListById = (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_URL_BY_ID = `${API_URL}/${id}`;

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, tenantId, id],
    queryFn: async () => {
      if (!token || !tenantId) {
        throw new Error("Unauthorized: Missing token or tenantId");
      }
      return getByIdApiRequest(
        API_URL_BY_ID,
        token,
        tenantId,
        "Failed to fetch price list"
      );
    },
    enabled: !!token && !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isUnauthorized =
    error instanceof Error && error.message.includes("Unauthorized");

  return { data, isLoading, error, isUnauthorized };
};

export const useCreatePriceList = (token: string, tenantId: string) => {
  return useMutation({
    mutationFn: async (dataPriceList: CreatePriceListDto) => {
      return postApiRequest(
        API_URL,
        token,
        tenantId,
        dataPriceList,
        "Failed to create price list"
      );
    },
  });
};

export const useUpdatePriceList = (
  token: string,
  tenantId: string,
  id: string,
  dataPriceList: UpdatePriceListDto
) => {
  const API_URL_BY_ID = `${API_URL}/${id}`;
  const { data, error, isPending } = useMutation({
    mutationFn: async () => {
      return updateApiRequest(
        API_URL_BY_ID,
        token,
        tenantId,
        dataPriceList,
        "Failed to update price list",
        "PUT"
      );
    },
  });

  return { data, error, isPending };
};

export const useDeletePriceList = (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_URL_BY_ID = `${API_URL}/${id}`;
  return useMutation({
    mutationFn: async () => {
      return deleteApiRequest(
        API_URL_BY_ID,
        token,
        tenantId,
        id,
        "Failed to delete price list"
      );
    },
  });
};
