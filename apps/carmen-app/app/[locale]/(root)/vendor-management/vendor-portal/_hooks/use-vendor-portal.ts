import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VendorItemDto, CreateVendorItemDto } from "../_dto/vendor-portal.dto";
import { mockVendorPortal } from "../_mock/vp.data";

// remove when use real api
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// GET Vendor Portal
// ============================================================================
export const useVendorPortal = (token: string, buCode: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor-portal", buCode],
    queryFn: async () => {
      await delay(300); // remove when use real api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      return mockVendorPortal; // remove when use real api
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
// GET Vendor Portal Item by ID
// ============================================================================
export const useVendorPortalItemById = (token: string, buCode: string, id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor-portal-item", buCode, id],
    queryFn: async () => {
      await delay(300); // remove when use real api

      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use real api
      const item = mockVendorPortal.items.find((item: VendorItemDto) => item.id === id);

      if (!item) {
        throw new Error("Vendor portal item not found");
      }

      return item;
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
// CREATE Vendor Portal Item
// ============================================================================
export const useCreateVendorPortalItem = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVendorItemDto) => {
      await delay(500); // remove when use real api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use real api
      const newId = `vp-${String(mockVendorPortal.items.length + 1).padStart(3, "0")}`;

      // remove when use real api
      const newItem: VendorItemDto = {
        id: newId,
        code: data.code,
        description: data.description,
        unit: data.unit,
        price: data.price,
        leadTimeInDays: data.leadTimeInDays,
        moqTiers:
          data.moqTiers?.map((tier, index) => ({
            id: `tier-${newId}-${String(index + 1).padStart(3, "0")}`,
            minimumQuantity: tier.minimumQuantity,
            price: tier.price,
            leadTimeInDays: tier.leadTimeInDays,
          })) || [],
      };

      return newItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-portal", buCode] });
    },
  });
};

// ============================================================================
// UPDATE Vendor Portal Item
// ============================================================================
export const useUpdateVendorPortalItem = (token: string, buCode: string, id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CreateVendorItemDto>) => {
      await delay(500); // remove when use real api

      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }

      // remove when use real api
      const existingItem = mockVendorPortal.items.find((item: VendorItemDto) => item.id === id);

      if (!existingItem) {
        throw new Error("Vendor portal item not found");
      }

      // remove when use real api
      const updatedItem: VendorItemDto = {
        ...existingItem,
        code: data.code ?? existingItem.code,
        description: data.description ?? existingItem.description,
        unit: data.unit ?? existingItem.unit,
        price: data.price ?? existingItem.price,
        leadTimeInDays: data.leadTimeInDays ?? existingItem.leadTimeInDays,
        moqTiers:
          data.moqTiers?.map((tier, index) => ({
            id: tier.minimumQuantity
              ? existingItem.moqTiers[index]?.id ||
                `tier-${id}-${String(index + 1).padStart(3, "0")}`
              : `tier-${id}-${String(index + 1).padStart(3, "0")}`,
            minimumQuantity: tier.minimumQuantity,
            price: tier.price,
            leadTimeInDays: tier.leadTimeInDays,
          })) ?? existingItem.moqTiers,
      };

      return updatedItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-portal", buCode] });
      queryClient.invalidateQueries({ queryKey: ["vendor-portal-item", buCode, id] });
    },
  });
};

// ============================================================================
// DELETE Vendor Portal Item
// ============================================================================
export const useDeleteVendorPortalItem = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await delay(500); // remove when use real api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use real api
      const item = mockVendorPortal.items.find((item: VendorItemDto) => item.id === id);

      if (!item) {
        throw new Error("Vendor portal item not found");
      }

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-portal", buCode] });
    },
  });
};

// ============================================================================
// SUBMIT Vendor Portal
// ============================================================================
export const useSubmitVendorPortal = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await delay(500); // remove when use real api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use real api
      mockVendorPortal.status = "submitted";

      return mockVendorPortal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-portal", buCode] });
    },
  });
};
