import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestPostDto } from "@/dtos/pr.dto";
import { Control } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import DepartmentLookup from "@/components/lookup/DepartmentLookup";
import { Textarea } from "@/components/ui/textarea";
import UserListLookup from "@/components/lookup/UserListLookup";

interface HeadPrFormProps {
    readonly control: Control<PurchaseRequestPostDto>;
    readonly mode: formType;
    readonly prNo?: string;
}


export default function HeadPrForm({
    control,
    mode,
    prNo,
}: HeadPrFormProps) {
    return (
        <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">

                {mode !== formType.ADD && (
                    <div className="col-span-1">
                        <Label>PR Number</Label>
                        <Input
                            value={prNo}
                            disabled
                            className="mt-2"
                        />
                    </div>
                )}

                <FormField
                    control={control}
                    name="pr_date"
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormLabel>PR Date</FormLabel>
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
                                                format(parseISO(field.value), "PPP")
                                            ) : (
                                                <span className="text-muted-foreground">Select date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value ? parseISO(field.value) : undefined}
                                        onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="requestor_id"
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormLabel>Requestor</FormLabel>
                            <UserListLookup
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={mode === formType.VIEW}
                            />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="department_id"
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormLabel>Department</FormLabel>
                            <DepartmentLookup
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={mode === formType.VIEW}
                            />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="note"
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormLabel>Note</FormLabel>
                            <Input {...field} />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <Textarea {...field} />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}
