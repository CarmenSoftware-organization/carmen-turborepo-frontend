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
import { Checkbox } from "@/components/ui/checkbox";
import TaxTypeLookup from "@/components/lookup/TaxTypeLookup";
import { ALLOCATE_EXTRA_COST_TYPE, TaxType } from "@/constants/enum";

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
            tax_type: TaxType.NONE,
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
                        <TableHead className="text-center">Is Tax</TableHead>
                        <TableHead className="text-left">Tax Type Inventory ID</TableHead>
                        <TableHead className="text-left">Tax Type</TableHead>
                        <TableHead className="text-right">Tax Rate</TableHead>
                        <TableHead className="text-right">Tax Amount</TableHead>
                        <TableHead className="text-center">Tax Adjustment</TableHead>
                        <TableHead className="text-left">Note</TableHead>
                        {mode !== formType.VIEW && (
                            <TableHead className="text-right">Action</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center">
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
                                <TableCell className="text-center">
                                    <FormField
                                        control={control}
                                        name={`extra_cost.extra_cost_detail.add.${index}.is_tax`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    {mode === formType.VIEW ? (
                                                        <p className="text-xs">{field.value ? "Yes" : "No"}</p>
                                                    ) : (
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
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
                                        name={`extra_cost.extra_cost_detail.add.${index}.tax_type_inventory_id`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    {mode === formType.VIEW ? (
                                                        <p className="text-xs">{field.value}</p>
                                                    ) : (
                                                        <TaxTypeLookup
                                                            onValueChange={field.onChange}
                                                            value={field.value}
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
                                        name={`extra_cost.extra_cost_detail.add.${index}.tax_type`}
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
                                                                <SelectValue placeholder="Select tax type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value={TaxType.NONE}>None</SelectItem>
                                                                <SelectItem value={TaxType.INCLUDED}>Inclusive</SelectItem>
                                                                <SelectItem value={TaxType.ADD}>Add</SelectItem>
                                                            </SelectContent>
                                                        </Select>
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
                                <TableCell className="text-center">
                                    <FormField
                                        control={control}
                                        name={`extra_cost.extra_cost_detail.add.${index}.is_tax_adjustment`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    {mode === formType.VIEW ? (
                                                        <p className="text-xs">{field.value ? "Yes" : "No"}</p>
                                                    ) : (
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
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
                                            <SelectItem value={ALLOCATE_EXTRA_COST_TYPE.MANUAL}>Manual</SelectItem>
                                            <SelectItem value={ALLOCATE_EXTRA_COST_TYPE.BY_VALUE}>By Value</SelectItem>
                                            <SelectItem value={ALLOCATE_EXTRA_COST_TYPE.BY_QTY}>By Qty</SelectItem>
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

            {/* Extra Cost Info Section */}
            <div className="p-4 space-y-4 border-t">
                <p className="text-sm font-bold">Extra Cost Info</p>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="extra_cost.info.test1"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Info Test1</Label>
                                <FormControl>
                                    {mode === formType.VIEW ? (
                                        <p className="text-xs">{field.value}</p>
                                    ) : (
                                        <Input placeholder="Info Test1" {...field} />
                                    )}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="extra_cost.info.test2"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Info Test2</Label>
                                <FormControl>
                                    {mode === formType.VIEW ? (
                                        <p className="text-xs">{field.value}</p>
                                    ) : (
                                        <Input placeholder="Info Test2" {...field} />
                                    )}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            {/* Extra Cost Detail Items Additional Fields */}
            {fields.length > 0 && (
                <div className="p-4 space-y-4 border-t">
                    <p className="text-sm font-bold">Extra Cost Items - Additional Information</p>
                    {fields.map((field, index) => (
                        <div key={field.id} className="border rounded-lg p-4 space-y-4">
                            <p className="text-sm font-semibold">Item #{index + 1} - Additional Details</p>

                            {/* Info Fields */}
                            <div>
                                <p className="text-xs font-medium mb-2">Information</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <FormField
                                        control={control}
                                        name={`extra_cost.extra_cost_detail.add.${index}.info.test1`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Info Test1</Label>
                                                <FormControl>
                                                    {mode === formType.VIEW ? (
                                                        <p className="text-xs">{field.value}</p>
                                                    ) : (
                                                        <Input placeholder="Info Test1" {...field} />
                                                    )}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name={`extra_cost.extra_cost_detail.add.${index}.info.test2`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Info Test2</Label>
                                                <FormControl>
                                                    {mode === formType.VIEW ? (
                                                        <p className="text-xs">{field.value}</p>
                                                    ) : (
                                                        <Input placeholder="Info Test2" {...field} />
                                                    )}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Dimension Fields */}
                            <div>
                                <p className="text-xs font-medium mb-2">Dimensions</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <FormField
                                        control={control}
                                        name={`extra_cost.extra_cost_detail.add.${index}.dimension.test1`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Dimension Test1</Label>
                                                <FormControl>
                                                    {mode === formType.VIEW ? (
                                                        <p className="text-xs">{field.value}</p>
                                                    ) : (
                                                        <Input placeholder="Dimension Test1" {...field} />
                                                    )}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name={`extra_cost.extra_cost_detail.add.${index}.dimension.test2`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Dimension Test2</Label>
                                                <FormControl>
                                                    {mode === formType.VIEW ? (
                                                        <p className="text-xs">{field.value}</p>
                                                    ) : (
                                                        <Input placeholder="Dimension Test2" {...field} />
                                                    )}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
