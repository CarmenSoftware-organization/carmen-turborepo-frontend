"use client";

import { GrnFormValues } from "../../type.dto";
import { Control, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GrnFormHeaderProps {
    readonly control: Control<GrnFormValues>;
    readonly readOnly?: boolean;
    readonly setValue?: UseFormSetValue<GrnFormValues>;
    readonly watch?: UseFormWatch<GrnFormValues>;
}

export default function GrnFormHeader({ control, readOnly = false, setValue, watch }: GrnFormHeaderProps) {
    return (
        <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {/* GRN Number */}
                <FormField
                    control={control}
                    name="info.grn_no"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>GRN Number</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={readOnly} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Date */}
                <FormField
                    control={control}
                    name="info.date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            disabled={readOnly}
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
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Vendor */}
                <FormField
                    control={control}
                    name="info.vendor"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vendor</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={readOnly} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Invoice Number */}
                <FormField
                    control={control}
                    name="info.invoice_no"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Invoice Number</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={readOnly} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Invoice Date */}
                <FormField
                    control={control}
                    name="info.invoice_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Invoice Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            disabled={readOnly}
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
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Currency */}
                <FormField
                    control={control}
                    name="info.currency"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select
                                disabled={readOnly}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="THB">THB</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                    <SelectItem value="JPY">JPY</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Exchange Rate */}
                <FormField
                    control={control}
                    name="info.exchange_rate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Exchange Rate</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    value={field.value}
                                    disabled={readOnly}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Payment Methods */}
                <div className="space-y-2">
                    <FormLabel>Payment Methods</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                        <FormField
                            control={control}
                            name="info.consignment"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 rounded-md border p-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(checked: boolean | "indeterminate") => {
                                                field.onChange(!!checked);
                                                if (checked && setValue) {
                                                    setValue("info.cash", false);
                                                    setValue("info.credit_term", 0);
                                                    setValue("info.due_date", "");
                                                }
                                            }}
                                            disabled={readOnly}
                                        />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer font-normal">
                                        Consignment
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="info.cash"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 rounded-md border p-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(checked: boolean | "indeterminate") => {
                                                field.onChange(!!checked);
                                                if (checked && setValue) {
                                                    setValue("info.consignment", false);
                                                    setValue("info.credit_term", 0);
                                                    setValue("info.due_date", "");
                                                }
                                            }}
                                            disabled={readOnly}
                                        />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer font-normal">
                                        Cash
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Credit Term */}
                <FormField
                    control={control}
                    name="info.credit_term"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Credit Term (Days)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min="0"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                    value={field.value}
                                    disabled={
                                        readOnly ||
                                        (watch && (watch("info.cash") || watch("info.consignment")))
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Due Date */}
                <FormField
                    control={control}
                    name="info.due_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Due Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            disabled={
                                                readOnly ||
                                                (watch && (watch("info.cash") || watch("info.consignment")))
                                            }
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
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Description */}
            <FormField
                control={control}
                name="info.description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea {...field} disabled={readOnly} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

