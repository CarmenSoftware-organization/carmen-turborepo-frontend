import DateInput from "@/components/form-custom/DateInput";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/form-custom/form";
import WorkflowLookup from "@/components/lookup/WorkflowLookup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formType } from "@/dtos/form.dto";
import { enum_workflow_type } from "@/dtos/workflows.dto";
import { cn } from "@/lib/utils";
import { Building2, Calendar, CircleCheck, Clock4, FileText, GitBranch, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

interface HeadFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly form: UseFormReturn<any>;
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
    const tPr = useTranslations("PurchaseRequest");
    const lastThreeSteps = workflowStages && workflowStages.length > 0 ? workflowStages.slice(-3) : [];

    return (
        <div className="grid grid-cols-4 gap-2">
            <FormField
                control={form.control}
                name="body.pr_date"
                required
                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{tPr("pr_date")}</FormLabel>
                        <FormControl>
                            <DateInput field={field} disabled={true} />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="body.workflow_id"
                required
                icon={<GitBranch className="h-4 w-4 text-muted-foreground" />}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{tPr("pr_type")}</FormLabel>
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
                <Label>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <User className="h-4 w-4" />
                        {tPr("requestor")}
                    </div>
                </Label>
                <Input
                    placeholder="Requestor"
                    disabled
                    className="bg-muted"
                    value={requestor_name}
                />
            </div>
            <div className="space-y-2">
                <Label>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        {tPr("department")}
                    </div>
                </Label>
                <Input
                    placeholder="PR-XXXX"
                    disabled
                    className="bg-muted"
                    value={department_name}
                />
            </div>

            <FormField
                control={form.control}
                name="body.description"
                icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                render={({ field }) => (
                    <FormItem className="col-span-2 mt-2">
                        <FormLabel>{tPr("description")}</FormLabel>
                        <FormControl>
                            <Textarea
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder={tPr("description")}
                                className={cn(mode === formType.VIEW ? "bg-muted" : "")}
                                disabled={mode === formType.VIEW}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            {lastThreeSteps.length > 0 && (
                <div className="col-span-2 pt-8">
                    <div className={`bg-muted/80 p-2 rounded-md grid grid-cols-${lastThreeSteps.length} gap-0`}>
                        {lastThreeSteps.map((step, index) => {
                            const isLast = index === lastThreeSteps.length - 1;
                            const uniqueKey = `${step.title}-${index}`;
                            return (
                                <div key={uniqueKey} className="flex flex-col items-center relative">
                                    <div
                                        className={cn(
                                            "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium mb-1 z-10",
                                            isLast ? "bg-primary" : "bg-active"
                                        )}
                                    >
                                        {isLast ? (
                                            <Clock4 className="size-4 text-white" />
                                        ) : (
                                            <CircleCheck className="size-4 text-white" />
                                        )}
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
            )}
        </div>
    )
}