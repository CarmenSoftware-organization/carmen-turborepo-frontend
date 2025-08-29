"use client";

import { formType } from "@/dtos/form.dto";
import { CreatePrDto, CreatePrSchema, PurchaseRequestByIdDto, STAGE_ROLE } from "@/dtos/purchase-request.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePurchaseItemManagement } from "@/hooks/usePurchaseItemManagement";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import PurchaseItem from "./PurchaseItem";
import { Card } from "@/components/ui/card";
import { ArrowLeftIcon, CheckCircleIcon, CircleX, SendIcon } from "lucide-react";
import ActionFields from "./ActionFields";
import HeadForm from "./HeadForm";

import { useRouter } from "@/lib/navigation";
import DetailsAndComments from "@/components/DetailsAndComments";
import { usePrMutation, useUpdateUPr } from "@/hooks/usePurchaseRequest";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { mockActivityPr, mockCommentsPr } from "./mock-budget";
import ActivityLogComponent from "@/components/comment-activity/ActivityLogComponent";
import CommentComponent from "@/components/comment-activity/CommentComponent";
import WorkflowHistory from "./WorkflowHistory";
import JsonViewer from "@/components/JsonViewer";

interface Props {
    mode: formType;
    initValues?: PurchaseRequestByIdDto;
}

interface CancelAction {
    type: 'back' | 'cancel';
    event: React.MouseEvent<HTMLButtonElement>;
}

export default function MainForm({ mode, initValues }: Props) {
    const { token, tenantId, user, departments, dateFormat } = useAuth();
    const [currentFormType, setCurrentFormType] = useState<formType>(mode);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [cancelAction, setCancelAction] = useState<CancelAction>({ type: 'cancel', event: null as any });
    const router = useRouter();

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
                    remove: []
                },
            }
        },
        mode: "onBlur",
    });

    const { mutate: createPr, isPending: isCreatingPr } = usePrMutation(token, tenantId);

    const { mutate: updatePr, isPending: isUpdatingPr } = useUpdateUPr(
        token, tenantId, initValues?.id || "", 'save');

    const { mutate: submitPr, isPending: isSubmittingPr } = useUpdateUPr(
        token, tenantId, initValues?.id || "", 'submit');

    const { mutate: approvePr, isPending: isApprovingPr } = useUpdateUPr(
        token, tenantId, initValues?.id || "", 'approve');

    const { mutate: purchaseApprovePr, isPending: isPurchasingApprovePr } = useUpdateUPr(
        token, tenantId, initValues?.id || "", 'purchase');

    const { mutate: reviewPr, isPending: isReviewingPr } = useUpdateUPr(
        token, tenantId, initValues?.id || "", 'review');

    const { mutate: rejectPr, isPending: isRejectingPr } = useUpdateUPr(
        token, tenantId, initValues?.id || "", 'reject');

    const { mutate: sendBackPr, isPending: isSendingBackPr } = useUpdateUPr(
        token, tenantId, initValues?.id || "", 'send_back');

    // ใช้ custom hook สำหรับจัดการ purchase items
    const purchaseItemManager = usePurchaseItemManagement({
        form,
        initValues: initValues?.purchase_request_detail
    });


    // ฟังก์ชันตรวจสอบว่ามีการเปลี่ยนแปลงข้อมูลหรือไม่
    const hasFormChanges = (): boolean => {
        const currentValues = form.getValues();
        const bodyValues = currentValues.body;

        // ตรวจสอบการเปลี่ยนแปลงในฟิลด์หลัก
        const hasMainFieldChanges =
            bodyValues.pr_date !== (initValues?.pr_date || format(new Date(), dateFormat || "dd/MM/yyyy")) ||
            bodyValues.description !== (initValues?.description || "") ||
            bodyValues.workflow_id !== (initValues?.workflow_id || "") ||
            bodyValues.note !== (initValues?.note || "");

        // ตรวจสอบการเปลี่ยนแปลงใน items (เฉพาะ CREATE mode)
        const hasItemChanges = (bodyValues.purchase_request_detail?.add?.length ?? 0) > 0;
        return hasMainFieldChanges || hasItemChanges;
    };



    const handleSubmit = (data: CreatePrDto) => {

        if (data.body.purchase_request_detail?.add?.length && data.body.purchase_request_detail.add.length > 0) {
            data.body.purchase_request_detail.add.forEach((item) => {
                delete item.id;
            });
        };

        if (currentFormType === formType.ADD) {
            createPr(data as any, {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSuccess: (responseData: any) => {
                    if (responseData?.data?.id) {
                        router.replace(`/procurement/purchase-request/${responseData.data.id}`);
                        toastSuccess({
                            message: "Purchase Request created successfully",
                        })
                    }
                },
                onError: () => {
                    toastError({
                        message: "Purchase Request created failed",
                    })
                }
            });
        } else {
            updatePr({
                ...data,
                action: 'save'
            } as any, {
                onSuccess: () => {
                    toastSuccess({
                        message: "Purchase Request updated successfully",
                    })
                    // window.location.reload();
                    setCurrentFormType(formType.VIEW);
                },
                onError: () => {
                    toastError({
                        message: "Purchase Request updated failed",
                    })
                }
            });
        }
    }

    const handleConfirmDelete = () => {
        // ใช้ purchaseItemManager แทน
        if (itemToDelete) {
            const index = parseInt(itemToDelete);
            if (index >= 0) {
                purchaseItemManager.removeField(index);
            }
        }
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>, type: 'back' | 'cancel') => {
        e.preventDefault();
        e.stopPropagation();

        if (hasFormChanges()) {
            setCancelAction({ type, event: e });
            setCancelDialogOpen(true);
            return;
        }
        if (type === 'back') {
            router.push("/procurement/purchase-request");
            return;
        }

        performCancel();
    }


    const performCancel = () => {
        if (currentFormType === formType.ADD) {
            router.push("/procurement/purchase-request");
        } else {
            setCurrentFormType(formType.VIEW);
        }
    };

    const handleConfirmCancel = () => {
        if (cancelAction.type === 'back') {
            router.push("/procurement/purchase-request");
        } else {
            performCancel();
        }
        setCancelDialogOpen(false);
    };

    const watchError = form.formState.errors;
    const hasError = Object.keys(watchError).length > 0;
    const canSave = !hasError && hasFormChanges();

    const requestorName = user?.user_info.firstname + ' ' + user?.user_info.lastname;

    const workflowStages = Array.isArray(initValues?.workflow_history)
        ? initValues.workflow_history.map((item: any) => ({
            title: item.current_stage,
        }))
        : [];

    const watchForm = form.watch();

    const onSubmitPr = () => {
        submitPr({} as any, {
            onSuccess: () => {
                toastSuccess({
                    message: "Purchase Request submitted successfully",
                })
            },
            onError: () => {
                toastError({
                    message: "Purchase Request submitted failed",
                })
            }
        })
    };

    const onApprovePr = () => {
        approvePr({} as any, {
            onSuccess: () => {
                toastSuccess({
                    message: "Purchase Request approved successfully",
                })
            },
            onError: () => {
                toastError({
                    message: "Purchase Request approved failed",
                })
            }
        })
    };

    const onRejectPr = () => {
        rejectPr({} as any, {
            onSuccess: () => {
                toastSuccess({
                    message: "Purchase Request rejected successfully",
                })
            },
            onError: () => {
                toastError({
                    message: "Purchase Request rejected failed",
                })
            }
        })
    }

    const onSendBackPr = () => {
        sendBackPr({} as any, {
            onSuccess: () => {
                toastSuccess({
                    message: "Purchase Request sent back successfully",
                })
            },
            onError: () => {
                toastError({
                    message: "Purchase Request sent back failed",
                })
            }
        })
    };

    const onApprovePurchasePr = () => {
        purchaseApprovePr({} as any, {
            onSuccess: () => {
                toastSuccess({
                    message: "Purchase Request approved successfully",
                })
            },
            onError: () => {
                toastError({
                    message: "Purchase Request approved failed",
                })
            }
        })
    };


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
                                    isError={!canSave}
                                    hasFormChanges={hasFormChanges}
                                    isCreatingPr={isCreatingPr || isUpdatingPr}
                                />
                                <HeadForm
                                    form={form as any}
                                    mode={currentFormType}
                                    workflow_id={initValues?.workflow_id}
                                    requestor_name={initValues?.requestor_name ? initValues.requestor_name : requestorName}
                                    department_name={initValues?.department_name ? initValues.department_name : departments?.name}
                                    workflowStages={workflowStages}
                                />
                                <Tabs defaultValue="items">
                                    <TabsList className="w-full h-8 mt-4">
                                        <TabsTrigger className="w-full" value="items">
                                            Items
                                        </TabsTrigger>
                                        <TabsTrigger className="w-full" value="budget">
                                            Budget
                                        </TabsTrigger>
                                        <TabsTrigger className="w-full" value="workflow">
                                            Workflow
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="items" className="mt-2">
                                        <PurchaseItem
                                            currentFormType={currentFormType}
                                            items={purchaseItemManager.items}
                                            initValues={initValues?.purchase_request_detail}
                                            addFields={purchaseItemManager.addFields}
                                            onItemUpdate={purchaseItemManager.updateItem}
                                            onItemRemove={purchaseItemManager.removeItem}
                                            onAddItem={purchaseItemManager.addItem}
                                            getItemValue={purchaseItemManager.getItemValue}
                                        />
                                    </TabsContent>
                                    <TabsContent value="budget" className="mt-2">
                                        Budget Pr
                                    </TabsContent>
                                    <TabsContent value="workflow" className="mt-2">
                                        <WorkflowHistory workflow_history={initValues?.workflow_history} />
                                    </TabsContent>
                                </Tabs>
                            </form>
                        </Form>
                        {/* <JsonViewer data={watchForm} title="Form Data" /> */}
                    </Card>

                    <div className="fixed bottom-10 right-20 flex items-center gap-2 bg-background shadow-lg border border-border rounded-md p-2">
                        <Button
                            size={'sm'}
                            className="bg-destructive hover:bg-destructive/80"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onRejectPr();
                            }}
                        >
                            <CircleX />
                            Reject
                        </Button>
                        <Button
                            size={'sm'}
                            className="bg-destructive hover:bg-destructive/80"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onSendBackPr();
                            }}
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Send Back
                        </Button>
                        <Button
                            size={'sm'}
                            className="bg-active hover:bg-active/80"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onSubmitPr();
                            }}
                            disabled={isSubmittingPr}
                        >
                            <SendIcon className="w-4 h-4" />
                            Submit
                        </Button>
                        <Button
                            size={'sm'}
                            className="bg-active hover:bg-active/80"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // onApprovePr();
                                alert('"state_role": "approve"')
                            }}
                            disabled={isApprovingPr}
                        >
                            <CheckCircleIcon className="w-4 h-4" />
                            Approve
                        </Button>
                        <Button
                            size={'sm'}
                            className="bg-active hover:bg-active/80"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                alert('"state_role": "purchase"')
                                onApprovePurchasePr();
                            }}
                        >
                            <CheckCircleIcon className="w-4 h-4" />
                            Approve Purchase
                        </Button>
                    </div>
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
                        <AlertDialogTitle>Confirm Cancel</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have unsaved changes. If you cancel, all changes will be lost. Do you want to cancel?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}