import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PriceListTemplateListDto,
  PriceListTemplateDetailsDto,
} from "@/dtos/price-list-template.dto";
import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import {
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  requestHeaders,
  updateApiRequest,
} from "@/lib/config.api";
import axios from "axios";

const priceListTemplateApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/${buCode}/price-list-template`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

const queryKey = "price-list-templates";

export const usePriceListTemplates = (token: string, buCode: string, params?: ParamsGetDto) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, buCode, params],
    queryFn: async () => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return await getAllApiRequest(
        priceListTemplateApiUrl(buCode),
        token,
        "Error fetching price list templates",
        params ?? {}
      );
    },
    enabled: !!token && !!buCode,
  });

  const isUnauthorized = error instanceof Error && error.message.includes("Unauthorized");

  return {
    data,
    isLoading,
    error,
    isUnauthorized,
  };
};

// ============================================================================
// GET Price List Template by ID
// ============================================================================
export const usePriceListTemplateById = (token: string, buCode: string, id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["price-list-template", buCode, id],
    queryFn: async () => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return getByIdApiRequest(
        priceListTemplateApiUrl(buCode, id),
        token,
        "Failed to fetch price list template"
      );
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

// ============================================================================
// CREATE Price List Template
// ============================================================================
interface CreatePriceListTemplateDto {
  name: string;
  status: "active" | "inactive" | "draft";
  description?: string;
  valid_period: number;
  vendor_instruction?: string;
  currency_id: string;
  products: {
    add: {
      product_id: string;
      default_order?: { unit_id: string; unit_name: string };
      moq?: { unit_id: string; unit_name: string; qty: number; note?: string }[];
    }[];
  };
}

export const useCreatePriceListTemplate = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePriceListTemplateDto) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      return postApiRequest(
        priceListTemplateApiUrl(buCode),
        token,
        data,
        "Failed to create price list template"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-list-templates", buCode] });
    },
  });
};

// ============================================================================
// UPDATE Price List Template
// ============================================================================
interface UpdatePriceListTemplateDto {
  name?: string;
  status?: "active" | "inactive" | "draft";
  description?: string;
  valid_period?: number;
  vendor_instruction?: string;
  currency_id?: string;
  products?: {
    add?: {
      product_id: string;
      default_order?: { unit_id: string; unit_name: string };
      moq?: { unit_id: string; unit_name: string; qty: number; note?: string }[];
    }[];
    update?: {
      product_id: string;
      default_order?: { unit_id: string; unit_name: string };
      moq?: { unit_id: string; unit_name: string; qty: number; note?: string }[];
    }[];
    remove?: { id: string }[];
  };
}

export const useUpdatePriceListTemplate = (token: string, buCode: string, id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePriceListTemplateDto) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      return updateApiRequest(
        priceListTemplateApiUrl(buCode, id),
        token,
        data,
        "Failed to update price list template",
        "PATCH"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-list-templates", buCode] });
      queryClient.invalidateQueries({ queryKey: ["price-list-template", buCode, id] });
    },
  });
};

// ============================================================================
// DELETE Price List Template
// ============================================================================
export const useDeletePriceListTemplate = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      try {
        const API_URL_BY_ID = priceListTemplateApiUrl(buCode, id);
        const response = await axios.delete(API_URL_BY_ID, {
          headers: requestHeaders(token),
        });
        return response.data;
      } catch (error) {
        console.error("Error deleting price list template:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-list-templates", buCode] });
    },
  });
};
