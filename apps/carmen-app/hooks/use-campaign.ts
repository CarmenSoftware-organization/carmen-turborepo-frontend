import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockCampaigns, getMockCampaignById } from "@/mock-data/campaign"; // remove when use api
import {
  CampaignDto,
  CampaignDetailDto,
  CampaignCreateDto,
  CampaignUpdateDto,
} from "@/dtos/campaign.dto";
import { ParamsGetDto } from "@/dtos/param.dto";

// remove when use api
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// GET All Campaigns
// ============================================================================
export const useCampaigns = (token: string, buCode: string, params?: ParamsGetDto) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["campaigns", buCode, params],
    queryFn: async () => {
      await delay(300); // remove when use api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      return mockCampaigns; // remove when use api
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
// GET Campaign by ID
// ============================================================================
export const useCampaignById = (token: string, buCode: string, id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["campaign", buCode, id],
    queryFn: async () => {
      await delay(300); // remove when use api

      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use api
      const campaign = getMockCampaignById(id);

      if (!campaign) {
        throw new Error("Campaign not found");
      }

      return campaign;
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
// CREATE Campaign
// ============================================================================
export const useCreateCampaign = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CampaignCreateDto) => {
      await delay(500); // remove when use api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use api
      const newId = `rpl-${String(mockCampaigns.length + 1).padStart(3, "0")}`;

      const newCampaign: CampaignDto = {
        id: newId,
        name: data.name,
        status: data.status,
        description: data.description,
        valid_period: data.valid_period,
        create_date: new Date(),
        update_date: new Date(),
        vendors: data.vendors,
      };

      return newCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns", buCode] });
    },
  });
};

// ============================================================================
// UPDATE Campaign
// ============================================================================
export const useUpdateCampaign = (token: string, buCode: string, id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CampaignUpdateDto) => {
      await delay(500); // remove when use api

      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }

      // remove when use api
      const existingCampaign = getMockCampaignById(id);

      if (!existingCampaign) {
        throw new Error("Campaign not found");
      }

      const updatedCampaign: CampaignDetailDto = {
        ...existingCampaign,
        name: data.name,
        status: data.status,
        description: data.description,
        valid_period: data.valid_period,
        vendors: data.vendors,
        template: data.template_id
          ? { ...existingCampaign.template, id: data.template_id }
          : existingCampaign.template,
        settings: data.settings,
        id,
        update_date: new Date(),
      };

      return updatedCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns", buCode] });
      queryClient.invalidateQueries({ queryKey: ["campaign", buCode, id] });
    },
  });
};

// ============================================================================
// DELETE Campaign
// ============================================================================
export const useDeleteCampaign = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await delay(500); // remove when use api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use api
      const campaign = getMockCampaignById(id);

      if (!campaign) {
        throw new Error("Campaign not found");
      }

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns", buCode] });
    },
  });
};
