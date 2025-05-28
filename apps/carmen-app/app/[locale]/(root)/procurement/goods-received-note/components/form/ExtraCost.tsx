"use client";

import { CreateGRNDto } from "@/dtos/grn.dto";
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

interface ExtraCostProps {
    readonly control: Control<CreateGRNDto>;
    readonly mode: formType
}

export default function ExtraCost({ control, mode }: ExtraCostProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "extra_cost.extra_cost_detail.add",
    });

    const handleAddExtraCost = () => {
        append({
            extra_cost_type_id: "",
            amount: 0,
            is_tax: false,
            tax_type_inventory_id: "",
            tax_type: "",
            tax_rate: 0,
            tax_amount: 0,
            is_tax_adjustment: false,
            note: "",
            info: { test1: "", test2: "" },
            dimension: { test1: "", test2: "" },
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
                        <TableHead className="text-left">Extra Cost Type ID</TableHead>
                        <TableHead className="text-left">Amount</TableHead>
                        <TableHead className="text-left">Tax Type</TableHead>
                        <TableHead className="text-right">Tax Rate</TableHead>
                        <TableHead className="text-right">Tax Amount</TableHead>
                        <TableHead className="text-left">Note</TableHead>
                        {mode !== formType.VIEW && (
                            <TableHead className="text-right">Action</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                No extra costs added
                            </TableCell>
                        </TableRow>
                    ) : (
                        fields.map((field, index) => (
                            <TableRow key={field.id}>
                                <TableCell className="text-left">
                                    <FormField
                                        control={control}
                                        name={`extra_cost.extra_cost_detail.add.${index}.extra_cost_type_id`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    {mode === formType.VIEW ? (
                                                        <p className="text-xs">{field.value}</p>
                                                    ) : (
                                                        <Input
                                                            placeholder="Extra Cost Type ID"
                                                            {...field}
                                                        />
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
                                        name={`extra_cost.extra_cost_detail.add.${index}.amount`}
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
                                <TableCell className="text-left">
                                    <FormField
                                        control={control}
                                        name={`extra_cost.extra_cost_detail.add.${index}.tax_type`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    {mode === formType.VIEW ? (
                                                        <p className="text-xs">{field.value}</p>
                                                    ) : (
                                                        <Input
                                                            placeholder="Tax Type"
                                                            {...field}
                                                        />
                                                    )}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <FormField
                                        control={control}
                                        name={`extra_cost.extra_cost_detail.add.${index}.tax_rate`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}%</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="100"
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
                                <TableCell className="text-right">
                                    <FormField
                                        control={control}
                                        name={`extra_cost.extra_cost_detail.add.${index}.tax_amount`}
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
                                <TableCell className="text-left">
                                    <FormField
                                        control={control}
                                        name={`extra_cost.extra_cost_detail.add.${index}.note`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    {mode === formType.VIEW ? (
                                                        <p className="text-xs">{field.value}</p>
                                                    ) : (
                                                        <Input
                                                            placeholder="Note"
                                                            {...field}
                                                        />
                                                    )}
                                                </FormControl>
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

            <div className="grid grid-cols-2 gap-4 p-2">
                <FormField
                    control={control}
                    name="extra_cost.name"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Extra Cost Name</Label>
                            <FormControl>
                                {mode === formType.VIEW ? (
                                    <p className="text-xs">{field.value}</p>
                                ) : (
                                    <Input placeholder="Extra Cost Name" {...field} />
                                )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="extra_cost.allocate_extracost_type"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Allocation Type</Label>
                            <FormControl>
                                {mode === formType.VIEW ? (
                                    <p className="text-xs">{field.value}</p>
                                ) : (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select allocation type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="manual">Manual</SelectItem>
                                            <SelectItem value="auto">Automatic</SelectItem>
                                            <SelectItem value="proportional">Proportional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="p-2">
                <FormField
                    control={control}
                    name="extra_cost.note"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Extra Cost Note</Label>
                            <FormControl>
                                {mode === formType.VIEW ? (
                                    <p className="text-xs">{field.value}</p>
                                ) : (
                                    <Input placeholder="Extra Cost Note" {...field} />
                                )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
