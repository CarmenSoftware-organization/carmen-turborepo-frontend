// hooks/usePrActions.ts

import { PurchaseRequestUpdateFormDto } from "@/dtos/purchase-request.dto";
import { useUpdateUPr } from "./usePurchaseRequest";

type ActionPr = 'save' | 'submit' | 'approve' | 'purchase' | 'review' | 'reject' | 'send_back';

interface MutationOptions {
    onSuccess?: () => void;
    onError?: (error: any) => void;
    onSettled?: () => void;
}

interface PrActionsReturn {
    // Action functions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    save: (data: any, options?: MutationOptions) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    submit: (data: any, options?: MutationOptions) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    approve: (data: any, options?: MutationOptions) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    purchase: (data: any, options?: MutationOptions) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    review: (data: any, options?: MutationOptions) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: (data: any, options?: MutationOptions) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendBack: (data: any, options?: MutationOptions) => void;

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

const usePrActions = (
    token: string,
    buCode: string,
    prId: string
): PrActionsReturn => {

    // Initialize all mutations
    const saveMutation = useUpdateUPr(token, buCode, prId, 'save' as ActionPr);
    const submitMutation = useUpdateUPr(token, buCode, prId, 'submit' as ActionPr);
    const approveMutation = useUpdateUPr(token, buCode, prId, 'approve' as ActionPr);
    const purchaseMutation = useUpdateUPr(token, buCode, prId, 'purchase' as ActionPr);
    const reviewMutation = useUpdateUPr(token, buCode, prId, 'review' as ActionPr);
    const rejectMutation = useUpdateUPr(token, buCode, prId, 'reject' as ActionPr);
    const sendBackMutation = useUpdateUPr(token, buCode, prId, 'send_back' as ActionPr);

    // Action functions
    const actions = {
        save: (data: PurchaseRequestUpdateFormDto, options?: MutationOptions) =>
            saveMutation.mutate(data, {
                onSuccess: options?.onSuccess,
                onError: options?.onError,
                onSettled: options?.onSettled,
            }),
        submit: (data: PurchaseRequestUpdateFormDto, options?: MutationOptions) =>
            submitMutation.mutate(data, {
                onSuccess: options?.onSuccess,
                onError: options?.onError,
                onSettled: options?.onSettled,
            }),
        approve: (data: PurchaseRequestUpdateFormDto, options?: MutationOptions) =>
            approveMutation.mutate(data, {
                onSuccess: options?.onSuccess,
                onError: options?.onError,
                onSettled: options?.onSettled,
            }),
        purchase: (data: PurchaseRequestUpdateFormDto, options?: MutationOptions) =>
            purchaseMutation.mutate(data, {
                onSuccess: options?.onSuccess,
                onError: options?.onError,
                onSettled: options?.onSettled,
            }),
        review: (data: PurchaseRequestUpdateFormDto, options?: MutationOptions) =>
            reviewMutation.mutate(data, {
                onSuccess: options?.onSuccess,
                onError: options?.onError,
                onSettled: options?.onSettled,
            }),
        reject: (data: PurchaseRequestUpdateFormDto, options?: MutationOptions) =>
            rejectMutation.mutate(data, {
                onSuccess: options?.onSuccess,
                onError: options?.onError,
                onSettled: options?.onSettled,
            }),
        sendBack: (data: PurchaseRequestUpdateFormDto, options?: MutationOptions) =>
            sendBackMutation.mutate(data, {
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
    const isPending = Object.values(loadingStates).some(state => state);

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
    const isError = Object.values(errors).some(error => error !== null);

    return {
        ...actions,
        isPending,
        loadingStates,
        isError,
        errors,
    };
};

export { usePrActions };