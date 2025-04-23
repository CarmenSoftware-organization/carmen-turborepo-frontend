"use client";

import { GrnFormValues, GrnItemFormValues } from "../../type.dto";
import { Control, useFieldArray } from "react-hook-form";
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
import { Edit, Eye, Trash } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import DialogItemGrnForm from "./DialogItemGrnForm";

interface ItemGrnProps {
    readonly control: Control<GrnFormValues>;
    readonly mode: formType;
}

export default function ItemGrn({ control, mode }: ItemGrnProps) {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const { fields, append } = useFieldArray({
        control,
        name: "items",
    });

    const handleSelectItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === fields.length) {
            setSelectedItems([]);
        } else {
            const allIds = fields.map(field => field.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const handleAddItem = (newItem: GrnItemFormValues) => {
        append(newItem);
    };

    const isAllSelected = fields.length > 0 && selectedItems.length === fields.length;

    return (
        <div className="space-y-2">
            <div className="flex justify-end">
                <DialogItemGrnForm mode={mode} onAddItem={handleAddItem} />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        {mode !== formType.VIEW && (
                            <TableHead className="w-10 text-center">
                                <Checkbox
                                    id="select-all"
                                    checked={isAllSelected}
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Select all purchase requests"
                                />
                            </TableHead>
                        )}
                        <TableHead className="w-[200px]">Location</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Lot No.</TableHead>
                        <TableHead className="text-right">Qty Order</TableHead>
                        <TableHead className="text-right">Qty Received</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Net Amount</TableHead>
                        <TableHead className="text-right">Tax Amount</TableHead>
                        <TableHead className="text-right">Total Amount</TableHead>
                        {mode !== formType.VIEW && (
                            <TableHead className="text-right">Action</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={mode !== formType.VIEW ? 12 : 10} className="text-center">
                                No items available
                            </TableCell>
                        </TableRow>
                    ) : (
                        fields.map((field) => (
                            <TableRow key={field.id}>
                                {mode !== formType.VIEW && (
                                    <TableCell className="text-center w-10">
                                        <Checkbox
                                            id={`checkbox-${field.id}`}
                                            checked={selectedItems.includes(field.id ?? '')}
                                            onCheckedChange={() => handleSelectItem(field.id ?? '')}
                                            aria-label={`Select ${field.id}`}
                                        />
                                    </TableCell>
                                )}
                                <TableCell>{field.locations.name}</TableCell>
                                <TableCell>{field.products.name}</TableCell>
                                <TableCell>{field.lot_no}</TableCell>
                                <TableCell className="text-right">{field.qty_order}</TableCell>
                                <TableCell className="text-right">{field.qty_received}</TableCell>
                                <TableCell>{field.unit.name}</TableCell>
                                <TableCell className="text-right">{field.price}</TableCell>
                                <TableCell className="text-right">{field.net_amount}</TableCell>
                                <TableCell className="text-right">{field.tax_amount}</TableCell>
                                <TableCell className="text-right">{field.total_amount}</TableCell>
                                {mode !== formType.VIEW && (
                                    <TableCell className="text-right">
                                        <div className="flex justify-end">
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Trash className="h-4 w-4 text-red-500" />
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