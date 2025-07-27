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
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import DateInput from "@/components/form-custom/DateInput";

import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import PurchaseItem from "./PurchaseItem";

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
            pr_date: format(new Date(), "yyyy-MM-dd"),
            description: "",
            requestor_id: user?.id,
            department_id: departments?.id,
            workflow_id: "",
            note: "",
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
            delivery_date: updatedItems[item.id]?.delivery_date ?? new Date(item.delivery_date),
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
        console.log('handleSubmit', data);
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
        setCurrentFormType(formType.VIEW);
    }

    return (
        <div className="space-y-4">
            <h1>Current Mode: {currentFormType}</h1>
            <div className="flex justify-end">
                <Button variant="outline" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="outline" onClick={handleEdit}>
                    Edit
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                            </FormItem>
                        )}
                    />

                    <PurchaseItem
                        form={form}
                        currentFormType={currentFormType}
                        initValues={initValues}
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
            <div className="grid grid-cols-2 gap-2">
                <JsonViewer data={form.getValues()} title="Form Values" />
                <JsonViewer data={mockPr} title="Mock Values" />
            </div>

            {/* แสดงรายการ Product ID */}

            {/* Delete Confirm Dialog */}
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}