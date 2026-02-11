"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";

interface UseDeleteDialogOptions {
  queryKey: unknown[];
  successMessage: string;
  errorMessage: string;
  logContext?: string;
  onSuccess?: () => void;
}

export function useDeleteDialog<T extends { id?: string }>(
  deleteMutationFn: (
    id: string,
    options: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }
  ) => void,
  options: UseDeleteDialogOptions
) {
  const {
    queryKey,
    successMessage,
    errorMessage,
    logContext = "delete",
    onSuccess: onSuccessCallback,
  } = options;

  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<T | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDialog = useCallback((entity: T) => {
    setEntityToDelete(entity);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setEntityToDelete(undefined);
    setIsDeleting(false);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!entityToDelete?.id) return;

    setIsDeleting(true);

    deleteMutationFn(entityToDelete.id, {
      onSuccess: () => {
        toastSuccess({ message: successMessage });
        queryClient.invalidateQueries({ queryKey });
        closeDialog();
        onSuccessCallback?.();
      },
      onError: (error: Error) => {
        toastError({ message: errorMessage });
        console.error(`Failed to ${logContext}:`, error);
        setIsDeleting(false);
      },
    });
  }, [
    entityToDelete,
    deleteMutationFn,
    successMessage,
    errorMessage,
    queryKey,
    logContext,
    queryClient,
    closeDialog,
    onSuccessCallback,
  ]);

  const dialogProps = {
    open: isOpen,
    onOpenChange: () => closeDialog(),
    onConfirm: confirmDelete,
    isLoading: isDeleting,
  };

  return {
    isOpen,
    entityToDelete,
    isDeleting,
    openDialog,
    closeDialog,
    confirmDelete,
    dialogProps,
  };
}
