// hooks/use-pr-actions.ts

import { PurchaseRequestUpdateFormDto, CreatePrDto } from "@/dtos/purchase-request.dto";
import { useUpdateUPr } from "@/hooks/use-purchase-request";

type ActionPr = "save" | "submit" | "approve" | "purchase" | "review" | "reject" | "send_back";

interface MutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

interface PrActionsReturn {
  // Action functions - accept flexible data shapes with additional fields
  save: (data: PurchaseRequestUpdateFormDto | CreatePrDto, options?: MutationOptions) => void;
  submit: (data: Partial<PurchaseRequestUpdateFormDto> & Record<string, unknown>, options?: MutationOptions) => void;
  approve: (data: Partial<PurchaseRequestUpdateFormDto> & Record<string, unknown>, options?: MutationOptions) => void;
  purchase: (data: Partial<PurchaseRequestUpdateFormDto> & Record<string, unknown>, options?: MutationOptions) => void;
  review: (data: Partial<PurchaseRequestUpdateFormDto> & Record<string, unknown>, options?: MutationOptions) => void;
  reject: (data: Partial<PurchaseRequestUpdateFormDto> & Record<string, unknown>, options?: MutationOptions) => void;
  sendBack: (data: Partial<PurchaseRequestUpdateFormDto> & Record<string, unknown>, options?: MutationOptions) => void;

  // Loading states
  isPending: boolean;
  loadingStates: {
    isSaving: boolean;
    isSubmitting: boolean;
    isApproving: boolean;
    isPurchasing: boolean;
    isReviewing: boolean;
    isRejecting: boolean;
    isSendingBack: boolean;
  };

  // Error states
  isError: boolean;
  errors: {
    saveError: Error | null;
    submitError: Error | null;
    approveError: Error | null;
    purchaseError: Error | null;
    reviewError: Error | null;
    rejectError: Error | null;
    sendBackError: Error | null;
  };
}

const usePrActions = (token: string, buCode: string, prId: string): PrActionsReturn => {
  const saveMutation = useUpdateUPr(token, buCode, prId, "save" as ActionPr);
  const submitMutation = useUpdateUPr(token, buCode, prId, "submit" as ActionPr);
  const approveMutation = useUpdateUPr(token, buCode, prId, "approve" as ActionPr);
  const purchaseMutation = useUpdateUPr(token, buCode, prId, "purchase" as ActionPr);
  const reviewMutation = useUpdateUPr(token, buCode, prId, "review" as ActionPr);
  const rejectMutation = useUpdateUPr(token, buCode, prId, "reject" as ActionPr);
  const sendBackMutation = useUpdateUPr(token, buCode, prId, "send_back" as ActionPr);

  // Action functions
  const actions = {
    save: (data: PurchaseRequestUpdateFormDto | CreatePrDto, options?: MutationOptions) =>
      saveMutation.mutate(data as PurchaseRequestUpdateFormDto, {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
        onSettled: options?.onSettled,
      }),
    submit: (data: Partial<PurchaseRequestUpdateFormDto> & Record<string, unknown>, options?: MutationOptions) =>
      submitMutation.mutate(data as PurchaseRequestUpdateFormDto, {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
        onSettled: options?.onSettled,
      }),
    approve: (data: Partial<PurchaseRequestUpdateFormDto> & Record<string, unknown>, options?: MutationOptions) =>
      approveMutation.mutate(data as PurchaseRequestUpdateFormDto, {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
        onSettled: options?.onSettled,
      }),
    purchase: (data: Partial<PurchaseRequestUpdateFormDto> & Record<string, unknown>, options?: MutationOptions) =>
      purchaseMutation.mutate(data as PurchaseRequestUpdateFormDto, {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
        onSettled: options?.onSettled,
      }),
    review: (data: Partial<PurchaseRequestUpdateFormDto> & Record<string, unknown>, options?: MutationOptions) =>
      reviewMutation.mutate(data as PurchaseRequestUpdateFormDto, {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
        onSettled: options?.onSettled,
      }),
    reject: (data: Partial<PurchaseRequestUpdateFormDto> & Record<string, unknown>, options?: MutationOptions) =>
      rejectMutation.mutate(data as PurchaseRequestUpdateFormDto, {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
        onSettled: options?.onSettled,
      }),
    sendBack: (data: Partial<PurchaseRequestUpdateFormDto> & Record<string, unknown>, options?: MutationOptions) =>
      sendBackMutation.mutate(data as PurchaseRequestUpdateFormDto, {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
        onSettled: options?.onSettled,
      }),
  };

  // Aggregate loading states
  const loadingStates = {
    isSaving: saveMutation.isPending,
    isSubmitting: submitMutation.isPending,
    isApproving: approveMutation.isPending,
    isPurchasing: purchaseMutation.isPending,
    isReviewing: reviewMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isSendingBack: sendBackMutation.isPending,
  };

  // Overall loading state
  const isPending = Object.values(loadingStates).some(Boolean);

  // Aggregate error states
  const errors = {
    saveError: saveMutation.error,
    submitError: submitMutation.error,
    approveError: approveMutation.error,
    purchaseError: purchaseMutation.error,
    reviewError: reviewMutation.error,
    rejectError: rejectMutation.error,
    sendBackError: sendBackMutation.error,
  };

  // Overall error state
  const isError = Object.values(errors).some((error) => error !== null);

  return {
    ...actions,
    isPending,
    loadingStates,
    isError,
    errors,
  };
};

export { usePrActions };
