import { QueryClient } from "@tanstack/react-query";
import { formType } from "@/dtos/form.dto";

type ToastConfig = {
  message: string;
};

type SaveFunction = (
  data: any,
  options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
) => void;

/** Handle successful PR update and switch to view mode */
export const handleUpdateSuccess = (
  queryClient: QueryClient,
  buCode: string,
  prId: string | undefined,
  setCurrentFormType: (type: formType) => void,
  tPR: (key: string) => string,
  toastSuccess: (config: ToastConfig) => void
): void => {
  toastSuccess({ message: tPR("purchase_request_updated") });

  queryClient.invalidateQueries({
    queryKey: ["purchase-request", buCode, prId],
  });

  setCurrentFormType(formType.VIEW);
};

/** Handle PR update error */
export const handleUpdateError = (
  error: Error,
  tPR: (key: string) => string,
  toastError: (config: ToastConfig) => void
): void => {
  console.error("[UpdatePR] Update failed:", error);
  toastError({ message: tPR("purchase_request_updated_failed") });
};

/** Update PR with success/error callbacks */
export const updatePurchaseRequest = (
  data: any,
  save: SaveFunction,
  queryClient: QueryClient,
  buCode: string,
  prId: string | undefined,
  setCurrentFormType: (type: formType) => void,
  tPR: (key: string) => string,
  toastSuccess: (config: ToastConfig) => void,
  toastError: (config: ToastConfig) => void
): void => {
  save(data, {
    onSuccess: () => handleUpdateSuccess(queryClient, buCode, prId, setCurrentFormType, tPR, toastSuccess),
    onError: (error: Error) => handleUpdateError(error, tPR, toastError),
  });
};
