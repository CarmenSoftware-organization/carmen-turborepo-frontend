"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formType } from "@/dtos/form.dto";
import { PrSchemaV2Dto, prSchemaV2, PurchaseRequestByIdDto, PurchaseRequestDetailItemDto } from "@/dtos/pr.dto";
import { Link, useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircleIcon, ArrowLeftRightIcon, ChevronLeft, ChevronRight, Pencil, Save, X, XCircleIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import HeadPrForm from "./HeadPrForm";
import { Card } from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import ItemPr from "./ItemPr";
import WorkflowPr from "./WorkflowPr";
import ItemPrDialog from "./ItemPrDialog";
import { useAuth } from "@/context/AuthContext";
import { usePrMutation, useUpdatePrMutation } from "@/hooks/usePr";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import BudgetPr from "./BudgetPr";

type ItemWithId = PurchaseRequestDetailItemDto & { id?: string };

interface MainPrFormProps {
    readonly mode: formType;
    readonly initValues?: PurchaseRequestByIdDto;
    readonly docType?: string;
}

export default function MainPrForm({ mode, initValues }: MainPrFormProps) {
    const router = useRouter();
    const { token, tenantId } = useAuth();
    const [openLog, setOpenLog] = useState<boolean>(false);
    const [currentMode, setCurrentMode] = useState<formType>(mode);
    const [openDialogItemPr, setOpenDialogItemPr] = useState<boolean>(false);
    const [currentItemData, setCurrentItemData] = useState<ItemWithId | undefined>(undefined);
    const [currentItems, setCurrentItems] = useState<ItemWithId[]>([]);
    const { mutate: createPr, isSuccess: isCreateSuccess, isPending: isCreatePending, isError: isCreateError } = usePrMutation(token, tenantId);
    const { mutate: updatePr, isSuccess: isUpdateSuccess, isPending: isUpdatePending, isError: isUpdateError } = useUpdatePrMutation(token, tenantId);

    // Reset current items when initValues changes
    useEffect(() => {
        if (initValues?.purchase_request_detail) {
            setCurrentItems(initValues.purchase_request_detail as ItemWithId[]);
        }
    }, [initValues?.purchase_request_detail]);

    const defaultValues = {
        pr_date: initValues?.pr_date ?? new Date().toISOString(),
        pr_status: initValues?.pr_status ?? "draft",
        requestor_id: initValues?.requestor_id ?? "",
        department_id: initValues?.department_id ?? "",
        is_active: initValues?.is_active ?? true,
        doc_version: initValues?.doc_version ? parseFloat(initValues.doc_version.toString()) : 1.0,
        note: initValues?.note ?? "",
        description: initValues?.description ?? "",
        info: {
            priority: initValues?.info?.priority ?? "",
            budget_code: initValues?.info?.budget_code ?? "",
        },
        dimension: {
            cost_center: initValues?.dimension?.cost_center ?? "",
            project: initValues?.dimension?.project ?? "",
        },
        workflow_id: initValues?.workflow_id ?? "",
        workflow_name: initValues?.workflow_name ?? "",
        current_workflow_status: "pending",
        workflow_history: initValues?.workflow_history || [],
        purchase_request_detail: {
            add: [],
            update: [],
            delete: []
        },
    };


    const form = useForm<PrSchemaV2Dto>({
        resolver: zodResolver(prSchemaV2),
        defaultValues,
        mode: "onChange"
    });

    // Debug form state
    useEffect(() => {
        const { isDirty, errors, isValid } = form.formState;
        console.log('Form Debug:', {
            isDirty,
            isValid,
            errors,
            hasErrors: Object.keys(errors).length > 0,
            errorFields: Object.keys(errors)
        });
    }, [form.formState]);

    useEffect(() => {
        if (isCreateSuccess) {
            setCurrentMode(formType.VIEW);
            toastSuccess({ message: "Purchase Request created successfully" });
            router.push("/procurement/purchase-request");
        }
    }, [isCreateSuccess, router]);

    useEffect(() => {
        if (isUpdateSuccess) {
            setCurrentMode(formType.VIEW);
            toastSuccess({ message: "Purchase Request updated successfully" });
        }
    }, [isUpdateSuccess]);

    useEffect(() => {
        if (isCreateError) {
            toastError({ message: "Error creating Purchase Request" });
        }
    }, [isCreateError]);

    useEffect(() => {
        if (isUpdateError) {
            toastError({ message: "Error updating Purchase Request" });
        }
    }, [isUpdateError]);

    const onSubmit = async (data: PrSchemaV2Dto) => {
        try {
            if (currentMode === formType.ADD) {
                createPr(data);
            } else if (currentMode === formType.EDIT && initValues?.id) {
                updatePr({ id: initValues.id, data });
            }
        } catch (error) {
            console.error("Error in form submission:", error);
        }
    }

    const handleDialogItemPr = (e: React.MouseEvent, data: Record<string, unknown> & { id?: string }) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentItemData(data as ItemWithId);
        setOpenDialogItemPr(true);
    }

    const handleSaveItemDialog = (itemData: Record<string, unknown> & { id?: string }) => {
        const formItems = form.getValues("purchase_request_detail");
        let updatedItemsList = [...currentItems];

        if (itemData.id?.startsWith('temp-')) {
            // New item
            const newItem = { ...itemData };
            delete newItem.id;

            const updatedItems = {
                ...formItems,
                add: [...(formItems.add || []), newItem as PurchaseRequestDetailItemDto]
            };
            form.setValue("purchase_request_detail", updatedItems);
            updatedItemsList.push({ ...itemData as ItemWithId });
        } else if (itemData.id) {
            // Update existing item
            const updatedItems = {
                ...formItems,
                update: [...(formItems.update || []).filter((item: PurchaseRequestDetailItemDto) => (item as ItemWithId).id !== itemData.id), itemData as PurchaseRequestDetailItemDto]
            };
            form.setValue("purchase_request_detail", updatedItems);
            updatedItemsList = updatedItemsList.map(item =>
                item.id === itemData.id ? { ...item, ...itemData } as ItemWithId : item
            );
        }

        setCurrentItems(updatedItemsList);
        setOpenDialogItemPr(false);
    };

    const handleDeleteItem = (itemId: string) => {
        const formItems = form.getValues("purchase_request_detail");

        const updatedItems = {
            ...formItems,
            delete: [...(formItems.delete || []), { id: itemId }]
        };

        form.setValue("purchase_request_detail", updatedItems);
        setCurrentItems(currentItems.filter(item => item.id !== itemId));
    };

    return (
        <div className="relative">
            <div className="flex gap-4 relative">
                <ScrollArea className={`${openLog ? 'w-3/4' : 'w-full'} transition-all duration-300 ease-in-out h-[calc(121vh-300px)]`}>
                    <Card className="p-4 mb-4">
                        <Form {...form}>
                            <form
                                className="space-y-4"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Link href="/procurement/purchase-request">
                                            <ChevronLeft className="h-4 w-4" />
                                        </Link>
                                        <p className="text-lg font-bold">Purchase Request</p>
                                        {mode !== formType.ADD && (
                                            <Badge className="rounded-full">{initValues?.pr_status}</Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {currentMode === formType.VIEW ? (
                                            <>
                                                <Button variant="outline" size={'sm'} onClick={() => router.push("/procurement/purchase-request")}>
                                                    <ChevronLeft className="h-4 w-4" /> Back
                                                </Button>
                                                <Button variant="default" size={'sm'} onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setCurrentMode(formType.EDIT);
                                                }}>
                                                    <Pencil className="h-4 w-4" /> Edit
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button variant="outline" size={'sm'} onClick={() => currentMode === formType.ADD ? router.push("/procurement/purchase-request") : setCurrentMode(formType.VIEW)}>
                                                    <X className="h-4 w-4" /> Cancel
                                                </Button>
                                                <Button variant="default" size={'sm'} type="submit" disabled={isCreatePending || isUpdatePending}>
                                                    <Save className="h-4 w-4" /> Save
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <HeadPrForm
                                    control={form.control}
                                    mode={currentMode}
                                    prNo={initValues?.pr_no}
                                />
                                <Tabs defaultValue="items">
                                    <TabsList className="w-full">
                                        <TabsTrigger className="w-full" value="items">Items</TabsTrigger>
                                        <TabsTrigger className="w-full" value="budget">Budget</TabsTrigger>
                                        <TabsTrigger className="w-full" value="workflow">Workflow</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="items">
                                        <ItemPr
                                            itemsPr={currentItems.filter(item =>
                                                !form.getValues().purchase_request_detail.delete?.some(deleteItem => deleteItem.id === item.id)
                                            )}
                                            mode={currentMode}
                                            openDetail={handleDialogItemPr}
                                            onDeleteItem={handleDeleteItem}
                                        />
                                    </TabsContent>
                                    <TabsContent value="budget">
                                        <BudgetPr />
                                    </TabsContent>
                                    <TabsContent value="workflow">
                                        <WorkflowPr workflowData={initValues?.workflow_history} />
                                    </TabsContent>
                                </Tabs>
                            </form>
                        </Form>
                    </Card>
                    <div className="fixed bottom-6 right-6 flex gap-2 z-50">
                        <Button
                            size={'sm'}
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                            Approve
                        </Button>
                        <Button
                            variant={'destructive'}
                            size={'sm'}
                        >
                            <XCircleIcon className="w-5 h-5" />
                            Reject
                        </Button>
                        <Button
                            variant={'outline'}
                            size={'sm'}
                        >
                            <ArrowLeftRightIcon className="w-5 h-5" />
                            Send Back
                        </Button>
                    </div>
                </ScrollArea>

                <ItemPrDialog
                    open={openDialogItemPr}
                    onOpenChange={setOpenDialogItemPr}
                    isLoading={false}
                    mode={currentMode}
                    formValues={currentItemData}
                    onSave={handleSaveItemDialog}
                />
            </div>
            <Button
                aria-label={openLog ? "Close log panel" : "Open log panel"}
                onClick={() => setOpenLog(!openLog)}
                variant="default"
                size="sm"
                className="fixed right-0 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-l-full rounded-r-none z-50 shadow-lg"
            >
                {openLog ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
            </Button>
        </div>
    )
}
