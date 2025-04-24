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
import { Plus, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formType } from "@/dtos/form.dto";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ExtraCostProps {
    readonly control: Control<GrnFormValues>;
    readonly mode: formType
}

export default function ExtraCost({ control, mode }: ExtraCostProps) {
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
        <div className="p-2 space-y-2">
            <div className="flex justify-between items-center p-2">
                <p className="text-base font-medium">Extra Costs</p>
                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={handleAddExtraCost}
                    disabled={mode === formType.VIEW}
                >
                    <Plus />
                    Add Extra Cost
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-left">Type</TableHead>
                        <TableHead className="text-left">Amount</TableHead>
                        {mode !== formType.VIEW && (
                            <TableHead className="text-right">Action</TableHead>
                        )}
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
                                <TableCell className="text-left">
                                    <FormField
                                        control={control}
                                        name={`extra_cost.${index}.type`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    {mode === formType.VIEW ? (
                                                        <p className="text-xs">{field.value}</p>
                                                    ) : (
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
                                                    )}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell className="text-left">
                                    <FormField
                                        control={control}
                                        name={`extra_cost.${index}.amount`}
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
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => remove(index)}
                                            className="text-destructive"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <div className="flex items-start gap-6 p-2">

                <div className="space-y-2">
                    <p className="text-xs font-medium">Cost Distribution Method</p>
                    <RadioGroup defaultValue="netAmount" disabled={mode === formType.VIEW}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="netAmount" id="r1" />
                            <Label htmlFor="r1">Net Amount</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="quantity" id="r2" />
                            <Label htmlFor="r2">Quantity</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-medium">Total Extra Cost</p>
                    <p className="text-xs">75.00</p>
                </div>

            </div>
        </div>
    );
}
