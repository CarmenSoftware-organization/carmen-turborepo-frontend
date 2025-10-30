import { useQuery } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { getAllApiRequest } from "@/lib/config.api";
import { useCallback } from "react";

const productApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/products`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useProductQuery = ({
  token,
  buCode,
  params,
}: {
  token: string;
  buCode: string;
  params?: ParamsGetDto;
}) => {
  const API_URL = productApiUrl(buCode);

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", params],
    queryFn: async () => {
      try {
        const result = await getAllApiRequest(API_URL, token, "Error fetching products", params);
        return result;
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    },
    enabled: !!token && !!buCode,
  });
  const products = data;

  const getProductName = useCallback(
    (productId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const product = products?.data.find((p: any) => p.id === productId);
      return product?.name ?? "";
    },
    [products]
  );

  return { products, isLoading, error, getProductName };
};
