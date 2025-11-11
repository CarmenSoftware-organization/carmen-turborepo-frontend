"use client";

import { formType } from "@/dtos/form.dto";
import {
  CreatePrSchema,
  PurchaseRequestByIdDto,
  STAGE_ROLE,
  StageStatus,
  CreatePurchaseRequestDetailDto,
  UpdatePurchaseRequestDetailDto,
} from "@/dtos/purchase-request.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePurchaseItemManagement } from "../../_hooks/use-purchase-item-management";
import { usePrevWorkflow } from "../../_hooks/use-prev-workflow";
import { useAuth } from "@/context/AuthContext";
import { Form } from "@/components/ui/form";

type CreatePrDto = z.infer<typeof CreatePrSchema>;

export type StagesStatusValue = string | StageStatus[] | undefined;

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import PurchaseItemDataGrid from "./PurchaseItemDataGrid";
import ReviewStageDialog from "./dialogs/ReviewStageDialog";
import CancelConfirmDialog from "./dialogs/CancelConfirmDialog";
import { Card } from "@/components/ui/card";
import ActionFields from "./ActionFields";
import HeadForm from "./HeadForm";
import { useRouter } from "@/lib/navigation";
import DetailsAndComments from "@/components/DetailsAndComments";
import { usePrMutation } from "@/hooks/use-purchase-request";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { mockActivityPr, mockCommentsPr } from "./mock-budget";
import ActivityLogComponent from "@/components/comment-activity/ActivityLogComponent";
import CommentComponent from "@/components/comment-activity/CommentComponent";
import WorkflowHistory from "./WorkflowHistory";
import ActionButtons from "./ActionButtons";
import { useQueryClient } from "@tanstack/react-query";
import { usePrActions } from "../../_hooks/use-pr-actions";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import JsonViewer from "@/components/JsonViewer";
import { prepareSubmitData } from "../../_utils/purchase-request.utils";
import { getLastStageMessage, createStageDetail } from "../../_utils/stage.utils";
import { createPurchaseRequest } from "../../_handlers/purchase-request-create.handlers";
import { updatePurchaseRequest } from "../../_handlers/purchase-request-update.handlers";
import {
  submitPurchaseRequest,
  rejectPurchaseRequest,
  sendBackPurchaseRequest,
} from "../../_handlers/purchase-request-actions.handlers";

interface Props {
  mode: formType;
  initValues?: PurchaseRequestByIdDto;
}

interface CancelAction {
  type: "back" | "cancel";
  event: React.MouseEvent<HTMLButtonElement> | null;
}

export default function MainForm({ mode, initValues }: Props) {
  const router = useRouter();
  const { token, buCode, user, departments, dateFormat } = useAuth();
  const tPR = useTranslations("PurchaseRequest");
  const [currentFormType, setCurrentFormType] = useState<formType>(mode);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelAction, setCancelAction] = useState<CancelAction>({ type: "cancel", event: null });
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>("");

  const form = useForm<CreatePrDto>({
    resolver: zodResolver(CreatePrSchema),
    defaultValues: {
      state_role: STAGE_ROLE.CREATE,
      details: {
        pr_date: initValues?.pr_date ? initValues.pr_date : new Date().toISOString(),
        requestor_id: user?.id || "",
        department_id: departments?.id || "",
        workflow_id: initValues?.workflow_id || "",
        description: initValues?.description || "",
        note: initValues?.note || "",
        purchase_request_detail: {
          add: [] as CreatePurchaseRequestDetailDto[],
          update: [] as UpdatePurchaseRequestDetailDto[],
          remove: [] as { id: string }[],
        },
      },
    },
    mode: "onBlur",
  });

  const { mutate: createPr, isPending: isCreatingPr } = usePrMutation(token, buCode);

  const { save, submit, approve, purchase, review, reject, sendBack, isPending } = usePrActions(
    token,
    buCode,
    initValues?.id || ""
  );

  // ใช้ custom hook สำหรับจัดการ purchase items
  const purchaseItemManager = usePurchaseItemManagement({
    form,
    initValues: initValues?.purchase_request_detail,
  });

  const requestorName = user?.user_info.firstname + " " + user?.user_info.lastname;

  const workflowStages = Array.isArray(initValues?.workflow_history)
    ? initValues.workflow_history.map((item: { current_stage?: string }) => ({
        title: item.current_stage ?? "",
      }))
    : [];

  const currentStage = workflowStages[workflowStages.length - 1]?.title;

  const { data: prevWorkflowData, isLoading: isPrevWorkflowLoading } = usePrevWorkflow({
    token,
    buCode,
    workflow_id: initValues?.workflow_id || "",
    stage: currentStage,
    enabled: reviewDialogOpen,
  });

  const getCurrentStatus = useCallback((stagesStatusValue: StagesStatusValue): string => {
    if (!stagesStatusValue) return "pending";
    if (Array.isArray(stagesStatusValue) && stagesStatusValue.length > 0) {
      const lastStage = stagesStatusValue[stagesStatusValue.length - 1];
      return lastStage?.status || "pending";
    }
    if (typeof stagesStatusValue === "string") {
      return stagesStatusValue;
    }
    return "pending";
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

        if (currentStatus === "approved" || currentStatus === "approve") {
          summary.approved++;
        } else if (currentStatus === "review") {
          summary.review++;
        } else if (currentStatus === "rejected" || currentStatus === "reject") {
          summary.rejected++;
        } else {
          summary.pending++;
        }
      }
    }

    return summary;
  }, [purchaseItemManager.items, initValues?.purchase_request_detail, purchaseItemManager]);

  const queryClient = useQueryClient();

  const hasFormChanges = (): boolean => {
    const currentValues = form.getValues();
    const bodyValues = currentValues.details;

    // ตรวจสอบการเปลี่ยนแปลงในฟิลด์หลัก
    const hasMainFieldChanges =
      bodyValues.pr_date !==
        (initValues?.pr_date || format(new Date(), dateFormat || "dd/MM/yyyy")) ||
      bodyValues.description !== (initValues?.description || "") ||
      bodyValues.workflow_id !== (initValues?.workflow_id || "") ||
      bodyValues.note !== (initValues?.note || "");

    const hasItemChanges = (bodyValues.purchase_request_detail?.add?.length ?? 0) > 0;
    return hasMainFieldChanges || hasItemChanges;
  };

  /** Main submit handler: prepares data and calls create/update */
  const handleSubmit = (data: CreatePrDto): void => {
    const processedData = prepareSubmitData(data);
    const isCreating = currentFormType === formType.ADD;
    if (isCreating) {
      createPurchaseRequest(processedData, createPr, router, tPR, toastSuccess, toastError);
    } else {
      updatePurchaseRequest(
        processedData,
        save,
        queryClient,
        buCode,
        initValues?.id,
        setCurrentFormType,
        tPR,
        toastSuccess,
        toastError
      );
    }
  };

  const handleConfirmDelete = () => {
    // ใช้ purchaseItemManager แทน
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

    if (hasFormChanges()) {
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

  const performCancel = () => {
    if (currentFormType === formType.ADD) {
      router.push("/procurement/purchase-request");
    } else {
      setCurrentFormType(formType.VIEW);
    }
  };

  const handleConfirmCancel = () => {
    if (cancelAction.type === "back") {
      router.push("/procurement/purchase-request");
    } else {
      performCancel();
    }
    setCancelDialogOpen(false);
  };

  const isDraft = initValues?.pr_status === "draft";

  /** Submit PR for workflow approval */
  const onSubmitPr = () => {
    const details = purchaseItemManager.items.map((item) => {
      const stagesStatusValue = (purchaseItemManager.getItemValue(item, "stages_status") ||
        item.stages_status) as StagesStatusValue;
      const stageMessage = getLastStageMessage(stagesStatusValue);
      return createStageDetail(item.id, "submit", stageMessage, "user submitted");
    });

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
    approve(
      {},
      {
        onSuccess: () => {
          toastSuccess({
            message: tPR("purchase_request_approved"),
          });
        },
        onError: () => {
          toastError({
            message: tPR("purchase_request_approved_failed"),
          });
        },
      }
    );
  };

  /** Reject PR items */
  const onReject = () => {
    const details = purchaseItemManager.items.map((item) => {
      const stagesStatusValue = (purchaseItemManager.getItemValue(item, "stages_status") ||
        item.stages_status) as StagesStatusValue;
      const stageMessage = getLastStageMessage(stagesStatusValue);
      return createStageDetail(item.id, "reject", stageMessage, "rejected");
    });

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

  /** Send back PR items for revision */
  const onSendBack = () => {
    const details = purchaseItemManager.items.map((item) => {
      const stagesStatusValue = (purchaseItemManager.getItemValue(item, "stages_status") ||
        item.stages_status) as StagesStatusValue;
      const stageMessage = getLastStageMessage(stagesStatusValue);
      return createStageDetail(item.id, "send_back", stageMessage, "sent back");
    });

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
    purchase(
      {},
      {
        onSuccess: () => {
          toastSuccess({
            message: tPR("purchase_request_approved_purchase"),
          });
        },
        onError: () => {
          toastError({
            message: tPR("purchase_request_approved_purchase_failed"),
          });
        },
      }
    );
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
      details:
        purchaseItemManager.items.map((item) => {
          const stagesStatusValue = (purchaseItemManager.getItemValue(item, "stages_status") ||
            item.stages_status) as StagesStatusValue;

          let stageMessage = "";
          if (Array.isArray(stagesStatusValue) && stagesStatusValue.length > 0) {
            const lastStage = stagesStatusValue[stagesStatusValue.length - 1];
            stageMessage = lastStage?.message || "";
          }

          return {
            id: item.id,
            stage_status: "review",
            stage_message: stageMessage || `กลับไป ${selectedStage}`,
          };
        }) || [],
    };

    review(reviewData, {
      onSuccess: () => {
        toastSuccess({
          message: tPR("purchase_request_reviewed"),
        });
        setReviewDialogOpen(false);
        setSelectedStage("");
        queryClient.invalidateQueries({
          queryKey: ["purchase-request", buCode, initValues?.id],
        });
      },
      onError: () => {
        toastError({
          message: tPR("purchase_request_reviewed_failed"),
        });
      },
    });
  };

  const isNewPr = currentFormType === formType.ADD;
  const prStatus = initValues?.pr_status;

  const watchForm = form.watch();

  return (
    <>
      <DetailsAndComments
        activityComponent={<ActivityLogComponent initialActivities={mockActivityPr} />}
        commentComponent={<CommentComponent initialComments={mockCommentsPr} />}
      >
        <div className="space-y-4">
          <Card className="p-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                  toastError({
                    message: "กรุณากรอกข้อมูลให้ครบถ้วน",
                  });
                })}
              >
                <ActionFields
                  mode={mode}
                  currentMode={currentFormType}
                  initValues={initValues}
                  onModeChange={setCurrentFormType}
                  onCancel={handleCancel}
                  hasFormChanges={hasFormChanges}
                  isCreatingPr={isCreatingPr || isPending}
                  prStatus={prStatus ?? ""}
                  hasFormErrors={Object.keys(form.formState.errors).length > 0}
                  workflowId={form.watch("details.workflow_id")}
                />
                <HeadForm
                  form={form}
                  mode={currentFormType}
                  workflow_id={initValues?.workflow_id}
                  requestor_name={
                    initValues?.requestor_name ? initValues.requestor_name : requestorName
                  }
                  department_name={
                    initValues?.department_name ? initValues.department_name : departments?.name
                  }
                  workflowStages={workflowStages}
                />
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
                      currentFormType={currentFormType}
                      items={purchaseItemManager.items}
                      initValues={initValues?.purchase_request_detail}
                      addFields={purchaseItemManager.addFields}
                      onItemUpdate={purchaseItemManager.updateItem}
                      onItemRemove={purchaseItemManager.removeItem}
                      onAddItem={purchaseItemManager.addItem}
                      getItemValue={purchaseItemManager.getItemValue}
                      getCurrentStatus={getCurrentStatus}
                      workflow_id={form.watch("details.workflow_id")}
                      prStatus={prStatus ?? ""}
                    />
                  </TabsContent>
                  {/* <TabsContent value="budget" className="mt-2">
                                        Budget Pr
                                    </TabsContent> */}
                  <TabsContent value="workflow" className="mt-2">
                    <WorkflowHistory workflow_history={initValues?.workflow_history} />
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
            <JsonViewer data={watchForm} title="Form Data" />
          </Card>

          {prStatus !== "voided" && (
            <ActionButtons
              prStatus={prStatus || ""}
              isNewPr={isNewPr}
              isDraft={isDraft}
              isPending={isPending}
              isSubmitDisabled={!form.watch("details.workflow_id")}
              itemsStatusSummary={itemsStatusSummary}
              onReject={onReject}
              onSendBack={onSendBack}
              onReview={onReview}
              onApprove={onApprove}
              onPurchaseApprove={onPurchaseApprove}
              onSubmitPr={onSubmitPr}
              onSave={form.handleSubmit(handleSubmit, (errors) => {
                toastError({
                  message: "กรุณากรอกข้อมูลให้ครบถ้วน",
                });
              })}
            />
          )}
        </div>
      </DetailsAndComments>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
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
