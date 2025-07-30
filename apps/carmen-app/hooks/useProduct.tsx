import { useState, useEffect, useCallback, useMemo } from "react";
import { ProductGetDto } from "@/dtos/product.dto";
import {
  getProductService,
  deleteProductService,
} from "@/services/product.service";
import { useURL } from "@/hooks/useURL";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type UseProductProps = {
  initialSearch?: string;
  initialStatus?: string;
  initialSort?: string;
  initialPage?: string;
};

// Define a type for the query data
type ProductQueryData = {
  products: ProductGetDto[];
  totalPages: number;
};

export const useProduct = ({
  initialSearch = "",
  initialStatus = "",
  initialSort = "",
  initialPage = "1",
}: UseProductProps = {}) => {
  const queryClient = useQueryClient();
  const { token, tenantId } = useAuth();
  const [search, setSearch] = useURL("search", { defaultValue: initialSearch });
  const [status, setStatus] = useURL("status", { defaultValue: initialStatus });
  const [sort, setSort] = useURL("sort", { defaultValue: initialSort });
  const [page, setPage] = useURL("page", { defaultValue: initialPage });
  const [statusOpen, setStatusOpen] = useState(false);
  const [loginRequired, setLoginRequired] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (search) {
      setPage("");
    }
  }, [search, setPage]);

  const {
    data,
    isLoading,
    error: queryError,
    isError,
  } = useQuery({
    queryKey: ["products", search, sort, page, status, tenantId],
    queryFn: async () => {
      const response = await getProductService(token, tenantId, {
        search,
        sort,
        page,
        ...(status ? { filter: status } : {}),
      });

      if (response.statusCode === 401) {
        setLoginRequired(true);
        throw new Error("Unauthorized");
      }

      if (response.statusCode === 400) {
        throw new Error("Invalid request parameters");
      }

      if (response.statusCode && response.statusCode >= 400) {
        throw new Error(response.message ?? "Unknown error occurred");
      }

      return {
        products: response.data ?? [],
        totalPages: response.paginate?.pages ?? 1,
        totalItems: response.paginate?.total ?? 0,
      };
    },
    enabled: !!token && !!tenantId,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await deleteProductService(token, tenantId, productId);
      if (response.error) {
        throw new Error(response.message);
      }
      return productId;
    },
    onSuccess: (productId) => {
      queryClient.setQueryData(
        ["products", search, sort, page, status, tenantId],
        (oldData: ProductQueryData | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            products: oldData.products.filter(
              (product: ProductGetDto) => product.id !== productId
            ),
          };
        }
      );
      setDeleteDialogOpen(false);
      setDeleteId(null);
    },
    onError: (error) => {
      console.error("Failed to delete product:", error);
    },
  });

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const products = useMemo(() => data?.products ?? [], [data]);
  const totalPages = data?.totalPages ?? 1;
  const totalItems = data?.totalItems ?? 0;
  const error = isError
    ? queryError?.message || "Failed to load products"
    : null;

  const getProductName = useCallback(
    (id: string) => {
      const product = products.find(
        (product: ProductGetDto) => product.id === id
      );
      return product?.name ?? "";
    },
    [products]
  );

  return {
    // Data
    products,
    isLoading,
    error,
    totalPages,
    totalItems,
    currentPage: parseInt(page || "1"),

    // Filter states
    search,
    status,
    sort,
    statusOpen,

    // Delete states
    deleteDialogOpen,
    isDeleting: deleteMutation.isPending,
    deleteId,

    // Auth state
    loginRequired,

    // Setters and handlers
    setSearch,
    setStatus,
    setStatusOpen,
    setSort,
    handlePageChange,
    handleDelete,
    confirmDelete,
    closeDeleteDialog,
    getProductName,
  };
};

export default useProduct;
