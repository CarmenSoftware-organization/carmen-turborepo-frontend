"use client";

import { formType } from "@/dtos/form.dto";
import {
  PurchaseRequestByIdDto,
  PurchaseRequestDetail,
  STAGE_ROLE,
} from "@/dtos/purchase-request.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePurchaseItemManagement } from "../../_hooks/use-purchase-item-management";
import { useAuth } from "@/context/AuthContext";
import { useBuConfig } from "@/context/BuConfigContext";
import { Form } from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import PurchaseItemDataGrid from "./PurchaseItemDataGrid";
import ReviewStageDialog from "./dialogs/ReviewStageDialog";
import CancelConfirmDialog from "./dialogs/CancelConfirmDialog";
import { Card } from "@/components/ui/card";
import ActionFields from "./ActionFields";
import HeadForm from "./HeadForm";
import DetailsAndComments from "@/components/DetailsAndComments";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import CommentComponent from "@/components/comment-activity/CommentComponent";
import WorkflowHistory from "./WorkflowHistory";
import ActionButtons from "./ActionButtons";
import { useTranslations } from "next-intl";
import { useMainFormLogic } from "../../_hooks/use-main-form-logic";
import { PurchaseRequestProvider } from "./PurchaseRequestContext";
import { CreatePrDtoType, CreatePrSchema } from "../../_schemas/purchase-request-form.schema";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { useMemo } from "react";
import {
  usePrCommentAttachmentsQuery,
  usePrCommentAttachmentsMutate,
  useUpdatePrCommentAttachment,
  useUpdatePrCommentAttachmentFiles,
  useDeletePrCommentAttachment,
} from "@/hooks/use-comment-attachments";
import { AttachmentDto } from "@/dtos/comment-attachments.dto";

const sanitizeItemsForForm = (items: PurchaseRequestDetail[]) => {
  return items.map((item) => {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(item)) {
      sanitized[key] = value === null ? undefined : value;
    }
    return sanitized;
  });
};

interface Props {
  mode: formType;
  initValues?: PurchaseRequestByIdDto;
  bu_code: string;
}

export default function MainForm({ mode, initValues, bu_code }: Props) {
  const { user, departments } = useAuth();
  const { defaultCurrencyId } = useBuConfig();
  const tPR = useTranslations("PurchaseRequest");
  const tComment = useTranslations("CommentAttachments");
  // For new PR from template, init items go to "add" array
  const isNewWithTemplate = mode === formType.ADD && initValues?.purchase_request_detail;

  // Sanitize items to convert null to undefined for form schema compatibility
  const sanitizedItems = useMemo(() => {
    if (isNewWithTemplate && initValues?.purchase_request_detail) {
      return sanitizeItemsForForm(initValues.purchase_request_detail);
    }
    return [];
  }, [isNewWithTemplate, initValues?.purchase_request_detail]);

  const form = useForm<CreatePrDtoType>({
    resolver: zodResolver(CreatePrSchema),
    defaultValues: {
      state_role: STAGE_ROLE.CREATE,
      details: {
        pr_date: initValues?.pr_date ? initValues.pr_date : new Date().toISOString(),
        requestor_id: user?.data.id || "",
        department_id: initValues?.department_id || departments?.id || "",
        workflow_id: initValues?.workflow_id || "",
        description: initValues?.description || "",
        note: initValues?.note || "",
        purchase_request_detail: {
          add: sanitizedItems,
          update: [],
          remove: [],
        },
      },
    },
    mode: "onBlur",
  });

  const purchaseItemManager = usePurchaseItemManagement({
    form,
    // For new PR from template, items are already in form "add" array, so don't pass as initValues
    initValues: isNewWithTemplate ? undefined : initValues?.purchase_request_detail,
    defaultCurrencyId,
  });

  const logic = useMainFormLogic({
    mode,
    initValues,
    form,
    purchaseItemManager,
  });

  const {
    token,

    // State
    currentMode,
    deleteDialogOpen,
    setDeleteDialogOpen,
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
    isPending,
    prStatus,
    workflowId,
    prevWorkflowData,
    isPrevWorkflowLoading,

    // Handlers
    getCurrentStatus,
    handleSubmit,
    handleConfirmDelete,
    handleConfirmCancel,
    onSubmitPr,
    onApprove,
    onReject,
    onSendBack,
    onPurchaseApprove,
    onReview,
    handleReviewConfirm,
  } = logic;

  const { comments, isLoading, refetch } = usePrCommentAttachmentsQuery(
    token,
    bu_code,
    initValues?.id || ""
  );

  const createCommentMutation = usePrCommentAttachmentsMutate(token, bu_code);
  const updateCommentMutation = useUpdatePrCommentAttachment(token, bu_code);
  const updateAttachmentsMutation = useUpdatePrCommentAttachmentFiles(token, bu_code);
  const deleteCommentMutation = useDeletePrCommentAttachment(token, bu_code);

  const handleAddComment = (message: string, attachments: AttachmentDto[]) => {
    if (!initValues?.id || !user?.data.id) return;

    createCommentMutation.mutate(
      {
        purchase_request_id: initValues.id,
        type: "user",
        user_id: user.data.id,
        message,
        attachments: attachments.length > 0 ? attachments : undefined,
        created_at: new Date().toISOString(),
        created_by_id: user.data.id,
      },
      {
        onSuccess: () => {
          toastSuccess({ message: tComment("add_success") });
          refetch();
        },
        onError: () => {
          toastError({ message: tComment("add_error") });
        },
      }
    );
  };

  const handleEditComment = (commentId: string, message: string, attachments?: AttachmentDto[]) => {
    if (!user?.data.id) return;

    // Update message and attachments together
    updateCommentMutation.mutate(
      {
        id: commentId,
        data: { message, attachments },
      },
      {
        onSuccess: () => {
          toastSuccess({ message: tComment("update_success") });
          refetch();
        },
        onError: () => {
          toastError({ message: tComment("update_error") });
        },
      }
    );
  };

  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId, {
      onSuccess: () => {
        toastSuccess({ message: tComment("del_sucess") });
        refetch();
      },
      onError: () => {
        toastError({ message: tComment("del_error") });
      },
    });
  };

  const handleFileUpload = async (file: File): Promise<AttachmentDto | null> => {
    const tempAttachment: AttachmentDto = {
      size: file.size,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      fileToken: `temp-${Date.now()}`,
      contentType: file.type as AttachmentDto["contentType"],
    };
    return tempAttachment;
  };

  const isViewOnly = initValues?.role === STAGE_ROLE.VIEW_ONLY;

  return (
    <>
      <DetailsAndComments
        // activityComponent={
        //   <ActivityLogComponent initialActivities={initValues?.workflow_history} />
        // }
        commentComponent={
          <CommentComponent
            comments={comments}
            currentUserId={user?.data.id}
            isLoading={isLoading}
            isSending={createCommentMutation.isPending}
            isUpdating={updateCommentMutation.isPending}
            isUpdatingAttachments={updateAttachmentsMutation.isPending}
            onCommentAdd={handleAddComment}
            onCommentEdit={handleEditComment}
            onCommentDelete={handleDeleteComment}
            onFileUpload={handleFileUpload}
          />
        }
      >
        <PurchaseRequestProvider value={logic}>
          <div className="space-y-4">
            <Card className="p-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit, () => {
                    toastError({
                      message: tPR("pls_complete_required_fields"),
                    });
                  })}
                >
                  <ActionFields isViewOnly={isViewOnly} />
                  <HeadForm bu_code={bu_code} requestorName={initValues?.requestor_name} />
                  <Tabs defaultValue="items">
                    <TabsList className={"mt-4"}>
                      <TabsTrigger className={"w-full h-6"} value="items">
                        {tPR("items")}
                      </TabsTrigger>
                      <TabsTrigger className="w-full h-6" value="workflow">
                        {tPR("workflow")}
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="items" className="mt-2">
                      <PurchaseItemDataGrid
                        currentMode={currentMode}
                        items={purchaseItemManager.items}
                        initValues={initValues?.purchase_request_detail}
                        addFields={purchaseItemManager.addFields}
                        onItemUpdate={purchaseItemManager.updateItem}
                        onItemRemove={purchaseItemManager.removeItem}
                        onAddItem={purchaseItemManager.addItem}
                        getItemValue={purchaseItemManager.getItemValue}
                        getCurrentStatus={getCurrentStatus}
                        workflow_id={workflowId}
                        prStatus={prStatus ?? ""}
                        bu_code={bu_code}
                        prId={initValues?.id ?? ""}
                        role={initValues?.role}
                      />
                    </TabsContent>
                    <TabsContent value="workflow" className="mt-2">
                      <WorkflowHistory workflow_history={initValues?.workflow_history} />
                    </TabsContent>
                  </Tabs>
                </form>
              </Form>
            </Card>
            <ActionButtons
              prStatus={prStatus || ""}
              isNewPr={currentMode === formType.ADD}
              isDraft={initValues?.pr_status === "draft"}
              isPending={isPending}
              isDisabled={isDisabled}
              isSubmitDisabled={!workflowId}
              isApproveDisabled={isApproveDisabled}
              itemsStatusSummary={itemsStatusSummary}
              onReject={onReject}
              onSendBack={onSendBack}
              onReview={onReview}
              onApprove={onApprove}
              onPurchaseApprove={onPurchaseApprove}
              onSubmitPr={onSubmitPr}
              onSave={form.handleSubmit(handleSubmit, (errors) => {
                toastError({
                  message: tPR("pls_complete_required_fields"),
                });
              })}
            />
          </div>
        </PurchaseRequestProvider>
      </DetailsAndComments>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={tPR("confirm_delete")}
        description={tPR("confirm_delete_message")}
      />

      <CancelConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleConfirmCancel}
      />

      <ReviewStageDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        selectedStage={selectedStage}
        onStageChange={setSelectedStage}
        stages={prevWorkflowData}
        isLoading={isPrevWorkflowLoading}
        onConfirm={handleReviewConfirm}
      />
    </>
  );
}
