"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formType } from "@/dtos/form.dto";
import { PrSchemaV2Dto, prSchemaV2, PurchaseRequestByIdDto, PurchaseRequestDetailItemDto } from "@/dtos/pr.dto";
import { Link, useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Pencil, Save, X } from "lucide-react";
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
import { postPrData } from "./post-pr";
import { usePrMutation } from "@/hooks/usePr";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

type ItemWithId = PurchaseRequestDetailItemDto & { id?: string };

interface MainPrFormProps {
    readonly mode: formType;
    readonly initValues?: PurchaseRequestByIdDto;
}

export default function MainPrForm({ mode, initValues }: MainPrFormProps) {
    const router = useRouter();
    const { token, tenantId } = useAuth();
    const [openLog, setOpenLog] = useState<boolean>(false);
    const [currentMode, setCurrentMode] = useState<formType>(mode);
    const [openDialogItemPr, setOpenDialogItemPr] = useState<boolean>(false);
    const [currentItemData, setCurrentItemData] = useState<ItemWithId | undefined>(undefined);
    const [currentItems, setCurrentItems] = useState<ItemWithId[]>([]);
    const { mutate: createPr, isSuccess, isPending } = usePrMutation(token, tenantId);

    // Reset current items when initValues changes
    useEffect(() => {
        if (initValues?.purchase_request_detail) {
            setCurrentItems(initValues.purchase_request_detail as ItemWithId[]);
        }
    }, [initValues?.purchase_request_detail]);

    const defaultValues: Partial<PrSchemaV2Dto> = {
        pr_date: new Date(initValues?.pr_date || new Date()) as Date,
        pr_status: initValues?.pr_status ?? "draft",
        requestor_id: initValues?.requestor_id ?? "",
        department_id: initValues?.department_id ?? "",
        is_active: initValues?.is_active ?? true,
        doc_version: initValues?.doc_version ? Number(initValues.doc_version) : 1,
        note: initValues?.note ?? "",
        info: {
            priority: initValues?.info?.priority ?? "",
            budget_code: initValues?.info?.budget_code ?? "",
        },
        dimension: {
            cost_center: initValues?.dimension?.cost_center ?? "",
            project: initValues?.dimension?.project ?? "",
        },
        workflow_id: "f224d743-7cfa-46f6-8f72-85b14c6a355e",
        current_workflow_status: "",
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
    }, [form.formState.isDirty, form.formState.errors, form.formState.isValid]);
    console.log("data log", currentItemData);

    const onSubmit = async (data: PrSchemaV2Dto) => {
        try {
            createPr(data);
            if (isSuccess) {
                setCurrentMode(formType.VIEW);
                toastSuccess({ message: "Purchase Request created successfully" });
            } else {
                toastError({ message: "Error creating Purchase Request" });
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

    const handleTestPostPr = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        createPr(postPrData);
    }

    return (
        <div className="relative">
            <div className="flex gap-4 relative">
                <ScrollArea className={`${openLog ? 'w-3/4' : 'w-full'} transition-all duration-300 ease-in-out h-[calc(121vh-300px)]`}>
                    <Card className="p-4 mb-4">
                        <Button variant={'destructive'} size={'sm'} onClick={handleTestPostPr}>
                            test post pr
                        </Button>
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
                                                <Button variant="default" size={'sm'} onClick={() => setCurrentMode(formType.EDIT)}>
                                                    <Pencil className="h-4 w-4" /> Edit
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button variant="outline" size={'sm'} onClick={() => currentMode === formType.ADD ? router.push("/procurement/purchase-request") : setCurrentMode(formType.VIEW)}>
                                                    <X className="h-4 w-4" /> Cancel
                                                </Button>
                                                <Button variant="default" size={'sm'} type="submit" disabled={isPending}>
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
                                    <TabsContent value="workflow">
                                        <WorkflowPr workflowData={initValues?.workflow_history} />
                                    </TabsContent>
                                </Tabs>
                            </form>
                        </Form>
                    </Card>
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
