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
import { UseFormReturn } from "react-hook-form";

interface HeadFormProps {
    readonly form: UseFormReturn<PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto>;
    readonly mode: formType;
    readonly pr_no?: string;
    readonly workflow_id?: string;
}

export default function HeadForm({
    form,
    mode,
    pr_no,
    workflow_id
}: HeadFormProps) {
    return (
        <div className="col-span-3 grid grid-cols-4 gap-2">
            {mode !== formType.ADD && (
                <div className="space-y-2">
                    <Label>PR Number</Label>
                    <Input
                        placeholder="PR-XXXX"
                        disabled
                        className="bg-muted"
                        value={pr_no}
                    />
                </div>
            )}

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
                    <FormItem className={cn(mode === formType.ADD ? "col-span-3" : "col-span-2")}>
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

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem className="col-span-4">
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
        </div>
    )
}