"use client";

import { GrnFormValues } from "../../type.dto";
import { Control } from "react-hook-form";
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
import { formType } from "@/dtos/form.dto";
interface GrnFormHeaderProps {
    readonly control: Control<GrnFormValues>;
    readonly mode: formType;
}

export default function GrnFormHeader({ control, mode }: GrnFormHeaderProps) {
    return (
        <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                {/* GRN Number */}
                <FormField
                    control={control}
                    name="info.grn_no"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>GRN Number</FormLabel>
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

                {/* Date */}
                <FormField
                    control={control}
                    name="info.date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{format(new Date(field.value), "PPP")}</p>
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

                {/* Vendor */}
                <FormField
                    control={control}
                    name="info.vendor"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vendor</FormLabel>
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

                {/* Invoice Number */}
                <FormField
                    control={control}
                    name="info.invoice_no"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Invoice Number</FormLabel>
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

                {/* Invoice Date */}
                <FormField
                    control={control}
                    name="info.invoice_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Invoice Date</FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{format(new Date(field.value), "PPP")}</p>
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

                {/* Currency */}
                <FormField
                    control={control}
                    name="info.currency"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Currency</FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{field.value}</p>
                            ) : (
                                <Select
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
                            )}
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
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{field.value}</p>
                            ) : (
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        value={field.value}
                                    />
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Payment Methods */}


                {/* Credit Term */}
                <FormField
                    control={control}
                    name="info.credit_term"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Credit Term (Days)</FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{field.value}</p>
                            ) : (
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                        value={field.value}
                                    />
                                </FormControl>
                            )}
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
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{field.value ? format(new Date(field.value), "PPP") : ""}</p>
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

            <div className="mt-2 flex flex-col gap-2">
                <FormLabel>Payment Methods</FormLabel>
                <div className="flex flex-row gap-6">
                    <FormField
                        control={control}
                        name="info.consignment"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2">
                                <FormLabel className="cursor-pointer font-normal">
                                    Consignment
                                </FormLabel>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked: boolean | "indeterminate") => {
                                            field.onChange(!!checked);
                                        }}
                                        disabled={mode === formType.VIEW}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="info.cash"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2">
                                <FormLabel className="cursor-pointer font-normal">
                                    Cash
                                </FormLabel>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked: boolean | "indeterminate") => {
                                            field.onChange(!!checked);
                                        }}
                                        disabled={mode === formType.VIEW}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

            </div>

            {/* Description */}
            <FormField
                control={control}
                name="info.description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        {mode === formType.VIEW ? (
                            <p className="text-xs text-muted-foreground">{field.value}</p>
                        ) : (
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                        )}
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

