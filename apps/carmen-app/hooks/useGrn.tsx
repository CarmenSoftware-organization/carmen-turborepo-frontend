"use client";

import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { useURL } from "./useURL";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllGrn } from "@/services/grn.service";
import { CreateGRNDto } from "@/dtos/grn.dto";
import { GrnDto } from "@/app/[locale]/(root)/procurement/goods-received-note/type.dto";
import { postApiRequest, updateApiRequest } from "@/lib/config.api";
import { backendApi } from "@/lib/backend-api";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

const API_URL = `${backendApi}/api/good-received-note`;

export const useGrn = () => {
  const { token, tenantId } = useAuth();
  const [search, setSearch] = useURL("search");
  const [page, setPage] = useURL("page");
  const [sort, setSort] = useURL("sort");
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (search) {
      setPage("");
      setSort("");
    }
  }, [search, setPage, setSort]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["grns", tenantId, search, page, sort],
    queryFn: () =>
      getAllGrn(token || "", tenantId || "", { search, page: page ? parseInt(page) : 1, sort }),
    enabled: !!token && !!tenantId,
  });


  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage.toString());
    },
    [setPage]
  );

  useEffect(() => {
    if (response?.status === 401) {
      setIsUnauthorized(true);
      setLoginDialogOpen(true);
    }
  }, [response]);

  // Extract the actual GRN data if response is not an error
  const grns = response?.isAuthError ? [] : (response?.data ?? []);

  const getGrnNo = (id: string) => {
    const found = grns?.data?.find((grn: GrnDto) => grn.id === id);
    return found?.grn_no ?? null;
  };

  const handleSort = useCallback((field: string) => {
    if (!sort) {
      setSort(`${field}:asc`);
    } else {
      const [currentField, currentDirection] = sort.split(':');

      if (currentField === field) {
        const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        setSort(`${field}:${newDirection}`);
      } else {
        setSort(`${field}:asc`);
      }
      setPage("1");
    }
  }, [setSort, sort]);

  return {
    grns,
    getGrnNo,
    isLoading,
    isError,
    error,
    refetch,
    search,
    setSearch,
    page,
    setPage,
    sort,
    setSort,
    isUnauthorized,
    loginDialogOpen,
    setLoginDialogOpen,
    dialogOpen,
    setDialogOpen,
    handlePageChange,
    handleSort
  };
};

export const useGrnMutation = (token: string, tenantId: string) => {
  return useMutation({
    mutationFn: async (data: CreateGRNDto) => {
      if (!token || !tenantId) {
        throw new Error("Unauthorized: Missing authentication credentials");
      }
      return await postApiRequest(
        API_URL,
        token,
        tenantId,
        data,
        "Error creating credit note"
      );
    },
    onSuccess: () => {
      toastSuccess({ message: "GRN created successfully" });
    },
    onError: (error: Error) => {
      if (error.message.includes("Unauthorized")) {
        toastError({ message: "Please login to continue" });
      } else {
        toastError({ message: "Error creating GRN" });
      }
    },
  });
};

export const useUpdateCreditNote = (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_ID = `${API_URL}/${id}`;
  return useMutation({
    mutationFn: async (data: CreateGRNDto) => {
      if (!token || !tenantId || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      return updateApiRequest(
        API_ID,
        token,
        tenantId,
        data,
        "Failed to update credit note",
        "PATCH"
      );
    },
    onSuccess: () => {
      toastSuccess({ message: "GRN updated successfully" });
    },
    onError: (error: Error) => {
      if (error.message.includes("Unauthorized")) {
        toastError({ message: "Please login to continue" });
      } else {
        toastError({ message: "Error updating GRN" });
      }
    },
  });
};
