import { useCallback } from "react";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { PR_ERROR_MESSAGES } from "../_constants/error-messages";

interface ErrorHandlerOptions {
  onError?: (error: Error) => void;
  customMessage?: string;
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: Error, options?: ErrorHandlerOptions) => {
    // Log error for debugging
    console.error("Error occurred:", error);

    // Display error toast
    const message =
      options?.customMessage || error.message || PR_ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR;
    toastError({ message });

    // Call custom error handler if provided
    options?.onError?.(error);
  }, []);

  const handleSuccess = useCallback((message: string) => {
    toastSuccess({ message });
  }, []);

  const handleApiError = useCallback(
    (error: unknown, defaultMessage: string) => {
      if (error instanceof Error) {
        handleError(error, { customMessage: error.message || defaultMessage });
      } else {
        handleError(new Error(defaultMessage));
      }
    },
    [handleError]
  );

  return {
    handleError,
    handleSuccess,
    handleApiError,
  };
};
