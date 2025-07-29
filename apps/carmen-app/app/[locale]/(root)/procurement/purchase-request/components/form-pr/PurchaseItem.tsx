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
import { Checkbox } from "@/components/ui/checkbox";
import { Package, Plus } from "lucide-react";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    currentFormType: formType;
    initValues?: PurchaseRequestDetail[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatedItems: { [key: string]: any };
    removedItems: Set<string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                <Button
                    onClick={handleAddItem}
                    disabled={currentFormType === formType.VIEW}
                    size={"sm"}
                >
                    <Plus />
                    Add Item
                </Button>
            </div>

            <Table>
                <TableHeader className="bg-muted">
                    <TableRow>
                        <TableHead className="w-10">
                            <Checkbox />
                        </TableHead>
                        <TableHead className="w-10">#</TableHead>
                        <TableHead className="w-52">Location</TableHead>
                        <TableHead className="w-52">Product</TableHead>
                        <TableHead className="text-right">Requested</TableHead>
                        <TableHead className="text-right">Approved</TableHead>
                        <TableHead className="text-right">Price</TableHead>
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
                        initValues={initValues}
                        removedItems={removedItems}
                        updatedItems={updatedItems}
                        currentFormType={currentFormType}
                        onFieldUpdate={onFieldUpdate}
                        onRemoveItemClick={handleRemoveItemClick}
                    />

                    {/* แสดงข้อความเมื่อไม่มีรายการ */}
                    {addFields.length === 0 && (!initValues || initValues.filter(item => !removedItems.has(item.id)).length === 0) && (
                        <TableRow>
                            <TableCell colSpan={8}>
                                <div className="flex items-center justify-center gap-2 text-muted-foreground h-10">
                                    <Package className="w-4 h-4" />
                                    No product
                                </div>
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