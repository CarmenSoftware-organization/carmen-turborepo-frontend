import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formType } from "@/dtos/form.dto";
import { PrSchemaV2Dto } from "@/dtos/pr.dto";
import { Control } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import DepartmentLookup from "@/components/lookup/DepartmentLookup";
import UserListLookup from "@/components/lookup/UserListLookup";
import WorkflowLookup from "@/components/lookup/WorkflowLookup";
import { enum_workflow_type } from "@/dtos/workflows.dto";
import { Textarea } from "@/components/ui/textarea";
import { useWorkflow } from "@/hooks/useWorkflow";
import { useDepartment } from "@/hooks/useDepartment";
import { useUserList } from "@/hooks/useUserList";

interface HeadPrFormProps {
    readonly control: Control<PrSchemaV2Dto>;
    readonly mode: formType;
    readonly prNo?: string;
}

export default function HeadPrForm({
    control,
    mode,
    prNo,
}: HeadPrFormProps) {

    const { getWorkflowName } = useWorkflow();
    const { getDepartmentName } = useDepartment();
    const { getUserName } = useUserList();
    return (
        <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">

                {mode !== formType.ADD && (
                    <div className="col-span-1">
                        <Label>PR Number</Label>
                        {mode === formType.VIEW ? (
                            <p className="text-xs text-muted-foreground mt-2">{prNo}</p>
                        ) : (
                            <Input
                                value={prNo}
                                disabled
                                className="mt-2"
                            />
                        )}
                    </div>
                )}


                <FormField
                    control={control}
                    name="pr_date"
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormLabel>PR Date</FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground mt-4">{field.value ? format(new Date(field.value), "PPP") : <span className="text-muted-foreground">Select date</span>}</p>
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
                                                    <span className="text-muted-foreground">Select date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={(date) => field.onChange(date ? date.toISOString() : new Date().toISOString())}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}

                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="workflow_id"
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormLabel>Pr Type</FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground mt-4">{getWorkflowName(field.value)}</p>
                            ) : (
                                <FormControl>
                                    <WorkflowLookup
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        type={enum_workflow_type.purchase_request}
                                    />
                                </FormControl>
                            )}
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="requestor_id"
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormLabel>Requestor</FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground mt-4">{getUserName(field.value)}</p>
                            ) : (
                                <FormControl>
                                    <UserListLookup
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    />
                                </FormControl>
                            )}
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="department_id"
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormLabel>Department</FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground mt-4">{getDepartmentName(field.value)}</p>
                            ) : (
                                <FormControl>
                                    <DepartmentLookup
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    />
                                </FormControl>
                            )}
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormLabel>Description</FormLabel>
                            {mode === formType.VIEW ? (
                                <p className="text-xs text-muted-foreground mt-4">{field.value ? field.value : '-'}</p>
                            ) : (
                                <FormControl>
                                    <Textarea {...field} value={field.value ?? ""} />
                                </FormControl>
                            )}
                        </FormItem>
                    )}
                />

            </div>
        </div>
    )
}
