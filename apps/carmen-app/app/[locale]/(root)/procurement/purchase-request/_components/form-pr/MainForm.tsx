"use client";

import { formType } from "@/dtos/form.dto";
import {
  CreatePrDto,
  CreatePrSchema,
  PurchaseRequestByIdDto,
  STAGE_ROLE,
  StageStatus,
} from "@/dtos/purchase-request.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { usePurchaseItemManagement } from "@/app/[locale]/(root)/procurement/purchase-request/_hooks/use-purchase-item-management";
import { useAuth } from "@/context/AuthContext";
import { Form } from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import PurchaseItemDataGrid from "./PurchaseItemDataGrid";
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
import { usePrActions } from "@/app/[locale]/(root)/procurement/purchase-request/_hooks/use-pr-actions";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
// import JsonViewer from "@/components/JsonViewer";

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
  const tAction = useTranslations("Action");
  const [currentFormType, setCurrentFormType] = useState<formType>(mode);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelAction, setCancelAction] = useState<CancelAction>({ type: "cancel", event: null });

  const form = useForm<CreatePrDto>({
    resolver: zodResolver(CreatePrSchema),
    defaultValues: {
      state_role: STAGE_ROLE.CREATE,
      body: {
        pr_date: initValues?.pr_date ? initValues.pr_date : new Date().toISOString(),
        requestor_id: user?.id || "",
        department_id: departments?.id || "",
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

  console.log("current stage", initValues?.purchase_request_detail);

  // Helper function to get current status from stages_status
  const getCurrentStatus = (stagesStatusValue: string | StageStatus[] | undefined): string => {
    if (!stagesStatusValue) return "pending";

    // ถ้า stages_status เป็น array ให้เอาตัวล่าสุด (status จาก object)
    if (Array.isArray(stagesStatusValue) && stagesStatusValue.length > 0) {
      const lastStage = stagesStatusValue[stagesStatusValue.length - 1];
      return lastStage?.status || "pending";
    }

    // ถ้าเป็น string ให้ return เลย
    if (typeof stagesStatusValue === "string") {
      return stagesStatusValue;
    }

    return "pending";
  };

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
        const stagesStatusValue: string | StageStatus[] | undefined =
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
    const bodyValues = currentValues.body;

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
      data.body.purchase_request_detail?.add &&
      data.body.purchase_request_detail.add.length > 0
    ) {
      data.body.purchase_request_detail.add = data.body.purchase_request_detail.add.map((item) => {
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

        return cleanedItem;
      });
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

  const requestorName = user?.user_info.firstname + " " + user?.user_info.lastname;

  const workflowStages = Array.isArray(initValues?.workflow_history)
    ? initValues.workflow_history.map((item: { current_stage?: string }) => ({
        title: item.current_stage ?? "",
      }))
    : [];

  const isDraft = initValues?.pr_status === "draft";

  const onSubmitPr = () => {
    submit(
      {},
      {
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
      }
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

  const onReject = () => {
    const rejectData = {
      stage_role: STAGE_ROLE.REJECT,
      body:
        initValues?.purchase_request_detail?.map((item) => ({
          id: item.id,
          stage_status: "reject",
          stage_message: "ไม่ต้องซื้อ",
        })) || [],
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
      stage_role: STAGE_ROLE.SEND_BACK,
      body:
        initValues?.purchase_request_detail?.map((item) => ({
          id: item.id,
          stage_status: "send_back",
          stage_message: "ส่งกลับ",
        })) || [],
    };

    sendBack(sendBackData, {
      onSuccess: () => {
        toastSuccess({
          message: tPR("purchase_request_sent_back"),
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
    const reviewData = {
      stage_role: STAGE_ROLE.CREATE,
      des_stage: "HOD",
      body:
        initValues?.purchase_request_detail?.map((item) => ({
          id: item.id,
          stage_status: "review",
          stage_message: "กลับไป HOD",
        })) || [],
    };

    review(reviewData, {
      onSuccess: () => {
        toastSuccess({
          message: tPR("purchase_request_reviewed"),
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

  // const watchForm = form.watch();

  // console.log("form.formState.errors", form.formState.errors);

  return (
    <>
      <DetailsAndComments
        activityComponent={<ActivityLogComponent initialActivities={mockActivityPr} />}
        commentComponent={<CommentComponent initialComments={mockCommentsPr} />}
      >
        <div className="space-y-4">
          <Card className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                  workflowId={form.watch("body.workflow_id")}
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
                      workflow_id={form.watch("body.workflow_id")}
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
            {/* <JsonViewer data={watchForm} title="Form Data" /> */}
          </Card>

          {prStatus !== "voided" && (
            <ActionButtons
              prStatus={prStatus || ""}
              isNewPr={isNewPr}
              isDraft={isDraft}
              isPending={isPending}
              isSubmitDisabled={!form.watch("body.workflow_id")}
              itemsStatusSummary={itemsStatusSummary}
              onReject={onReject}
              onSendBack={onSendBack}
              onReview={onReview}
              onApprove={onApprove}
              onPurchaseApprove={onPurchaseApprove}
              onSubmitPr={onSubmitPr}
              onSave={form.handleSubmit(handleSubmit)}
            />
          )}
        </div>
      </DetailsAndComments>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tPR("confirm_cancel")}</AlertDialogTitle>
            <AlertDialogDescription>{tPR("confirm_cancel_description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tAction("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {tAction("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
