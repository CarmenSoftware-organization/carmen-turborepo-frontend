import DateInput from "@/components/form-custom/DateInput";
import WorkflowLookup from "@/components/lookup/WorkflowLookup";
import { FormControl, FormItem, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestCreateFormDto, PurchaseRequestUpdateFormDto } from "@/dtos/purchase-request.dto";
import { enum_workflow_type } from "@/dtos/workflows.dto";
import { cn } from "@/lib/utils";
import { CircleCheck, Clock4 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface HeadFormProps {
    readonly form: UseFormReturn<PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto>;
    readonly mode: formType;
    readonly workflow_id?: string;
    readonly requestor_name?: string;
    readonly department_name?: string;
    readonly workflowStages?: {
        title: string;
    }[];
}

export default function HeadForm({
    form,
    mode,
    workflow_id,
    requestor_name,
    department_name,
    workflowStages
}: HeadFormProps) {

    const lastThreeSteps = workflowStages?.slice(-3);

    return (
        <div className="grid grid-cols-4 gap-2">
            <FormField
                control={form.control}
                name="pr_date"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>PR Date</FormLabel>
                        <FormControl>
                            <DateInput field={field} disabled={true} />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="workflow_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>PR Type</FormLabel>
                        <FormControl>
                            <WorkflowLookup
                                value={field.value ? field.value : workflow_id}
                                onValueChange={field.onChange}
                                type={enum_workflow_type.purchase_request}
                                disabled={mode === formType.VIEW}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="space-y-2">
                <Label>Requestor</Label>
                <Input
                    placeholder="Requestor"
                    disabled
                    className="bg-muted"
                    value={requestor_name}
                />
            </div>
            <div className="space-y-2">
                <Label>Department</Label>
                <Input
                    placeholder="PR-XXXX"
                    disabled
                    className="bg-muted"
                    value={department_name}
                />
            </div>

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem className="col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder="Description"
                                className={cn(mode === formType.VIEW ? "bg-muted" : "")}
                                disabled={mode === formType.VIEW}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <div className="col-span-2 pt-8">
                <div className={`bg-muted/80 p-2 rounded-md grid grid-cols-${lastThreeSteps?.length} gap-0`}>
                    {lastThreeSteps?.map((step, index) => {
                        const isLast = index === lastThreeSteps.length - 1;
                        return (
                            <div key={index} className="flex flex-col items-center relative">
                                <div
                                    className={cn(
                                        "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium mb-1 z-10",
                                        isLast ? "bg-primary" : "bg-active"
                                    )}
                                >
                                    {isLast ? <Clock4 className="size-4 text-white" /> : <CircleCheck className="size-4 text-white" />}
                                </div>
                                <span
                                    className={cn(
                                        "text-xs text-center",
                                        isLast ? "font-semibold text-primary" : "text-active"
                                    )}
                                >
                                    {step.title}
                                </span>
                                {index < lastThreeSteps.length - 1 && (
                                    <div className="absolute top-4 left-1/2 w-full h-0.5 bg-muted-foreground -translate-y-1/2"></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}