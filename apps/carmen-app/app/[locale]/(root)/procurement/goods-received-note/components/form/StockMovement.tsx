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

interface StockMovementProps {
    readonly control: Control<GrnFormValues>;
    readonly mode: formType;
}

export default function StockMovement({ control, mode }: StockMovementProps) {
    const { fields } = useFieldArray({
        control,
        name: "stock_movement",
    });

    return (
        <div className="p-2">
            <p className="pl-2 text-base font-medium">Stock Movement</p>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">Location</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Lot No.</TableHead>
                        <TableHead className="text-right">Stock In</TableHead>
                        <TableHead className="text-right">Stock Out</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Unit Cost</TableHead>
                        <TableHead className="text-right">Extra Cost</TableHead>
                        <TableHead className="text-right">Total Cost</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center">
                                No stock movements available
                            </TableCell>
                        </TableRow>
                    ) : (
                        fields.map((field, index) => (
                            <TableRow key={field.id}>
                                <TableCell>
                                    <FormField
                                        control={control}
                                        name={`stock_movement.${index}.location.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
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
                                        name={`stock_movement.${index}.product.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
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
                                        name={`stock_movement.${index}.lot_no`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
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
                                        name={`stock_movement.${index}.stock_in`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
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
                                        name={`stock_movement.${index}.stock_out`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
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
                                        name={`stock_movement.${index}.unit.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
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
                                        name={`stock_movement.${index}.unit_cost`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
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
                                        name={`stock_movement.${index}.extra_cost`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
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
                                        name={`stock_movement.${index}.total_cost`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
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
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

