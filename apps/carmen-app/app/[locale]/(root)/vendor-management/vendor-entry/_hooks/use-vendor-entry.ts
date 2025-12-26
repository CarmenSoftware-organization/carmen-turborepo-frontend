import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VendorItemDto, CreateVendorItemDto } from "../_dto/vendor-entry.dto";
import { mockVendorEntry } from "../_mock/vp.data";

// remove when use real api
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// GET Vendor Portal
// ============================================================================
export const useVendorEntry = (token: string, buCode: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor-entry", buCode],
    queryFn: async () => {
      await delay(300); // remove when use real api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      return mockVendorEntry; // remove when use real api
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
export const useVendorEntryItemById = (token: string, buCode: string, id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor-entry-item", buCode, id],
    queryFn: async () => {
      await delay(300); // remove when use real api

      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use real api
      const item = mockVendorEntry.items.find((item: VendorItemDto) => item.id === id);

      if (!item) {
        throw new Error("Vendor entry item not found");
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
export const useCreateVendorEntryItem = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVendorItemDto) => {
      await delay(500); // remove when use real api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use real api
      const newId = `vp-${String(mockVendorEntry.items.length + 1).padStart(3, "0")}`;

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
export const useUpdateVendorEntryItem = (token: string, buCode: string, id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CreateVendorItemDto>) => {
      await delay(500); // remove when use real api

      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }

      // remove when use real api
      const existingItem = mockVendorEntry.items.find((item: VendorItemDto) => item.id === id);

      if (!existingItem) {
        throw new Error("Vendor entry item not found");
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
      queryClient.invalidateQueries({ queryKey: ["vendor-entry", buCode] });
      queryClient.invalidateQueries({ queryKey: ["vendor-entry-item", buCode, id] });
    },
  });
};

// ============================================================================
// DELETE Vendor Portal Item
// ============================================================================
export const useDeleteVendorEntryItem = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await delay(500); // remove when use real api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use real api
      const item = mockVendorEntry.items.find((item: VendorItemDto) => item.id === id);

      if (!item) {
        throw new Error("Vendor entry item not found");
      }

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-entry", buCode] });
    },
  });
};

// ============================================================================
// SUBMIT Vendor Portal
// ============================================================================
export const useSubmitVendorEntry = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await delay(500); // remove when use real api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use real api
      mockVendorEntry.status = "submitted";

      return mockVendorEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-entry", buCode] });
    },
  });
};
