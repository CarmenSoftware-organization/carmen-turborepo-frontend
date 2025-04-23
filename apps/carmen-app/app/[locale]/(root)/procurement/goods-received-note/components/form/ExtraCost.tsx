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
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExtraCostProps {
    readonly control: Control<GrnFormValues>;
}

export default function ExtraCost({ control }: ExtraCostProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "extra_cost",
    });

    const handleAddExtraCost = () => {
        append({
            id: crypto.randomUUID(),
            type: "",
            amount: 0
        });
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="w-[100px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                    No extra costs added
                                </TableCell>
                            </TableRow>
                        ) : (
                            fields.map((field, index) => (
                                <TableRow key={field.id}>
                                    <TableCell>
                                        <FormField
                                            control={control}
                                            name={`extra_cost.${index}.type`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select cost type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="shipping">Shipping</SelectItem>
                                                                <SelectItem value="handling">Handling</SelectItem>
                                                                <SelectItem value="insurance">Insurance</SelectItem>
                                                                <SelectItem value="duty">Import Duty</SelectItem>
                                                                <SelectItem value="other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <FormField
                                            control={control}
                                            name={`extra_cost.${index}.amount`}
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
                                    <TableCell>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddExtraCost}
                className="mt-2"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Extra Cost
            </Button>
        </div>
    );
}
