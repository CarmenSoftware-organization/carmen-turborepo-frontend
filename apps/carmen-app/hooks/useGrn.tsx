"use client";

import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { useURL } from "./useURL";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllGrn } from "@/services/grn.service";
import { CreateGRNDto, GoodsReceivedNoteListDto } from "@/dtos/grn.dto";
import { postApiRequest, updateApiRequest } from "@/lib/config.api";
import { backendApi } from "@/lib/backend-api";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

export const useGrn = () => {
  const { token, buCode } = useAuth();
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
    queryKey: ["grns", buCode, search, page, sort],
    queryFn: () =>
      getAllGrn(token || "", buCode || "", { search, page: page ? Number(page) : 1, sort }),
    enabled: !!token && !!buCode,
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
    const found = grns?.data?.find((grn: GoodsReceivedNoteListDto) => grn.id === id);
    return found?.grn_no ?? null;
  };

  const handleSort = useCallback((field: string) => {
    if (sort) {

      const [currentField, currentDirection] = sort.split(':');

      if (currentField === field) {
        const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        setSort(`${field}:${newDirection}`);
      } else {
        setSort(`${field}:asc`);
      }
      setPage("1");
    } else {
      setSort(`${field}:asc`);
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

const grnApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/good-received-note`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useGrnMutation = (token: string, buCode: string) => {
  const API_URL = grnApiUrl(buCode);
  return useMutation({
    mutationFn: async (data: CreateGRNDto) => {
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing authentication credentials");
      }
      return await postApiRequest(
        API_URL,
        token,
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
  buCode: string,
  id: string
) => {
  const API_ID = grnApiUrl(buCode, id);
  return useMutation({
    mutationFn: async (data: CreateGRNDto) => {
      if (!token || !buCode || !id) {
        throw new Error("Unauthorized: Missing required parameters");
      }
      return updateApiRequest(
        API_ID,
        token,
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
