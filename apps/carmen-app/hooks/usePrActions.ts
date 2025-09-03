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
    save: (data: PurchaseRequestUpdateFormDto, options?: MutationOptions) => void;
    submit: (data: PurchaseRequestUpdateFormDto, options?: MutationOptions) => void;
    approve: (data: PurchaseRequestUpdateFormDto, options?: MutationOptions) => void;
    purchase: (data: PurchaseRequestUpdateFormDto, options?: MutationOptions) => void;
    review: (data: PurchaseRequestUpdateFormDto, options?: MutationOptions) => void;
    reject: (data: PurchaseRequestUpdateFormDto, options?: MutationOptions) => void;
    sendBack: (data: PurchaseRequestUpdateFormDto, options?: MutationOptions) => void;

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
    tenantId: string,
    prId: string
): PrActionsReturn => {

    // Initialize all mutations
    const saveMutation = useUpdateUPr(token, tenantId, prId, 'save' as ActionPr);
    const submitMutation = useUpdateUPr(token, tenantId, prId, 'submit' as ActionPr);
    const approveMutation = useUpdateUPr(token, tenantId, prId, 'approve' as ActionPr);
    const purchaseMutation = useUpdateUPr(token, tenantId, prId, 'purchase' as ActionPr);
    const reviewMutation = useUpdateUPr(token, tenantId, prId, 'review' as ActionPr);
    const rejectMutation = useUpdateUPr(token, tenantId, prId, 'reject' as ActionPr);
    const sendBackMutation = useUpdateUPr(token, tenantId, prId, 'send_back' as ActionPr);

    // Action functions
    const actions = {
        save: (data: PurchaseRequestUpdateFormDto) => saveMutation.mutate(data),
        submit: (data: PurchaseRequestUpdateFormDto) => submitMutation.mutate(data),
        approve: (data: PurchaseRequestUpdateFormDto) => approveMutation.mutate(data),
        purchase: (data: PurchaseRequestUpdateFormDto) => purchaseMutation.mutate(data),
        review: (data: PurchaseRequestUpdateFormDto) => reviewMutation.mutate(data),
        reject: (data: PurchaseRequestUpdateFormDto) => rejectMutation.mutate(data),
        sendBack: (data: PurchaseRequestUpdateFormDto) => sendBackMutation.mutate(data),
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