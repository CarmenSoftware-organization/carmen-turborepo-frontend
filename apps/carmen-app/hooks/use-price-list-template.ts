import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  mockPriceListTemplates,
  getMockPriceListTemplateById,
} from "@/mock-data/price-list-template"; // remove when use api
import {
  PriceListTemplateListDto,
  PriceListTemplateDetailsDto,
} from "@/dtos/price-list-template.dto";
import { ParamsGetDto } from "@/dtos/param.dto";

// remove when use api
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// GET All Price List Templates
// ============================================================================
export const usePriceListTemplates = (token: string, buCode: string, params?: ParamsGetDto) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["price-list-templates", buCode, params],
    queryFn: async () => {
      await delay(300); // remove when use api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      return mockPriceListTemplates; // remove when use api
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
      await delay(300); // remove when use api

      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use api
      const template = getMockPriceListTemplateById(id);

      if (!template) {
        throw new Error("Price List Template not found");
      }

      return template;
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
      await delay(500); // remove when use api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use api
      const newId = `plt-${String(mockPriceListTemplates.length + 1).padStart(3, "0")}`;

      const newTemplate: PriceListTemplateListDto = {
        id: newId,
        name: data.name,
        status: data.status,
        description: data.description,
        vendor_instruction: data.vendor_instruction,
        valid_period: data.valid_period,
        create_date: new Date(),
        update_date: new Date(),
      };

      return newTemplate;
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
      id: string;
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
      await delay(500); // remove when use api

      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }

      // remove when use api
      const existingTemplate = getMockPriceListTemplateById(id);

      if (!existingTemplate) {
        throw new Error("Price List Template not found");
      }

      const updatedTemplate: PriceListTemplateDetailsDto = {
        ...existingTemplate,
        name: data.name ?? existingTemplate.name,
        status: data.status ?? existingTemplate.status,
        description: data.description ?? existingTemplate.description,
        valid_period: data.valid_period ?? existingTemplate.valid_period,
        vendor_instruction: data.vendor_instruction ?? existingTemplate.vendor_instruction,
        update_date: new Date(),
      };

      return updatedTemplate;
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
      await delay(500); // remove when use api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use api
      const template = getMockPriceListTemplateById(id);

      if (!template) {
        throw new Error("Price List Template not found");
      }

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-list-templates", buCode] });
    },
  });
};
