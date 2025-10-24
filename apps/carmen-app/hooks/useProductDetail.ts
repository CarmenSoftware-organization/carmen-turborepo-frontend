import { useEffect, useState } from "react";
import { useProductByIdQuery } from "./use-product";
import { ProductFormValues } from "@/dtos/product.dto";

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
  refetch: () => void;
};

export const useProductDetail = ({
  token,
  buCode,
  id,
  authLoading,
}: UseProductDetailProps): UseProductDetailReturn => {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  // Use the new useProductByIdQuery hook
  const { data, isLoading, error, refetch } = useProductByIdQuery({
    token: token || "",
    buCode: buCode || "",
    id,
    enabled: !!token && !!buCode && !authLoading,
  });

  // Check for 401 status
  useEffect(() => {
    if (error && error.message.includes("401")) {
      setLoginDialogOpen(true);
    }
  }, [error]);

  return {
    product: data as ProductFormValues | undefined,
    loading: isLoading,
    error: error instanceof Error ? error : null,
    loginDialogOpen,
    setLoginDialogOpen,
    refetch,
  };
};
