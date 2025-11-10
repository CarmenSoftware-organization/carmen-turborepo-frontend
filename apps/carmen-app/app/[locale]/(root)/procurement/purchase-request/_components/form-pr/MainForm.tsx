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

  const handleSubmit = (data: CreatePrDto) => {
    if (
      data.details.purchase_request_detail?.add &&
      data.details.purchase_request_detail.add.length > 0
    ) {
      data.details.purchase_request_detail.add = data.details.purchase_request_detail.add.map(
        (item) => {
          const { id, ...cleanedItem } = item as Record<string, unknown>;

          for (const key of Object.keys(cleanedItem)) {
            if (cleanedItem[key] === "" || cleanedItem[key] === null) {
              delete cleanedItem[key];
            }
          }

          if (cleanedItem.requested_qty !== undefined) {
            cleanedItem.requested_qty = Number(cleanedItem.requested_qty);
          }
          if (cleanedItem.approved_qty !== undefined) {
            cleanedItem.approved_qty = Number(cleanedItem.approved_qty);
          }
          if (cleanedItem.foc_qty !== undefined) {
            cleanedItem.foc_qty = Number(cleanedItem.foc_qty);
          }

          return cleanedItem as typeof item;
        }
      );
    }

    if (currentFormType === formType.ADD) {
      createPr(data, {
        onSuccess: (responseData: unknown) => {
          const response = responseData as { data?: { id?: string } };
          if (response?.data?.id) {
            router.replace(`/procurement/purchase-request/${response.data.id}`);
            toastSuccess({
              message: tPR("purchase_request_created"),
            });
          }
        },
        onError: () => {
          toastError({
            message: tPR("purchase_request_created_failed"),
          });
        },
      });
    } else {
      save(data, {
        onSuccess: () => {
          toastSuccess({
            message: tPR("purchase_request_updated"),
          });
          queryClient.invalidateQueries({
            queryKey: ["purchase-request", buCode, initValues?.id],
          });
          setCurrentFormType(formType.VIEW);
        },
        onError: () => {
          toastError({
            message: tPR("purchase_request_updated_failed"),
          });
        },
      });
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

  const onSubmitPr = () => {
    const submitData = {
      state_role: STAGE_ROLE.CREATE,
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
            stage_status: "submit",
            stage_message: stageMessage || "user submitted",
          };
        }) || [],
    };
    submit(submitData, {
      onSuccess: () => {
        toastSuccess({
          message: tPR("purchase_request_submitted"),
        });
        queryClient.invalidateQueries({
          queryKey: ["purchase-request", buCode, initValues?.id],
        });
      },
      onError: () => {
        toastError({
          message: tPR("purchase_request_submitted_failed"),
        });
      },
    });
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

  const onReject = () => {
    const rejectData = {
      state_role: STAGE_ROLE.ISSUE,
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
            stage_status: "reject",
            stage_message: stageMessage || "rejected",
          };
        }) || [],
    };
    reject(rejectData, {
      onSuccess: () => {
        toastSuccess({
          message: tPR("purchase_request_rejected"),
        });
        queryClient.invalidateQueries({
          queryKey: ["purchase-request", buCode, initValues?.id],
        });
      },
      onError: () => {
        toastError({
          message: tPR("purchase_request_rejected_failed"),
        });
      },
    });
  };

  const onSendBack = () => {
    const sendBackData = {
      state_role: STAGE_ROLE.ISSUE,
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
            stage_status: "send_back",
            stage_message: stageMessage || "sent back",
          };
        }) || [],
    };

    sendBack(sendBackData, {
      onSuccess: () => {
        toastSuccess({
          message: tPR("purchase_request_sent_back"),
        });
        queryClient.invalidateQueries({
          queryKey: ["purchase-request", buCode, initValues?.id],
        });
      },
      onError: () => {
        toastError({
          message: tPR("purchase_request_sent_back_failed"),
        });
      },
    });
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

  console.log("eerr", form.formState.errors);

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
