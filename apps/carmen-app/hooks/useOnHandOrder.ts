import { backendApi } from "@/lib/backend-api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
  });

  return { data, isLoading, error };
};
