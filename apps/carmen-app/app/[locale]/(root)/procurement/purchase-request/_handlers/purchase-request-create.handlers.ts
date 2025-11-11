import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UseMutateFunction } from "@tanstack/react-query";

type ToastConfig = {
  message: string;
};

type MutationFunction = UseMutateFunction<unknown, Error, any, unknown>;

/** Handle successful PR creation and redirect to detail page */
export const handleCreateSuccess = (
  responseData: unknown,
  router: AppRouterInstance,
  tPR: (key: string) => string,
  toastSuccess: (config: ToastConfig) => void
): void => {
  const response = responseData as { data?: { id?: string } };
  const purchaseRequestId = response?.data?.id;

  if (!purchaseRequestId) {
    console.warn("[CreatePR] Success response missing ID");
    return;
  }

  router.replace(`/procurement/purchase-request/${purchaseRequestId}`);
  toastSuccess({ message: tPR("purchase_request_created") });
};

/** Handle PR creation error */
export const handleCreateError = (
  error: Error,
  tPR: (key: string) => string,
  toastError: (config: ToastConfig) => void
): void => {
  console.error("[CreatePR] Creation failed:", error);
  toastError({ message: tPR("purchase_request_created_failed") });
};

/** Create PR with success/error callbacks */
export const createPurchaseRequest = (
  data: any,
  createPr: MutationFunction,
  router: AppRouterInstance,
  tPR: (key: string) => string,
  toastSuccess: (config: ToastConfig) => void,
  toastError: (config: ToastConfig) => void
): void => {
  createPr(data, {
    onSuccess: (responseData: unknown) => handleCreateSuccess(responseData, router, tPR, toastSuccess),
    onError: (error: Error) => handleCreateError(error, tPR, toastError),
  });
};
