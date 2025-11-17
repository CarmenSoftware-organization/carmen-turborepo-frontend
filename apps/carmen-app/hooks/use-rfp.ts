import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockRfps, getMockRfpById } from "@/mock-data/rfp"; // remove when use api
import {
  RfpDto,
  RfpDetailDto,
  RfpCreateDto,
  RfpUpdateDto,
} from "@/dtos/rfp.dto";
import { ParamsGetDto } from "@/dtos/param.dto";

// remove when use api
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// GET All RFPs
// ============================================================================
export const useRfps = (token: string, buCode: string, params?: ParamsGetDto) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["rfps", buCode, params],
    queryFn: async () => {
      await delay(300); // remove when use api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      return mockRfps; // remove when use api
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
// GET RFP by ID
// ============================================================================
export const useRfpById = (token: string, buCode: string, id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["rfp", buCode, id],
    queryFn: async () => {
      await delay(300); // remove when use api

      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use api
      const rfp = getMockRfpById(id);

      if (!rfp) {
        throw new Error("RFP not found");
      }

      return rfp;
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
// CREATE RFP
// ============================================================================
export const useCreateRfp = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RfpCreateDto) => {
      await delay(500); // remove when use api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use api
      const newId = `rfp-${String(mockRfps.length + 1).padStart(3, "0")}`;

      const newRfp: RfpDto = {
        id: newId,
        name: data.name,
        status: data.status,
        description: data.description,
        valid_period: data.valid_period,
        create_date: new Date(),
        update_date: new Date(),
        vendors: data.vendors,
      };

      return newRfp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfps", buCode] });
    },
  });
};

// ============================================================================
// UPDATE RFP
// ============================================================================
export const useUpdateRfp = (token: string, buCode: string, id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RfpUpdateDto) => {
      await delay(500); // remove when use api

      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }

      // remove when use api
      const existingRfp = getMockRfpById(id);

      if (!existingRfp) {
        throw new Error("RFP not found");
      }

      const updatedRfp: RfpDetailDto = {
        ...existingRfp,
        name: data.name,
        status: data.status,
        description: data.description,
        valid_period: data.valid_period,
        vendors: data.vendors,
        template: data.template_id
          ? { ...existingRfp.template, id: data.template_id }
          : existingRfp.template,
        settings: data.settings,
        id,
        update_date: new Date(),
      };

      return updatedRfp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfps", buCode] });
      queryClient.invalidateQueries({ queryKey: ["rfp", buCode, id] });
    },
  });
};

// ============================================================================
// DELETE RFP
// ============================================================================
export const useDeleteRfp = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await delay(500); // remove when use api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use api
      const rfp = getMockRfpById(id);

      if (!rfp) {
        throw new Error("RFP not found");
      }

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfps", buCode] });
    },
  });
};
