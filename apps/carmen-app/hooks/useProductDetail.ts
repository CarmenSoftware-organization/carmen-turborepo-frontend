import { useEffect, useState, useCallback } from "react";
import { getProductIdService } from "@/services/product.service";
import { ProductFormValues } from "@/app/[locale]/(root)/product-management/product/pd-schema";

type UseProductDetailProps = {
  token: string | null;
  buCode: string | null;
  id: string;
  authLoading: boolean;
};

type UseProductDetailReturn = {
  product: ProductFormValues | undefined;
  loading: boolean;
  error: Error | null;
  loginDialogOpen: boolean;
  setLoginDialogOpen: (open: boolean) => void;
  refetch: () => Promise<void>;
};

export const useProductDetail = ({
  token,
  buCode,
  id,
  authLoading,
}: UseProductDetailProps): UseProductDetailReturn => {
  const [product, setProduct] = useState<ProductFormValues | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!token || !buCode) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getProductIdService(token, buCode, id);

      if (data.statusCode === 401) {
        setLoginDialogOpen(true);
        return;
      }

      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(error instanceof Error ? error : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [token, buCode, id]);

  useEffect(() => {
    if (!token || !buCode || authLoading) {
      return;
    }

    fetchProduct();
  }, [token, buCode, id, authLoading, fetchProduct]);

  return {
    product,
    loading,
    error,
    loginDialogOpen,
    setLoginDialogOpen,
    refetch: fetchProduct,
  };
};
