import { formType } from "@/dtos/form.dto";
import { StoreRequisitionDetailDto } from "@/dtos/store-operation.dto";
import { Control } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

// UI components
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

interface StoreRequisitionFormHeaderProps {
    readonly control: Control<StoreRequisitionDetailDto>;
    readonly mode: formType;
}

export default function StoreRequisitionFormHeader({ control, mode }: StoreRequisitionFormHeaderProps) {
    return (
        <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Ref Number */}
                <FormField
                    control={control}
                    name="ref_no"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Reference Number</FormLabel>
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
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{field.value}</p>
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

                {/* Expected Delivery Date */}
                <FormField
                    control={control}
                    name="expected_delivery_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Expected Delivery Date</FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground">{field.value}</p>
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


                {/* Job Code */}
                <FormField
                    control={control}
                    name="job_code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Code</FormLabel>
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

                {/* From Department */}
                <FormField
                    control={control}
                    name="dp_req_from"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>From Department</FormLabel>
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

                {/* To Department */}
                <FormField
                    control={control}
                    name="dp_req_to"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>To Department</FormLabel>
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
            </div>

            {/* Description */}
            <FormField
                control={control}
                name="description"
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
