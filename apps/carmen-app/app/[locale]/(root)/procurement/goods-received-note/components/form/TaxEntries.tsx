"use client";

import { GrnFormValues } from "../../type.dto";
import { Control, useFieldArray } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
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
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { formType } from "@/dtos/form.dto";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Link } from "@/lib/navigation";

interface TaxEntriesProps {
    readonly control: Control<GrnFormValues>;
    readonly mode: formType;
}

export default function TaxEntries({ control, mode }: TaxEntriesProps) {
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
        <div className="p-2 space-y-4">
            <p className="text-base font-medium">Tax Entry</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <FormField
                    control={control}
                    name="tax_entries.tax_invoice_no"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vendor Tax Invoice#</FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs">{field.value}</p>
                            ) : (
                                <FormControl>
                                    <Input placeholder="Tax Invoice No" {...field} />
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="tax_entries.date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tax Invoice Date</FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs">{field.value}</p>
                            ) : (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(new Date(field.value), "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={(date) => field.onChange(date ? date.toISOString().split('T')[0] : "")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="tax_entries.status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs">{field.value}</p>
                            ) : (
                                <FormControl>
                                    <Input placeholder="Status" {...field} />
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="tax_entries.period"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Period</FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs">{field.value}</p>
                            ) : (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(new Date(field.value), "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={(date) => field.onChange(date ? date.toISOString().split('T')[0] : "")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-muted rounded-md p-2 space-y-2">
                    <p className="text-sm font-medium">Base Amount</p>
                    <FormField
                        control={control}
                        name="tax_entries.base_amount"
                        render={({ field }) => (
                            <FormItem>
                                {mode === formType.VIEW ? (
                                    <p className="text-xl font-medium">{field.value.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
                                ) : (
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="Base Amount"
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
                    <p className="text-xs text-muted-foreground">USD</p>
                </div>
                <div className="bg-muted rounded-md p-2 space-y-2">
                    <p className="text-sm font-medium">Tax Rate</p>
                    <FormField
                        control={control}
                        name="tax_entries.tax_rates"
                        render={({ field }) => (
                            <FormItem>
                                {mode === formType.VIEW ? (
                                    <p className="text-xl font-medium">{field.value}%</p>
                                ) : (
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="Tax Rate (%)"
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
                    <p className="text-xs text-muted-foreground">%</p>
                </div>
                <div className="bg-muted rounded-md p-2 space-y-2">
                    <p className="text-sm font-medium">Tax Amount</p>
                    <FormField
                        control={control}
                        name="tax_entries.tax_amount"
                        render={({ field }) => (
                            <FormItem>
                                {mode === formType.VIEW ? (
                                    <p className="text-xl font-medium">{field.value.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
                                ) : (
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="Tax Amount"
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
                    <p className="text-xs text-muted-foreground">USD</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <p className="text-base font-medium">Tax Calculation Details</p>
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={handleAddTaxCalculation}
                        disabled={mode === formType.VIEW}
                    >
                        <Plus />
                        Add Tax Calculation
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tax Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Base Amount</TableHead>
                            <TableHead className="text-right">Tax Rate (%)</TableHead>
                            {mode !== formType.VIEW && (
                                <TableHead className="w-[80px]">Action</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.length === 0 ? (
                            <TableRow>
                                <TableCell className="text-center">
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
                                            name={`tax_entries.tax_cal.${index}.description`}
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
                                            name={`tax_entries.tax_cal.${index}.amount`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    {mode === formType.VIEW ? (
                                                        <p className="text-xs">{field.value.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
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
                                            name={`tax_entries.tax_cal.${index}.base_amount`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    {mode === formType.VIEW ? (
                                                        <p className="text-xs">{field.value.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
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
                                            name={`tax_entries.tax_cal.${index}.tax_rate`}
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
                                    {mode !== formType.VIEW && (
                                        <TableCell>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => remove(index)}
                                                className="text-destructive"
                                            >
                                                <Trash />
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

            </div>

            <div className="space-y-2 border-b pb-4">
                <p className="text-base font-medium">VAT Return Details</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <FormField
                        control={control}
                        name="tax_entries.filling_period"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Filling Period</FormLabel>
                                {mode === formType.VIEW ? (
                                    <p className="text-xs">{field.value}</p>
                                ) : (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(new Date(field.value), "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => field.onChange(date ? date.toISOString().split('T')[0] : "")}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="tax_entries.filling_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Filling Date</FormLabel>
                                {mode === formType.VIEW ? (
                                    <p className="text-xs">{field.value}</p>
                                ) : (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(new Date(field.value), "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => field.onChange(date ? date.toISOString().split('T')[0] : "")}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="tax_entries.vat_return"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>VAT Return</FormLabel>
                                {mode === formType.VIEW ? (
                                    <p className="text-xs">{field.value}</p>
                                ) : (
                                    <FormControl>
                                        <Input placeholder="VAT Return" {...field} />
                                    </FormControl>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="tax_entries.filing_status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Filing Status</FormLabel>
                                {mode === formType.VIEW ? (
                                    <p className="text-xs">{field.value}</p>
                                ) : (
                                    <FormControl>
                                        <Input placeholder="Filing Status" {...field} />
                                    </FormControl>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                    Document Reference: GRN-2024-001
                </p>
                <Link href="/procurement/goods-received-note/vat-report" className="text-xs text-blue-500 hover:text-blue-600 hover:underline">
                    View VAT Report
                </Link>
            </div>
        </div>
    );
}
