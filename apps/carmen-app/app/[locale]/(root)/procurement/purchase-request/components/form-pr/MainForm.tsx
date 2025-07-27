"use client";

import JsonViewer from "@/components/JsonViewer";
import { formType } from "@/dtos/form.dto";
import { CreatePurchaseRequestSchema, PurchaseRequestByIdDto, PurchaseRequestCreateFormDto, PurchaseRequestDetail, PurchaseRequestUpdateFormDto, UpdatePurchaseRequestDetailDto, UpdatePurchaseRequestSchema } from "@/dtos/purchase-request.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { mockPr } from "./payload-pr";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import DateInput from "@/components/form-custom/DateInput";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import PurchaseItem from "./PurchaseItem";
import { enum_workflow_type } from "@/dtos/workflows.dto";
import WorkflowLookup from "@/components/lookup/WorkflowLookup";

interface Props {
    mode: formType;
    initValues?: PurchaseRequestByIdDto;
}

export default function MainForm({ mode, initValues }: Props) {
    const [currentFormType, setCurrentFormType] = useState<formType>(mode);
    const [updatedItems, setUpdatedItems] = useState<{ [key: string]: any }>({});
    const [removedItems, setRemovedItems] = useState<Set<string>>(new Set());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const { user, departments } = useAuth();
    const form = useForm<PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto>({
        resolver: (data, context, options) => {
            const schema =
                currentFormType === formType.ADD
                    ? CreatePurchaseRequestSchema
                    : UpdatePurchaseRequestSchema;
            return zodResolver(schema)(data, context, options);
        },
        defaultValues: {
            pr_date: initValues?.pr_date ? initValues.pr_date : format(new Date(), "yyyy-MM-dd"),
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

    const { append: appendRemove } = useFieldArray({
        control: form.control,
        name: "purchase_request_detail.remove",
    });

    // ฟังก์ชันตรวจสอบว่ามีการเปลี่ยนแปลงข้อมูลหรือไม่
    const hasFormChanges = (): boolean => {
        const currentValues = form.getValues();

        // ตรวจสอบการเปลี่ยนแปลงในฟิลด์หลัก
        const hasMainFieldChanges =
            currentValues.pr_date !== (initValues?.pr_date || format(new Date(), "yyyy-MM-dd")) ||
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

    const handleFieldUpdate = (item: any, fieldName: string, value: any, selectedProduct?: any) => {
        // Update local state สำหรับ UI
        const updateData: any = { [fieldName]: value };

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

        const currentUpdateArray = form.getValues('purchase_request_detail.update') || [];
        const existingIndex = currentUpdateArray.findIndex(field => field.id === item.id);

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
            // อัพเดทค่าเดิม
            form.setValue(`purchase_request_detail.update.${existingIndex}`, updatedItem);
        } else {
            // เพิ่มใหม่
            const currentUpdateFields = form.getValues('purchase_request_detail.update') || [];
            form.setValue('purchase_request_detail.update', [...currentUpdateFields, updatedItem]);
        }
    };

    const handleSubmit = (data: PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto) => {
        console.log('handleSubmit called with data:', data);
    }

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            // เพิ่มรายการลงใน removedItems
            setRemovedItems(prev => new Set(Array.from(prev).concat(itemToDelete)));

            // เพิ่มรายการลงใน purchase_request_detail.remove
            appendRemove({ id: itemToDelete });

            // ลบออกจาก purchase_request_detail.update ถ้ามีอยู่
            const currentUpdateArray = form.getValues('purchase_request_detail.update') || [];
            const filteredUpdateArray = currentUpdateArray.filter(item => item.id !== itemToDelete);
            form.setValue('purchase_request_detail.update', filteredUpdateArray);

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

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentFormType(formType.EDIT);
    }

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // ตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่
        if (hasFormChanges()) {
            setCancelDialogOpen(true);
        } else {
            // ถ้าไม่มีการเปลี่ยนแปลง ให้ cancel ได้เลย
            performCancel();
        }
    }

    const performCancel = () => {
        // รีเซ็ตค่าทั้งหมดกลับสู่สถานะเดิม
        setCurrentFormType(formType.VIEW);
        setUpdatedItems({});
        setRemovedItems(new Set());

        // รีเซ็ต form กลับสู่ค่าเริ่มต้น
        form.reset({
            pr_date: initValues?.pr_date ? initValues.pr_date : format(new Date(), "yyyy-MM-dd"),
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
    };

    const handleConfirmCancel = () => {
        performCancel();
        setCancelDialogOpen(false);
    };

    return (
        <div className="space-y-4">
            <h1>Current Mode: {currentFormType}</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleEdit}
                        >
                            Edit
                        </Button>
                        <Button
                            type="submit"
                            disabled={!form.formState.errors}
                        >
                            Save
                        </Button>
                    </div>
                    <FormField
                        control={form.control}
                        name="pr_date"
                        disabled={mode === formType.VIEW}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <DateInput field={field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="workflow_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>PR Type</FormLabel>
                                <FormControl>
                                    <WorkflowLookup
                                        value={field.value ? field.value : initValues?.workflow_id}
                                        onValueChange={field.onChange}
                                        type={enum_workflow_type.purchase_request}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <PurchaseItem
                        form={form}
                        currentFormType={currentFormType}
                        initValues={initValues?.purchase_request_detail}
                        updatedItems={updatedItems}
                        removedItems={removedItems}
                        onFieldUpdate={handleFieldUpdate}
                        onRemoveItem={(id, isAddItem, addIndex) => {
                            if (!isAddItem) {
                                // เพิ่มรายการลงใน removedItems
                                setRemovedItems(prev => new Set(Array.from(prev).concat(id)));

                                // เพิ่มรายการลงใน purchase_request_detail.remove
                                appendRemove({ id });

                                // ลบออกจาก purchase_request_detail.update ถ้ามีอยู่
                                const currentUpdateArray = form.getValues('purchase_request_detail.update') || [];
                                const filteredUpdateArray = currentUpdateArray.filter(item => item.id !== id);
                                form.setValue('purchase_request_detail.update', filteredUpdateArray);

                                // ลบออกจาก updatedItems state
                                setUpdatedItems(prev => {
                                    const newState = { ...prev };
                                    delete newState[id];
                                    return newState;
                                });
                            }
                        }}
                    />
                </form>
            </Form>
            {/* <div className="grid grid-cols-2 gap-2">
                <JsonViewer data={form.getValues()} title="Form Values" />
                <JsonViewer data={form.formState.errors} title="Watch Error" />
            </div> */}

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
        </div>
    )
}