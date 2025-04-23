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
import { Plus } from "lucide-react";

interface ItemGrnProps {
    readonly control: Control<GrnFormValues>;
    readonly mode: formType;
}

export default function ItemGrn({ control, mode }: ItemGrnProps) {
    const { fields } = useFieldArray({
        control,
        name: "items",
    });

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
                        <TableHead className="w-[200px]">Location</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Lot No.</TableHead>
                        <TableHead className="text-right">Qty Order</TableHead>
                        <TableHead className="text-right">Qty Received</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Net Amount</TableHead>
                        <TableHead className="text-right">Tax Amount</TableHead>
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
                                <TableCell>
                                    <FormField
                                        control={control}
                                        name={`items.${index}.locations.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
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
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
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
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
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
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
