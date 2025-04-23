"use client";

import { GrnFormValues } from "../../type.dto";
import { Control, useFieldArray } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface ItemGrnProps {
    readonly control: Control<GrnFormValues>;
    readonly mode: formType;
}

export default function ItemGrn({ control, mode }: ItemGrnProps) {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const { fields } = useFieldArray({
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

    const isAllSelected = fields.length > 0 && selectedItems.length === fields.length;

    return (
        <div className="space-y-2">
            <div className="flex justify-end">
                <Button variant="default" size="sm" disabled={mode === formType.VIEW}>
                    <Plus className="h-4 w-4" />
                    Add Item
                </Button>
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
                            <TableCell colSpan={9} className="text-center">
                                No items available
                            </TableCell>
                        </TableRow>
                    ) : (
                        fields.map((field, index) => (
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
                                <TableCell>
                                    <FormField
                                        control={control}
                                        name={`items.${index}.locations.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs text-muted-foreground">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <FormField
                                        control={control}
                                        name={`items.${index}.products.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs text-muted-foreground">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <FormField
                                        control={control}
                                        name={`items.${index}.lot_no`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs text-muted-foreground">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <FormField
                                        control={control}
                                        name={`items.${index}.qty_order`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs text-muted-foreground">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            className="text-right"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                            value={field.value}
                                                        />
                                                    </FormControl>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <FormField
                                        control={control}
                                        name={`items.${index}.qty_received`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs text-muted-foreground">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            className="text-right"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                            value={field.value}
                                                        />
                                                    </FormControl>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <FormField
                                        control={control}
                                        name={`items.${index}.unit.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs text-muted-foreground">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <FormField
                                        control={control}
                                        name={`items.${index}.price`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs text-muted-foreground">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            className="text-right"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                            value={field.value}
                                                        />
                                                    </FormControl>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <FormField
                                        control={control}
                                        name={`items.${index}.net_amount`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs text-muted-foreground">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            className="text-right"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                            value={field.value}
                                                        />
                                                    </FormControl>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <FormField
                                        control={control}
                                        name={`items.${index}.tax_amount`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs text-muted-foreground">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            className="text-right"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                            value={field.value}
                                                        />
                                                    </FormControl>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <FormField
                                        control={control}
                                        name={`items.${index}.total_amount`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs text-muted-foreground">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            className="text-right"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                            value={field.value}
                                                        />
                                                    </FormControl>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
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
