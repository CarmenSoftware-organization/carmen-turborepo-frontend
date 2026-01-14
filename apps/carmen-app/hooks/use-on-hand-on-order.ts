import { backendApi } from "@/lib/backend-api";
import { getAllApiRequest } from "@/lib/config.api";
import { useQuery } from "@tanstack/react-query";

// Plain async function for use in callbacks (not a hook)
export const fetchOnHandOrder = async (
  token: string,
  buCode: string,
  locationId: string,
  productId: string
) => {
  if (!token || !buCode || !locationId || !productId) {
    throw new Error("Missing required parameters");
  }
  const API_URL = `${backendApi}/api/${buCode}/locations/${locationId}/product/${productId}/inventory`;
  const response = await getAllApiRequest(API_URL, token, "Failed to fetch on hand order");
  return response.data;
};

// React Query hook
export const useOnHandOrder = (
  token: string,
  buCode: string,
  locationId: string,
  productId: string
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["on-hand-order", buCode, locationId, productId],
    queryFn: async () => {
      const API_URL = `${backendApi}/api/${buCode}/locations/${locationId}/product/${productId}/inventory`;
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      const response = await getAllApiRequest(API_URL, token, "Failed to fetch on hand order");

      return response.data;
    },
  });

  return { data, isLoading, error };
};
