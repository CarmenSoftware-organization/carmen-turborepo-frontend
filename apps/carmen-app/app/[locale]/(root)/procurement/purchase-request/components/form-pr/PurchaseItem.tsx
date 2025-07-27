"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { nanoid } from "nanoid";
import { useState } from "react";
import AddfieldItem from "./AddfieldItem";
import EditFieldItem from "./EditFieldItem";

interface Props {
    form: UseFormReturn<any>;
    currentFormType: formType;
    initValues?: {
        purchase_request_detail?: PurchaseRequestDetail[];
    };
    updatedItems: { [key: string]: any };
    removedItems: Set<string>;
    onFieldUpdate: (item: any, fieldName: string, value: any, selectedProduct?: any) => void;
    onRemoveItem: (id: string, isAddItem?: boolean, addIndex?: number) => void;
}

export default function PurchaseItem({
    form,
    currentFormType,
    initValues,
    updatedItems,
    removedItems,
    onFieldUpdate,
    onRemoveItem
}: Props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; isAddItem: boolean; addIndex?: number } | null>(null);

    const {
        fields: addFields,
        append: addAppend,
        remove: addRemove,
    } = useFieldArray({
        control: form.control,
        name: "purchase_request_detail.add",
    });

    const handleAddItem = () => {
        addAppend({
            id: nanoid(),
            location_id: "",
            product_id: "",
            inventory_unit_id: "",
            description: "",
            requested_qty: 0,
            requested_unit_id: "",
            delivery_date: undefined,
        });
    };

    const handleRemoveItemClick = (id: string, isAddItem: boolean = false, addIndex?: number) => {
        if (isAddItem && addIndex !== undefined) {
            addRemove(addIndex);
        } else {
            setItemToDelete({ id, isAddItem, addIndex });
            setDeleteDialogOpen(true);
        }
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            if (itemToDelete.isAddItem && itemToDelete.addIndex !== undefined) {
                addRemove(itemToDelete.addIndex);
            } else {
                onRemoveItem(itemToDelete.id, itemToDelete.isAddItem, itemToDelete.addIndex);
            }
        }
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };



    return (
        <div className="mt-4">
            <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={handleAddItem}>
                    เพิ่มรายการ
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-52">Location</TableHead>
                        <TableHead className="w-52">Product</TableHead>
                        <TableHead className="text-right">Requested</TableHead>
                        <TableHead className="text-center">Delivery Date</TableHead>
                        {currentFormType !== formType.VIEW && (
                            <TableHead className="text-center">More</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <AddfieldItem
                        form={form}
                        addFields={addFields}
                        onRemoveItemClick={handleRemoveItemClick}
                    />

                    <EditFieldItem
                        initValues={initValues?.purchase_request_detail}
                        removedItems={removedItems}
                        updatedItems={updatedItems}
                        currentFormType={currentFormType}
                        onFieldUpdate={onFieldUpdate}
                        onRemoveItemClick={handleRemoveItemClick}
                    />

                    {/* แสดงข้อความเมื่อไม่มีรายการ */}
                    {addFields.length === 0 && (!initValues?.purchase_request_detail || initValues.purchase_request_detail.filter(item => !removedItems.has(item.id)).length === 0) && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                No product
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Delete Confirm Dialog */}
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}