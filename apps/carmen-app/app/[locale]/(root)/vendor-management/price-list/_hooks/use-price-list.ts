import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockPriceListList, getMockPriceListById } from "../_mock/price-list-mock"; // remove when use real api
import type {
  PriceListDtoList,
  PriceListDetailDto,
  PriceListCreateDto,
  PriceListUpdateDto,
} from "../_dto/price-list-dto";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import {
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  requestHeaders,
  updateApiRequest,
} from "@/lib/config.api";
import { CreatePriceListDto, UpdatePriceListDto } from "@/dtos/price-list.dto";
import axios from "axios";

const queryKey = "price-list";

const priceListApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/price-list`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const usePriceList = (token: string, buCode: string, params?: ParamsGetDto) => {
  const API_URL = priceListApiUrl(buCode);

  console.log("API_URL", API_URL);

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return getAllApiRequest(API_URL, token, "Failed to fetch price list", params);
    },
    enabled: !!token && !!buCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log("data", data);

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");

  return { data, isLoading, error, isUnauthorized };
};

export const usePriceListById = (token: string, buCode: string, id: string) => {
  const API_URL_BY_ID = priceListApiUrl(buCode, id);

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, buCode, id],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return getByIdApiRequest(API_URL_BY_ID, token, "Failed to fetch price list");
    },
    enabled: !!token && !!buCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");

  return { data, isLoading, error, isUnauthorized };
};

export const useCreatePriceList = (token: string, buCode: string) => {
  const API_URL = priceListApiUrl(buCode);
  return useMutation({
    mutationFn: async (dataPriceList: CreatePriceListDto) => {
      return postApiRequest(API_URL, token, dataPriceList, "Failed to create price list");
    },
  });
};

export const useUpdatePriceList = (
  token: string,
  buCode: string,
  id: string,
  dataPriceList: UpdatePriceListDto
) => {
  const API_URL_BY_ID = priceListApiUrl(buCode, id);
  const { data, error, isPending } = useMutation({
    mutationFn: async () => {
      return updateApiRequest(
        API_URL_BY_ID,
        token,
        dataPriceList,
        "Failed to update price list",
        "PUT"
      );
    },
  });

  return { data, error, isPending };
};

export const useDeletePriceList = (token: string, buCode: string) => {
  return useMutation({
    mutationFn: async (id: string) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      try {
        const API_URL_BY_ID = priceListApiUrl(buCode, id);
        const response = await axios.delete(API_URL_BY_ID, {
          headers: requestHeaders(token),
        });
        return response.data;
      } catch (error) {
        console.error("Error deleting price list:", error);
        throw error;
      }
    },
  });
};
