import { useState, useMemo, useCallback } from "react";
import { useRouter } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import { PR_ERROR_MESSAGES } from "../_constants/error-messages";

import { useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestByIdDto, STAGE_ROLE, ItemStatus } from "@/dtos/purchase-request.dto";
import { CreatePrDtoType, StagesStatusValue } from "../_schemas/purchase-request-form.schema";
import { useCreatePr } from "@/hooks/use-purchase-request";
import { usePrActions } from "./use-pr-actions";
import { usePrevWorkflow } from "./use-prev-workflow";
import { useSendNotification } from "@/hooks/useNoti";
import { EnumNotiType } from "@/dtos/notification.dto";
import {
  prepareSubmitData,
  preparePurchaseApproveData,
  validateItemForApproval,
} from "../_utils/purchase-request.utils";
import { prepareStageDetails } from "../_utils/stage.utils";
import { createPurchaseRequest } from "../_handlers/purchase-request-create.handlers";
import { updatePurchaseRequest } from "../_handlers/purchase-request-update.handlers";
import {
  submitPurchaseRequest,
  rejectPurchaseRequest,
  sendBackPurchaseRequest,
} from "../_handlers/purchase-request-actions.handlers";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { UsePurchaseItemManagementReturn } from "./use-purchase-item-management";

interface UseMainFormLogicProps {
  mode: formType;
  initValues?: PurchaseRequestByIdDto;
  form: UseFormReturn<CreatePrDtoType>;
  purchaseItemManager: UsePurchaseItemManagementReturn;
}

interface CancelAction {
  type: "back" | "cancel";
  event: React.MouseEvent<HTMLButtonElement> | null;
}

export const useMainFormLogic = ({
  mode,
  initValues,
  form,
  purchaseItemManager,
}: UseMainFormLogicProps) => {
  const router = useRouter();
  const { token, buCode, user, departments } = useAuth();
  const tPR = useTranslations("PurchaseRequest");
  const queryClient = useQueryClient();

  // State
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelAction, setCancelAction] = useState<CancelAction>({ type: "cancel", event: null });
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>("");

  // Queries & Mutations
  const { mutate: createPr, isPending: isCreatingPr } = useCreatePr(token, buCode);
  const { mutate: sendNotification } = useSendNotification(token);
  const { save, submit, approve, purchase, review, reject, sendBack, isPending } = usePrActions(
    token,
    buCode,
    initValues?.id || ""
  );

  // Derived Values
  const requestorName = user?.data.user_info.firstname + " " + user?.data.user_info.lastname;
  const workflowStages = Array.isArray(initValues?.workflow_history)
    ? initValues.workflow_history.map((item: { current_stage?: string }) => ({
        title: item.current_stage ?? "",
      }))
    : [];
  const currentStage = workflowStages[workflowStages.length - 1]?.title;
  const isDraft = initValues?.pr_status === "draft";
  const isNewPr = currentMode === formType.ADD;
  const prStatus = initValues?.pr_status;
  const workflowId = form.watch("details.workflow_id");
  const hasFormErrors = Object.keys(form.formState.errors).length > 0;
  const { isDirty } = form.formState;

  const isApproveDisabled = useMemo(() => {
    if (purchaseItemManager.currentItems.length === 0) return true;
    // return !purchaseItemManager.currentItems.every((item, index) =>
    //   validateItemForApproval(item, index)
    // );
  }, [purchaseItemManager.currentItems]);

  const isDisabled = useMemo(() => {
    return isCreatingPr || isPending || hasFormErrors || (mode === formType.ADD && !workflowId);
  }, [isCreatingPr, isPending, hasFormErrors, mode, workflowId]);

  const { data: prevWorkflowData, isLoading: isPrevWorkflowLoading } = usePrevWorkflow({
    token,
    buCode,
    workflow_id: initValues?.workflow_id || "",
    stage: currentStage,
    enabled: reviewDialogOpen,
  });

  const getCurrentStatus = useCallback((stagesStatusValue: StagesStatusValue): string => {
    if (!stagesStatusValue) return ItemStatus.PENDING;
    if (Array.isArray(stagesStatusValue) && stagesStatusValue.length > 0) {
      const lastStage = stagesStatusValue[stagesStatusValue.length - 1];
      return lastStage?.status || ItemStatus.PENDING;
    }
    if (typeof stagesStatusValue === "string") {
      return stagesStatusValue;
    }
    return ItemStatus.PENDING;
  }, []);

  const itemsStatusSummary = useMemo(() => {
    const summary = {
      approved: 0,
      review: 0,
      rejected: 0,
      pending: 0,
      newItems: 0,
      total: purchaseItemManager.items.length,
    };

    for (const item of purchaseItemManager.items) {
      const isNewItem = !initValues?.purchase_request_detail?.some(
        (initItem) => initItem.id === item.id
      );

      if (isNewItem) {
        summary.newItems++;
      } else {
        const stagesStatusValue: StagesStatusValue =
          purchaseItemManager.getItemValue(item, "stages_status") || item.stages_status;

        const currentStatus = getCurrentStatus(stagesStatusValue);

        if (currentStatus === ItemStatus.APPROVED || currentStatus === "approve") {
          summary.approved++;
        } else if (currentStatus === ItemStatus.REVIEW) {
          summary.review++;
        } else if (currentStatus === ItemStatus.REJECTED || currentStatus === "reject") {
          summary.rejected++;
        } else {
          summary.pending++;
        }
      }
    }

    return summary;
  }, [
    purchaseItemManager.items,
    initValues?.purchase_request_detail,
    purchaseItemManager,
    getCurrentStatus,
  ]);

  // Handlers
  const performCancel = () => {
    if (currentMode === formType.ADD) {
      router.push("/procurement/purchase-request");
    } else {
      setCurrentMode(formType.VIEW);
      form.reset();
    }
  };

  const handleSubmit = (data: CreatePrDtoType): void => {
    const processedData = prepareSubmitData(data);
    const isCreating = currentMode === formType.ADD;
    if (isCreating) {
      createPurchaseRequest(processedData, createPr, router, buCode, tPR, toastSuccess, toastError);
    } else {
      updatePurchaseRequest(
        processedData,
        save,
        queryClient,
        buCode,
        initValues?.id,
        setCurrentMode,
        tPR,
        toastSuccess,
        toastError
      );
    }
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      const index = Number(itemToDelete);
      if (index >= 0) {
        purchaseItemManager.removeField(index);
      }
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>, type: "back" | "cancel") => {
    e.preventDefault();
    e.stopPropagation();

    if (isDirty) {
      setCancelAction({ type, event: e });
      setCancelDialogOpen(true);
      return;
    }
    if (type === "back") {
      router.push("/procurement/purchase-request");
      return;
    }

    performCancel();
  };

  const handleConfirmCancel = () => {
    if (cancelAction.type === "back") {
      router.push("/procurement/purchase-request");
    } else {
      performCancel();
    }
    setCancelDialogOpen(false);
  };

  const onSubmitPr = () => {
    const details = prepareStageDetails(
      purchaseItemManager.items,
      purchaseItemManager.getItemValue,
      "submit",
      "user submitted"
    );
    submitPurchaseRequest(
      details,
      submit,
      queryClient,
      buCode,
      initValues?.id,
      tPR,
      toastSuccess,
      toastError
    );
  };

  const onApprove = () => {
    const approveData = preparePurchaseApproveData(
      purchaseItemManager.currentItems,
      initValues?.id || ""
    );
    approve(approveData, {
      onSuccess: () => {
        toastSuccess({
          message: tPR(PR_ERROR_MESSAGES.SUCCESS.APPROVED),
        });
        if (user?.data.id) {
          sendNotification({
            title: "Purchase Request Approved",
            message: `Purchase Request [${initValues?.pr_no || ""}](/procurement/purchase-request/${initValues?.id}) has been approved`,
            type: EnumNotiType.success,
            category: "user-to-user",
            to_user_id: user.data.id,
            from_user_id: user.data.id,
            link: `/procurement/purchase-request/${buCode}/${initValues?.id}`,
          });
        }
      },
      onError: () => {
        toastError({
          message: tPR(PR_ERROR_MESSAGES.API.APPROVE_FAILED),
        });
      },
    });
  };

  const onReject = () => {
    const details = prepareStageDetails(
      purchaseItemManager.items,
      purchaseItemManager.getItemValue,
      "reject",
      "rejected"
    );
    rejectPurchaseRequest(
      details,
      reject,
      queryClient,
      buCode,
      initValues?.id,
      tPR,
      toastSuccess,
      toastError
    );
  };

  const onSendBack = () => {
    const details = prepareStageDetails(
      purchaseItemManager.items,
      purchaseItemManager.getItemValue,
      "send_back",
      "sent back"
    );
    sendBackPurchaseRequest(
      details,
      sendBack,
      queryClient,
      buCode,
      initValues?.id,
      tPR,
      toastSuccess,
      toastError
    );
  };

  const onPurchaseApprove = () => {
    const purchaseData = preparePurchaseApproveData(
      purchaseItemManager.currentItems,
      initValues?.id || ""
    );

    purchase(purchaseData, {
      onSuccess: () => {
        toastSuccess({
          message: tPR(PR_ERROR_MESSAGES.SUCCESS.PURCHASED),
        });
      },
      onError: () => {
        toastError({
          message: tPR(PR_ERROR_MESSAGES.API.PURCHASE_FAILED),
        });
      },
    });
  };

  const onReview = () => {
    setReviewDialogOpen(true);
  };

  const handleReviewConfirm = () => {
    if (!selectedStage) {
      toastError({
        message: tPR("please_select_stage"),
      });
      return;
    }

    const reviewData = {
      state_role: STAGE_ROLE.CREATE,
      des_stage: selectedStage,
      details: prepareStageDetails(
        purchaseItemManager.items,
        purchaseItemManager.getItemValue,
        "review",
        `กลับไป ${selectedStage}`
      ),
    };

    review(reviewData, {
      onSuccess: () => {
        toastSuccess({
          message: tPR(PR_ERROR_MESSAGES.SUCCESS.REVIEWED),
        });
        setReviewDialogOpen(false);
        setSelectedStage("");
        queryClient.invalidateQueries({
          queryKey: ["purchase-request", buCode, initValues?.id],
        });
      },
      onError: () => {
        toastError({
          message: tPR(PR_ERROR_MESSAGES.API.REVIEW_FAILED),
        });
      },
    });
  };

  return {
    // State
    currentMode,
    setCurrentMode,
    deleteDialogOpen,
    setDeleteDialogOpen,
    itemToDelete,
    setItemToDelete,
    cancelDialogOpen,
    setCancelDialogOpen,
    reviewDialogOpen,
    setReviewDialogOpen,
    selectedStage,
    setSelectedStage,

    // Computed
    isDisabled,
    isApproveDisabled,
    itemsStatusSummary,
    isCreatingPr,
    isPending,
    prStatus,
    workflowStages,
    requestorName,
    workflowId,
    prevWorkflowData,
    isPrevWorkflowLoading,
    isDirty,
    departmentName: initValues?.department_name || departments?.name,
    initValues,
    purchaseItemManager,

    // Handlers
    getCurrentStatus,
    handleSubmit,
    handleConfirmDelete,
    handleCancel,
    handleConfirmCancel,
    onSubmitPr,
    onApprove,
    onReject,
    onSendBack,
    onPurchaseApprove,
    onReview,
    handleReviewConfirm,
  };
};
