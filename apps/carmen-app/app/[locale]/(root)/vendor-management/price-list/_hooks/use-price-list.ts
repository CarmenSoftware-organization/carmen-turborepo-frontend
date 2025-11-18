import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  mockPriceListList,
  getMockPriceListById,
} from "../_mock/price-list-mock"; // remove when use real api
import type {
  PriceListDtoList,
  PriceListDetailDto,
  PriceListCreateDto,
  PriceListUpdateDto,
} from "../_dto/price-list-dto";
import type { ParamsGetDto } from "@/dtos/param.dto";

// remove when use real api
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// GET All Price Lists
// ============================================================================
export const usePriceLists = (token: string, buCode: string, params?: ParamsGetDto) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["price-lists", buCode, params],
    queryFn: async () => {
      await delay(300); // remove when use real api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      return mockPriceListList; // remove when use real api
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
// GET Price List by ID
// ============================================================================
export const usePriceListById = (token: string, buCode: string, id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["price-list", buCode, id],
    queryFn: async () => {
      await delay(300); // remove when use real api

      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use real api
      const priceList = getMockPriceListById(id);

      if (!priceList) {
        throw new Error("Price list not found");
      }

      return priceList;
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
// CREATE Price List
// ============================================================================
export const useCreatePriceList = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PriceListCreateDto) => {
      await delay(500); // remove when use real api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use real api
      const newId = `pl-${String(mockPriceListList.length + 1).padStart(3, "0")}`;

      const vendor = mockPriceListList.find((pl) => pl.vendor.id === data.vendorId)?.vendor || {
        id: data.vendorId,
        name: "New Vendor",
      };

      const currency = mockPriceListList.find((pl) => pl.currency.id === data.currencyId)
        ?.currency || {
        id: data.currencyId,
        code: "THB",
      };

      const rfp = data.rfpId
        ? mockPriceListList.find((pl) => pl.rfp?.id === data.rfpId)?.rfp || {
            id: data.rfpId,
            name: "New RFP",
          }
        : undefined;

      const newPriceList: PriceListDtoList = {
        id: newId,
        no: data.no,
        vendor,
        rfp,
        description: data.description,
        status: data.status,
        itemsCount: 0,
        currency,
        isActive: data.status === "active",
        effectivePeriod: data.effectivePeriod,
        lastUpdate: new Date().toISOString(),
      };

      return newPriceList;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-lists", buCode] });
    },
  });
};

// ============================================================================
// UPDATE Price List
// ============================================================================
export const useUpdatePriceList = (token: string, buCode: string, id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PriceListUpdateDto) => {
      await delay(500); // remove when use real api

      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }

      // remove when use real api
      const existingPriceList = getMockPriceListById(id);

      if (!existingPriceList) {
        throw new Error("Price list not found");
      }

      const vendor = mockPriceListList.find((pl) => pl.vendor.id === data.vendorId)?.vendor || {
        id: data.vendorId,
        name: "Updated Vendor",
      };

      const currency = mockPriceListList.find((pl) => pl.currency.id === data.currencyId)
        ?.currency || {
        id: data.currencyId,
        code: "THB",
      };

      const rfp = data.rfpId
        ? mockPriceListList.find((pl) => pl.rfp?.id === data.rfpId)?.rfp || {
            id: data.rfpId,
            name: "Updated RFP",
          }
        : undefined;

      const updatedProducts = data.products
        ? existingPriceList.products.map((product) => {
            const updatedProduct = data.products?.find((p) => p.id === product.id);
            if (updatedProduct) {
              return {
                ...product,
                moqs: updatedProduct.moqs,
                lastUpdate: new Date().toISOString(),
              };
            }
            return product;
          })
        : existingPriceList.products;

      const updatedPriceList: PriceListDetailDto = {
        ...existingPriceList,
        no: data.no,
        vendor,
        rfp,
        description: data.description,
        status: data.status,
        currency,
        isActive: data.status === "active",
        effectivePeriod: data.effectivePeriod,
        products: updatedProducts,
        itemsCount: updatedProducts.length,
        lastUpdate: new Date().toISOString(),
      };

      return updatedPriceList;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-lists", buCode] });
      queryClient.invalidateQueries({ queryKey: ["price-list", buCode, id] });
    },
  });
};

// ============================================================================
// DELETE Price List
// ============================================================================
export const useDeletePriceList = (token: string, buCode: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await delay(500); // remove when use real api

      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }

      // remove when use real api
      const priceList = getMockPriceListById(id);

      if (!priceList) {
        throw new Error("Price list not found");
      }

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-lists", buCode] });
    },
  });
};
