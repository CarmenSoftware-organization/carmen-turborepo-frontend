"use client";

import { formType } from "@/dtos/form.dto";
import { CreatePurchaseRequestSchema, PurchaseRequestByIdDto, PurchaseRequestCreateFormDto, PurchaseRequestUpdateFormDto, UpdatePurchaseRequestSchema } from "@/dtos/purchase-request.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import PurchaseItem from "./PurchaseItem";
import { Card } from "@/components/ui/card";
import { ArrowLeftRightIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import ActionFields from "./ActionFields";
import HeadForm from "./HeadForm";
import StatusPrInfo from "./StatusPrInfo";
import { useRouter } from "@/lib/navigation";
import DetailsAndComments from "@/components/DetailsAndComments";
import { usePrMutation } from "@/hooks/usePurchaseRequest";
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [updatedItems, setUpdatedItems] = useState<Record<string, any>>({});
    const [removedItems, setRemovedItems] = useState<Set<string>>(new Set());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [cancelAction, setCancelAction] = useState<CancelAction>({ type: 'cancel', event: null as any });
    const router = useRouter();

    const form = useForm<PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto>({
        resolver: (data, context, options) => {
            const schema =
                currentFormType === formType.ADD
                    ? CreatePurchaseRequestSchema
                    : UpdatePurchaseRequestSchema;
            return zodResolver(schema)(data, context, options);
        },
        defaultValues: {
            pr_date: initValues?.pr_date ? initValues.pr_date : new Date().toISOString(),
            description: initValues?.description ? initValues.description : "",
            requestor_id: user?.id,
            department_id: departments?.id,
            workflow_id: initValues?.workflow_id ? initValues.workflow_id : "",
            note: initValues?.note ? initValues.note : "",
            purchase_request_detail: {
                add: [],
                update: [],
                remove: [],
            },
        },
        mode: "onBlur",
    });

    const { mutate: createPr, isPending: isCreatingPr } = usePrMutation(token, tenantId);

    const { append: appendRemove } = useFieldArray({
        control: form.control,
        name: "purchase_request_detail.remove",
    });

    // ฟังก์ชันตรวจสอบว่ามีการเปลี่ยนแปลงข้อมูลหรือไม่
    const hasFormChanges = (): boolean => {
        const currentValues = form.getValues();

        // ตรวจสอบการเปลี่ยนแปลงในฟิลด์หลัก
        const hasMainFieldChanges =
            currentValues.pr_date !== (initValues?.pr_date || format(new Date(), dateFormat || "dd/MM/yyyy")) ||
            currentValues.description !== (initValues?.description || "") ||
            currentValues.workflow_id !== (initValues?.workflow_id || "") ||
            currentValues.note !== (initValues?.note || "");

        // ตรวจสอบการเปลี่ยนแปลงใน items
        const hasItemChanges =
            Object.keys(updatedItems).length > 0 ||
            removedItems.size > 0 ||
            (currentValues.purchase_request_detail?.add?.length ?? 0) > 0;
        return hasMainFieldChanges || hasItemChanges;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFieldUpdate = (item: any, fieldName: string, value: any, selectedProduct?: any) => {
        // Update local state สำหรับ UI
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: Record<string, any> = { [fieldName]: value };

        // ถ้าเป็น product_id และมี selectedProduct ให้ set inventory_unit_id ด้วย
        if (fieldName === 'product_id' && selectedProduct?.inventory_unit?.id) {
            updateData.inventory_unit_id = selectedProduct.inventory_unit.id;
        }

        setUpdatedItems(prev => ({
            ...prev,
            [item.id]: {
                ...prev[item.id],
                ...updateData
            }
        }));

        // ใช้ type assertion เพื่อหลีกเลี่ยง type inference ที่ซับซ้อน
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentUpdateArray = (form.getValues('purchase_request_detail.update') || []) as any[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existingIndex = currentUpdateArray.findIndex((field: any) => field.id === item.id);

        const updatedItem = {
            id: item.id,
            location_id: updatedItems[item.id]?.location_id ?? item.location_id,
            product_id: updatedItems[item.id]?.product_id ?? item.product_id,
            inventory_unit_id: updatedItems[item.id]?.inventory_unit_id ?? item.inventory_unit_id,
            description: updatedItems[item.id]?.description ?? item.description,
            requested_qty: updatedItems[item.id]?.requested_qty ?? item.requested_qty,
            requested_unit_id: updatedItems[item.id]?.requested_unit_id ?? item.requested_unit_id,
            delivery_date: updatedItems[item.id]?.delivery_date ?? item.delivery_date,
            approved_qty: updatedItems[item.id]?.approved_qty ?? item.approved_qty,
            approved_unit_id: updatedItems[item.id]?.approved_unit_id ?? item.approved_unit_id,
            foc_qty: updatedItems[item.id]?.foc_qty ?? item.foc_qty,
            foc_unit_id: updatedItems[item.id]?.foc_unit_id ?? item.foc_unit_id,
            pricelist_price: updatedItems[item.id]?.pricelist_price ?? item.pricelist_price,
            ...updateData
        };

        if (existingIndex >= 0) {
            // อัพเดทค่าเดิม - ใช้ type assertion
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            form.setValue(`purchase_request_detail.update.${existingIndex}` as any, updatedItem);
        } else {
            // เพิ่มใหม่ - ใช้ type assertion เพื่อหลีกเลี่ยง deep type inference
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentUpdateFields = (form.getValues('purchase_request_detail.update') || []) as any[];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            form.setValue('purchase_request_detail.update' as any, [...currentUpdateFields, updatedItem] as any);
        }
    };

    const handleSubmit = (data: PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto) => {
        if (mode === formType.ADD) {
            createPr(data, {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSuccess: (responseData: any) => {
                    console.log('responseData', responseData.data.id);

                    if (responseData?.data?.id) {
                        // Navigate to the specific purchase request page
                        router.replace(`/procurement/purchase-request/${responseData.data.id}`);
                        // window.location.reload();
                    }
                },
                onError: () => {
                    alert('error');
                }
            });
        } else {
            alert('update data');
            console.log('update data:', data);
        }
    }

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            // เพิ่มรายการลงใน removedItems
            setRemovedItems(prev => new Set(Array.from(prev).concat(itemToDelete)));

            // เพิ่มรายการลงใน purchase_request_detail.remove
            appendRemove({ id: itemToDelete });

            // ลบออกจาก purchase_request_detail.update ถ้ามีอยู่
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentUpdateArray = (form.getValues('purchase_request_detail.update') || []) as any[];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const filteredUpdateArray = currentUpdateArray.filter((item: any) => item.id !== itemToDelete);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            form.setValue('purchase_request_detail.update' as any, filteredUpdateArray);

            // ลบออกจาก updatedItems state
            setUpdatedItems(prev => {
                const newState = { ...prev };
                delete newState[itemToDelete];
                return newState;
            });
        }
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>, type: 'back' | 'cancel' = 'cancel') => {
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
            setUpdatedItems({});
            setRemovedItems(new Set());

            form.reset({
                pr_date: initValues?.pr_date ? initValues.pr_date : new Date().toISOString(),
                description: initValues?.description ? initValues.description : "",
                requestor_id: user?.id,
                department_id: departments?.id,
                workflow_id: initValues?.workflow_id ? initValues.workflow_id : "",
                note: initValues?.note ? initValues.note : "",
                purchase_request_detail: {
                    add: [],
                    update: [],
                    remove: [],
                },
            });
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

    const watchForm = form.watch();

    return (
        <>
            <DetailsAndComments
                commentPanel={<p>hello</p>}
            >
                <Card className="p-4 mb-2">
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
                            />
                            <div className="grid grid-cols-5 gap-2 mb-4">
                                <HeadForm
                                    form={form}
                                    mode={currentFormType}
                                    pr_no={initValues?.pr_no}
                                    workflow_id={initValues?.workflow_id}
                                    requestor_name={initValues?.requestor_name}
                                    department_name={initValues?.department_name}
                                />
                                {currentFormType !== formType.ADD && (
                                    <StatusPrInfo
                                        create_date={initValues?.created_at}
                                        status={initValues?.pr_status}
                                    />
                                )}
                            </div>
                            <Tabs defaultValue="items">
                                <TabsList className="w-full h-8">
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
                                        form={form}
                                        currentFormType={currentFormType}
                                        initValues={initValues?.purchase_request_detail}
                                        updatedItems={updatedItems}
                                        removedItems={removedItems}
                                        onFieldUpdate={handleFieldUpdate}
                                        onRemoveItem={(id, isAddItem) => {
                                            if (!isAddItem) {
                                                // เพิ่มรายการลงใน removedItems
                                                setRemovedItems(prev => new Set(Array.from(prev).concat(id)));

                                                // เพิ่มรายการลงใน purchase_request_detail.remove
                                                appendRemove({ id });

                                                // ลบออกจาก purchase_request_detail.update ถ้ามีอยู่
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                const currentUpdateArray = (form.getValues('purchase_request_detail.update') || []) as any[];
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                const filteredUpdateArray = currentUpdateArray.filter((item: any) => item.id !== id);
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                form.setValue('purchase_request_detail.update' as any, filteredUpdateArray);

                                                // ลบออกจาก updatedItems state
                                                setUpdatedItems(prev => {
                                                    const newState = { ...prev };
                                                    delete newState[id];
                                                    return newState;
                                                });
                                            }
                                        }}
                                    />
                                </TabsContent>
                                <TabsContent value="budget" className="mt-2">
                                    Budget Pr
                                </TabsContent>
                                <TabsContent value="workflow" className="mt-2">
                                    Workflow Pr
                                </TabsContent>
                            </Tabs>
                            <JsonViewer data={watchForm} title="Form Data" />
                        </form>
                    </Form>
                </Card>

                <div className="fixed bottom-6 right-6 flex gap-2 z-50 bg-background border shadow-lg p-2 rounded-lg">
                    <Button size={"sm"} className="h-7 px-2 text-xs">
                        <CheckCircleIcon className="w-4 h-4" />
                        Approve
                    </Button>
                    <Button
                        variant={"destructive"}
                        size={"sm"}
                        className="h-7 px-2 text-xs"
                    >
                        <XCircleIcon className="w-4 h-4" />
                        Reject
                    </Button>
                    <Button
                        variant={"outline"}
                        size={"sm"}
                        className="h-7 px-2 text-xs"
                    >
                        <ArrowLeftRightIcon className="w-4 h-4" />
                        Send Back
                    </Button>
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