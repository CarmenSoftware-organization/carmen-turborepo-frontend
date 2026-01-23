"use client";

import { formType } from "@/dtos/form.dto";
import { PurchaseRequestByIdDto, STAGE_ROLE } from "@/dtos/purchase-request.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePurchaseItemManagement } from "../../_hooks/use-purchase-item-management";
import { useAuth } from "@/context/AuthContext";
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
import { toastError } from "@/components/ui-custom/Toast";
import { mockActivityPr, mockCommentsPr } from "./mock-budget";
import ActivityLogComponent from "@/components/comment-activity/ActivityLogComponent";
import CommentComponent from "@/components/comment-activity/CommentComponent";
import WorkflowHistory from "./WorkflowHistory";
import ActionButtons from "./ActionButtons";
import { useTranslations } from "next-intl";
import { useMainFormLogic } from "../../_hooks/use-main-form-logic";
import { PurchaseRequestProvider } from "./PurchaseRequestContext";
import { CreatePrDtoType, CreatePrSchema } from "../../_schemas/purchase-request-form.schema";
import { PR_STATUS } from "../../_constants/pr-status";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";

interface Props {
  mode: formType;
  initValues?: PurchaseRequestByIdDto;
  bu_code: string;
}

interface CancelAction {
  type: "back" | "cancel";
  event: React.MouseEvent<HTMLButtonElement> | null;
}

export default function MainForm({ mode, initValues, bu_code }: Props) {
  const { user, departments } = useAuth();

  const tPR = useTranslations("PurchaseRequest");

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
          add: [],
          update: [],
          remove: [],
        },
      },
    },
    mode: "onBlur",
  });

  const purchaseItemManager = usePurchaseItemManagement({
    form,
    initValues: initValues?.purchase_request_detail,
  });

  const logic = useMainFormLogic({
    mode,
    initValues,
    form,
    purchaseItemManager,
  });

  const {
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
  } = logic;

  const isShowActionButtons = prStatus !== PR_STATUS.VOIDED && prStatus !== PR_STATUS.APPROVED;

  return (
    <>
      <DetailsAndComments
        activityComponent={<ActivityLogComponent initialActivities={mockActivityPr} />}
        commentComponent={<CommentComponent initialComments={mockCommentsPr} />}
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
                  <ActionFields />
                  <HeadForm bu_code={bu_code} />
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
                      />
                    </TabsContent>
                    <TabsContent value="workflow" className="mt-2">
                      <WorkflowHistory workflow_history={initValues?.workflow_history} />
                    </TabsContent>
                  </Tabs>
                </form>
              </Form>
            </Card>

            {isShowActionButtons && (
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
            )}
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
