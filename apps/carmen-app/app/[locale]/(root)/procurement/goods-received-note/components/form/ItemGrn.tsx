"use client";

import { CreateGRNDto, GoodReceivedNoteDetailItemDto } from "@/dtos/grn.dto";
import { Control, useFieldArray, useWatch } from "react-hook-form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import DialogItemGrnForm from "./DialogItemGrnForm";
import { useUnit } from "@/hooks/useUnit";
import { useStoreLocation } from "@/hooks/useStoreLocation";
import { useProduct } from "@/hooks/useProduct";

interface ItemGrnProps {
    readonly control: Control<CreateGRNDto>;
    readonly mode: formType;
}

export default function ItemGrn({ control, mode }: ItemGrnProps) {

    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editItem, setEditItem] = useState<GoodReceivedNoteDetailItemDto | null>(null);

    const { getUnitName } = useUnit();
    const { getLocationName } = useStoreLocation();
    const { getProductName } = useProduct();

    // Watch initData to pass to dialog
    const initData = useWatch({
        control,
        name: "good_received_note_detail.initData"
    });

    // Field arrays for add and update
    const addFields = useFieldArray({
        control,
        name: "good_received_note_detail.add",
    });

    const updateFields = useFieldArray({
        control,
        name: "good_received_note_detail.update",
    });

    // Combine all items for display (initData + add items)
    const allItems = [
        ...(initData || []),
        ...addFields.fields
    ];

    const handleSelectItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === allItems.length) {
            setSelectedItems([]);
        } else {
            const allIds = allItems.map(item => item.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const handleAddItem = (newItem: GoodReceivedNoteDetailItemDto, action: 'add' | 'update') => {
        console.log('=== ItemGrn handleAddItem ===');
        console.log('Action:', action);
        console.log('Item:', newItem);

        if (action === 'add') {
            // Add to add array
            addFields.append(newItem);
            console.log('✅ Added to add array');
        } else if (action === 'update') {
            // Add to update array
            updateFields.append(newItem);
            console.log('✅ Added to update array');
        }

        setEditItem(null);
        setDialogOpen(false);
    };


    const handleRowClick = (item: GoodReceivedNoteDetailItemDto) => {
        if (mode !== formType.VIEW) {
            setEditItem(item);
            setDialogOpen(true);
            console.log("Edit item:", item);
        }
    };

    const handleEditClick = (e: React.MouseEvent, item: GoodReceivedNoteDetailItemDto) => {
        e.preventDefault();
        e.stopPropagation();
        setEditItem(item);
        setDialogOpen(true);
        console.log("Edit item:", item);
    };

    const handleAddNewClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setEditItem(null);
        setDialogOpen(true);
        console.log("Add new item");
    };

    const isAllSelected = allItems.length > 0 && selectedItems.length === allItems.length;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center p-2">
                <p className="text-base font-medium">Items Details</p>
                <Button variant="default" size="sm" disabled={mode === formType.VIEW} onClick={handleAddNewClick}>
                    <Plus />
                    Add Item
                </Button>
            </div>

            <DialogItemGrnForm
                mode={mode}
                onAddItem={handleAddItem}
                initialData={editItem}
                initData={initData}
                isOpen={dialogOpen}
                onOpenChange={setDialogOpen}
            />

            <Table>
                <TableHeader>
                    <TableRow>
                        {mode !== formType.VIEW && (
                            <TableHead className="w-10 text-center">
                                <Checkbox
                                    id="select-all"
                                    checked={isAllSelected}
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Select all items"
                                />
                            </TableHead>
                        )}
                        <TableHead className="w-[200px]">Location</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Sequence</TableHead>
                        <TableHead className="text-right">Order</TableHead>
                        <TableHead className="text-right">Received</TableHead>
                        <TableHead className="text-right">FOC</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Discount Rate</TableHead>
                        <TableHead className="text-right">Tax Rate</TableHead>
                        <TableHead className="text-right">Tax Amount</TableHead>
                        <TableHead className="text-right">Total Amount</TableHead>
                        {mode !== formType.VIEW && (
                            <TableHead className="text-right">Action</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allItems.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={mode !== formType.VIEW ? 16 : 15} className="text-center">
                                No items available
                            </TableCell>
                        </TableRow>
                    ) : (
                        allItems.map((item, index) => (
                            <TableRow
                                key={item.id || `item-${index}`}
                                onClick={() => handleRowClick(item)}
                                className={mode !== formType.VIEW ? "cursor-pointer hover:bg-muted/50" : ""}
                            >
                                {mode !== formType.VIEW && (
                                    <TableCell className="text-center w-10" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            id={`checkbox-${item.id || index}`}
                                            checked={selectedItems.includes(item.id ?? '')}
                                            onCheckedChange={() => handleSelectItem(item.id ?? '')}
                                            aria-label={`Select ${item.id}`}
                                        />
                                    </TableCell>
                                )}
                                <TableCell>{getLocationName(item.location_id)}</TableCell>
                                <TableCell>{getProductName(item.product_id)}</TableCell>
                                <TableCell className="text-right">{item.sequence_no}</TableCell>
                                <TableCell className="text-right">
                                    {item.order_qty} {getUnitName(item.order_unit_id)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.received_qty} {getUnitName(item.received_unit_id)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.foc_qty} {getUnitName(item.foc_unit_id)}
                                </TableCell>
                                <TableCell className="text-right">{item.price}</TableCell>
                                <TableCell className="text-right">{item.discount_rate}</TableCell>
                                <TableCell className="text-right">{item.tax_rate}</TableCell>
                                <TableCell className="text-right">{item.tax_amount}</TableCell>
                                <TableCell className="text-right">{item.total_amount}</TableCell>
                                {mode !== formType.VIEW && (
                                    <TableCell className="text-right">
                                        <div className="flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => handleEditClick(e, item)}
                                                className="w-7 h-7"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-7 h-7"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}