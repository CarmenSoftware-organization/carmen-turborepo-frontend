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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface TaxEntriesProps {
    readonly control: Control<GrnFormValues>;
    readonly readOnly?: boolean;
}

export default function TaxEntries({ control, readOnly = false }: TaxEntriesProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "tax_entries.tax_cal",
    });

    const handleAddTaxCalculation = () => {
        append({
            id: crypto.randomUUID(),
            name: "",
            description: "",
            amount: 0,
            base_amount: 0,
            tax_rate: 0
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tax Entry</CardTitle>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <FormField
                        control={control}
                        name="tax_entries.tax_invoice_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Tax Invoice No" {...field} disabled={readOnly} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="tax_entries.date"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="date" placeholder="Date" {...field} disabled={readOnly} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="tax_entries.status"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Status" {...field} disabled={readOnly} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="tax_entries.period"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Period" {...field} disabled={readOnly} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <FormField
                        control={control}
                        name="tax_entries.filling_period"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Filling Period" {...field} disabled={readOnly} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="tax_entries.filling_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="date" placeholder="Filling Date" {...field} disabled={readOnly} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="tax_entries.filing_status"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Filing Status" {...field} disabled={readOnly} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="tax_entries.vat_return"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="VAT Return" {...field} disabled={readOnly} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    <FormField
                        control={control}
                        name="tax_entries.tax_amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Tax Amount"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        value={field.value}
                                        disabled={readOnly}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="tax_entries.tax_rates"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Tax Rate (%)"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        value={field.value}
                                        disabled={readOnly}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="tax_entries.base_amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Base Amount"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        value={field.value}
                                        disabled={readOnly}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-2">Tax Calculations</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tax Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Base Amount</TableHead>
                                <TableHead className="text-right">Tax Rate (%)</TableHead>
                                {!readOnly && <TableHead className="w-[80px]">Action</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={readOnly ? 5 : 6} className="text-center">
                                        No tax calculations
                                    </TableCell>
                                </TableRow>
                            ) : (
                                fields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell>
                                            <FormField
                                                control={control}
                                                name={`tax_entries.tax_cal.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} disabled={readOnly} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={control}
                                                name={`tax_entries.tax_cal.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} disabled={readOnly} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <FormField
                                                control={control}
                                                name={`tax_entries.tax_cal.${index}.amount`}
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
                                                                disabled={readOnly}
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
                                                name={`tax_entries.tax_cal.${index}.base_amount`}
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
                                                                disabled={readOnly}
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
                                                name={`tax_entries.tax_cal.${index}.tax_rate`}
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
                                                                disabled={readOnly}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        {!readOnly && (
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
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    {!readOnly && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddTaxCalculation}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Tax Calculation
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
