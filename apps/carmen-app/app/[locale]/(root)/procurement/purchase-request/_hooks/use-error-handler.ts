import { useCallback } from "react";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { PR_ERROR_MESSAGES } from "../_constants/error-messages";
import { useTranslations } from "next-intl";

interface ErrorHandlerOptions {
  onError?: (error: Error) => void;
  customMessage?: string;
}

export const useErrorHandler = () => {
  const t = useTranslations("PurchaseRequest");

  const handleError = useCallback(
    (error: Error, options?: ErrorHandlerOptions) => {
      // Log error for debugging
      console.error("Error occurred:", error);

      // Determine the message key or custom message
      const messageKey =
        options?.customMessage || error.message || PR_ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR;

      // Translate the message if it's a known error key, otherwise use it as is
      // We check if the message starts with "errors." to assume it's a key
      const message = messageKey.startsWith("errors.") ? t(messageKey) : messageKey;

      // Display error toast
      toastError({ message });

      // Call custom error handler if provided
      options?.onError?.(error);
    },
    [t]
  );

  const handleSuccess = useCallback(
    (messageKey: string) => {
      // Translate success message if it's a key
      const message = messageKey.startsWith("errors.") ? t(messageKey) : messageKey;
      toastSuccess({ message });
    },
    [t]
  );

  const handleApiError = useCallback(
    (error: unknown, defaultMessageKey: string) => {
      if (error instanceof Error) {
        // If the error message is a known key, use it. Otherwise use default.
        // Or if the error message is a raw string from backend, we might want to show it?
        // For now, let's assume error.message might be a key or a raw string.
        const message = error.message || defaultMessageKey;
        handleError(error, { customMessage: message });
      } else {
        handleError(new Error(defaultMessageKey));
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
